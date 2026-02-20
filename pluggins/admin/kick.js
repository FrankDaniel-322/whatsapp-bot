// plugins/admin/kick.js
import { isProtectedUser } from '../../utils/validator.js'

export default async function kickCommand({ sock, from, msg, config, esAdmin }) {
  if (!esAdmin) {
    await sock.sendMessage(from, { text: '❌ Solo admins pueden usar este comando' })
    return true
  }

  const mentions = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
  if (!mentions?.length) {
    await sock.sendMessage(from, { text: '❌ Menciona a alguien para eliminar' })
    return true
  }

  // 🛡️ PROTECCIÓN ABSOLUTA: No permitir kickear al owner (51929416952)
  for (const mention of mentions) {
    if (isProtectedUser(mention, config)) {
      await sock.sendMessage(from, {
        text: '🚫 *ERROR DE SEGURIDAD*\n\nNo puedes eliminar al creador del bot (51929416952). Este usuario está protegido.'
      })
      return true
    }
  }

  try {
    await sock.groupParticipantsUpdate(from, mentions, 'remove')
    await sock.sendMessage(from, { text: '🏳️‍🌈 *Usuario eliminado* 🏳️‍🌈' })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error al eliminar usuario' })
  }
  return true
}