// plugins/admin/demote.js
import { isProtectedUser } from '../../utils/validator.js'

export default async function demoteCommand({ sock, from, msg, config, esAdmin }) {
  if (!esAdmin) {
    await sock.sendMessage(from, { text: '❌ Solo admins' })
    return true
  }

  const mentions = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
  if (!mentions?.length) {
    await sock.sendMessage(from, { text: '❌ Menciona a alguien' })
    return true
  }

  // 🛡️ PROTECCIÓN: No permitir degradar al owner
  for (const mention of mentions) {
    if (isProtectedUser(mention, config)) {
      await sock.sendMessage(from, {
        text: '🚫 No puedes degradar al creador del bot (51929416952). Es el admin supremo.'
      })
      return true
    }
  }

  try {
    await sock.groupParticipantsUpdate(from, mentions, 'demote')
    await sock.sendMessage(from, { text: '💀 *Admin degradado* 👹' })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error al degradar' })
  }
  return true
}