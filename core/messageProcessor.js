// core/messageProcessor.js
import database from '../database.js'
import logger from '../pluggins/utils/logger.js'
import { PluginLoader } from '../pluggins/index.js'
import { isOwner } from '../pluggins/utils/validator.js'

const pluginLoader = new PluginLoader()

export async function processMessage(messages, sock, config) {
  const msg = messages[0]
  if (!msg.message || msg.key.fromMe) return

  const from = msg.key.remoteJid
  const sender = msg.key.participant || from
  const body = msg.message.conversation ||
               msg.message.extendedTextMessage?.text ||
               msg.message.imageMessage?.caption || ''

  if (!body) return

  // ================================
  // VERIFICAR OWNER (CON DEBUG)
  // ================================
  const esOwner = isOwner(sender, config)

  // Debug temporal mejorado
  console.log(`📨 MENSAJE DE: ${sender}`)
  console.log(`   - Número extraído: ${sender.split('@')[0]}`)
  console.log(`   - ¿Es owner?: ${esOwner ? '✅' : '❌'}`)

  // ================================
  // IA AUTO MODE
  // ================================
  if (from.endsWith('@g.us')) {
    try {
      const { modoAuto, procesarAuto } = await import('../pluggins/ai/auto.js')
      if (modoAuto.has(from)) {
        await procesarAuto(msg, body, from, sender, esOwner, sock, config)
      }
    } catch (e) {}
  }

  // ================================
  // CONTAR MENSAJES PARA EL TOP
  // ================================
  if (from.endsWith('@g.us')) {
    database.contarMensaje(from, sender)
    database.registrarUsuario(sender, msg.pushName)
  }

  // ================================
  // VERIFICAR PERMISOS DE GRUPO
  // ================================
  if (config.soloGrupo.activado && !esOwner && from !== config.soloGrupo.id) {
    return
  }

  // ================================
  // PROCESAR COMANDOS
  // ================================
  if (body.startsWith(config.prefix)) {
    const command = body.slice(config.prefix.length).trim().split(/ +/).shift().toLowerCase()
    const args = body.trim().split(/ +/).slice(1)

    let esAdmin = esOwner
    if (from.endsWith('@g.us') && !esAdmin) {
      try {
        const group = await sock.groupMetadata(from)
        const participant = group.participants.find(p => p.id === sender)
        esAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin'
      } catch {}
    }

    const result = await pluginLoader.execute(command, {
      sock, from, msg, args, config, esAdmin, esOwner, sender
    })

    if (!result) {
      logger.warn(`Comando no encontrado: ${command}`)
    }
  }
}
