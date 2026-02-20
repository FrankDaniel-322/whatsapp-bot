// plugins/admin/promote.js
import { isProtectedUser } from '../../utils/validator.js'

export default async function promoteCommand({ sock, from, msg, config, esAdmin }) {
  if (!esAdmin) {
    await sock.sendMessage(from, { text: '❌ Solo admins' })
    return true
  }

  const mentions = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
  if (!mentions?.length) {
    await sock.sendMessage(from, { text: '❌ Menciona a alguien' })
    return true
  }

  // 🛡️ PROTECCIÓN: No permitir promover al owner (no tiene sentido)
  for (const mention of mentions) {
    if (isProtectedUser(mention, config)) {
      await sock.sendMessage(from, {
        text: '🚫 El owner (51929416952) ya es admin supremo y no necesita ser promovido.'
      })
      return true
    }
  }

  try {
    await sock.groupParticipantsUpdate(from, mentions, 'promote')
    await sock.sendMessage(from, { text: '🔱 *Usuario promovido a admin* 🏛️' })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error al promover' })
  }
  return true
}