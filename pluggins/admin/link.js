// plugins/admin/link.js
export default async function linkCommand({ sock, from, esAdmin }) {
  if (!esAdmin) {
    await sock.sendMessage(from, { text: '❌ Solo admins' })
    return true
  }

  try {
    const code = await sock.groupInviteCode(from)
    await sock.sendMessage(from, { text: `🔗 *LINK:*\nhttps://chat.whatsapp.com/${code}` })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error' })
  }
  return true
}