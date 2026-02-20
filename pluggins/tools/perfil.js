// plugins/tools/perfil.js
import database from '../../database.js'
import {
  cualquiercosaToJid,
  jidToNumero,
  formatearNumero,
  isOwner
} from '../utils/validator.js'

export default async function perfilCommand({ sock, from, msg, args, config }) {
  try {
    // ===== PASO 1: DETERMINAR EL JID A BUSCAR =====
    let userJid = null
    let metodo = ''

    // Opción 1: Respondiendo a un mensaje (LA MÁS CONFIABLE)
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    if (quotedMsg) {
      userJid = msg.message.extendedTextMessage.contextInfo.participant
      metodo = 'respuesta a mensaje'
      console.log('📌 Método:', metodo, 'JID:', userJid)
    }

    // Opción 2: Hay argumentos (puede ser @mencion o número)
    if (!userJid && args.length > 0) {
      const inputCompleto = args.join(' ')
      userJid = cualquiercosaToJid(inputCompleto)
      metodo = 'argumentos: ' + inputCompleto
      console.log('📌 Método:', metodo, 'JID:', userJid)
    }

    // Opción 3: Sin argumentos ni respuesta, es el propio usuario
    if (!userJid) {
      userJid = from
      metodo = 'propio usuario'
      console.log('📌 Método:', metodo, 'JID:', userJid)
    }

    if (!userJid) {
      await sock.sendMessage(from, {
        text: '❌ No se pudo determinar el usuario. Usa:\n.perfil @usuario\n.perfil 51929416952\nO responde a un mensaje con .perfil'
      })
      return true
    }

    // ===== PASO 2: VERIFICAR QUE EL USUARIO EXISTE =====
    console.log('🔍 Buscando usuario:', userJid)
    const [profile] = await sock.onWhatsApp(userJid)

    if (!profile?.exists) {
      await sock.sendMessage(from, {
        text: `❌ Usuario no encontrado\n\nJID buscado: ${userJid}\n\n💡 Tips:\n• Responde a su mensaje con .perfil (es lo más seguro)\n• Etiqueta directamente: .perfil @usuario\n• Usa el número: .perfil 51929416952`
      })
      return true
    }

    // ===== PASO 3: OBTENER DATOS =====
    const numeroReal = jidToNumero(profile.jid)
    const numeroFormateado = formatearNumero(numeroReal)

    // Obtener nombre del grupo
    let nombre = 'Desconocido'
    if (from.endsWith('@g.us')) {
      try {
        const groupMetadata = await sock.groupMetadata(from)
        const participant = groupMetadata.participants.find(p => p.id === profile.jid)
        nombre = participant?.notify || participant?.id?.split('@')[0] || numeroReal
      } catch {
        nombre = numeroReal
      }
    } else {
      nombre = numeroReal
    }

    // Datos de la base de datos
    const userData = database.getUsuario(profile.jid) || { nivel: 1, monedas: 100 }
    const mensajes = database.getUsuarioMensajes?.(from, profile.jid) || 0

    const esOwner = isOwner(profile.jid, config)
    const ownerBadge = esOwner ? ' 👑' : ''

    // ===== PASO 4: CREAR MENSAJE CON MENCIÓN =====
    let perfilText = `╔══════════════════╗\n`
    perfilText += `║  👤 *PERFIL*${ownerBadge}  ║\n`
    perfilText += `╠══════════════════╣\n`
    perfilText += `║ 📱 *Número:* ${numeroFormateado}\n`
    perfilText += `║ 📛 *Nombre:* ${nombre}\n`
    perfilText += `║ ⭐ *Nivel:* ${userData.nivel}\n`
    perfilText += `║ 💰 *Monedas:* ${userData.monedas}\n`
    perfilText += `║ 📨 *Mensajes:* ${mensajes}\n`

    // Intentar obtener foto
    try {
      const ppUrl = await sock.profilePictureUrl(profile.jid, 'image')
      perfilText += `║ 🖼️ *Foto:* Disponible\n╚══════════════════╝`
      await sock.sendMessage(from, {
        image: { url: ppUrl },
        caption: perfilText,
        mentions: [profile.jid] // Para que el @ sea cliqueable
      }, { quoted: msg })
    } catch {
      perfilText += `║ 🖼️ *Foto:* No disponible\n╚══════════════════╝`
      await sock.sendMessage(from, {
        text: perfilText,
        mentions: [profile.jid]
      }, { quoted: msg })
    }

  } catch (e) {
    console.log('Error perfil:', e)
    await sock.sendMessage(from, {
      text: '❌ Error al obtener perfil. Intenta respondiendo a su mensaje con .perfil'
    })
  }
  return true
}