// plugins/admin/tagall.js
import { extractPhoneNumber, getDisplayNumber } from '../utils/validator.js'

export default async function tagallCommand({ sock, from, args, esAdmin }) {
  if (!esAdmin) {
    await sock.sendMessage(from, { text: '❌ Solo admins' })
    return true
  }

  try {
    const groupMetadata = await sock.groupMetadata(from)
    const participants = groupMetadata.participants

    let text = `👥 *MENCIONANDO A TODOS*\n\n`
    if (args.length) text += `📝 *Mensaje:* ${args.join(' ')}\n\n`

    text += `*Total: ${participants.length} miembros*\n\n`

    const mentions = []
    participants.forEach(p => {
      mentions.push(p.id)
      // 🔥 Mostrar número legible en la lista
      const numero = getDisplayNumber(p.id)
      text += `• @${numero}\n`
    })

    await sock.sendMessage(from, {
      text,
      mentions
    })

  } catch (e) {
    console.log('Error tagall:', e)
    await sock.sendMessage(from, { text: '❌ Error al mencionar' })
  }
  return true
}