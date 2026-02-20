// plugins/tools/top.js
import database from '../../database.js'
import { jidToNumero, formatearNumero } from '../utils/validator.js'

export default async function topCommand({ sock, from, msg }) {
  try {
    const groupMetadata = await sock.groupMetadata(from)
    const stats = []
    let totalGrupo = 0

    // Recopilar datos
    for (const participant of groupMetadata.participants) {
      const mensajes = database.getUsuarioMensajes?.(from, participant.id) || 0
      if (mensajes > 0) {
        const numeroReal = jidToNumero(participant.id)
        stats.push({
          jid: participant.id,
          numero: numeroReal,
          mensajes
        })
        totalGrupo += mensajes
      }
    }

    // Ordenar de mayor a menor
    stats.sort((a, b) => b.mensajes - a.mensajes)

    if (stats.length === 0) {
      await sock.sendMessage(from, { text: '📊 Aún no hay datos' })
      return true
    }

    // Crear mensaje con menciones
    let topText = `╔════════════════════════════╗\n`
    topText += `║  🏆 *TOP MENSAJES*  🏆\n`
    topText += `╠════════════════════════════╣\n`

    const mentions = []
    const mostrar = Math.min(15, stats.length)

    for (let i = 0; i < mostrar; i++) {
      const user = stats[i]
      const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📌'

      // Agregar a menciones
      mentions.push(user.jid)

      // Mostrar con @ para que sea etiquetable
      topText += `║ ${emoji} ${i+1}. @${user.numero}\n`
      topText += `║    📨 ${user.mensajes} mensajes\n`
    }

    topText += `╠════════════════════════════╣\n`
    topText += `║ 📊 *Total:* ${totalGrupo}\n`
    topText += `║ 👥 *Activos:* ${stats.length}\n`
    topText += `╚════════════════════════════╝`

    // Enviar con menciones para que sean cliqueables
    await sock.sendMessage(from, {
      text: topText,
      mentions: mentions
    }, { quoted: msg })

  } catch (e) {
    console.log('Error top:', e)
    await sock.sendMessage(from, { text: '❌ Error al obtener top' })
  }
  return true
}