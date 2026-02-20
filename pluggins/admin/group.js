// plugins/admin/group.js
export default async function groupCommand({ sock, from, args, esAdmin }) {
  if (!esAdmin) {
    await sock.sendMessage(from, { text: '❌ Solo admins' })
    return true
  }

  const sub = args[0]?.toLowerCase()

  if (sub === 'abrir') {
    await sock.groupSettingUpdate(from, 'not_announcement')
    await sock.sendMessage(from, { text: '🔓 Grupo abierto' })
  } else if (sub === 'cerrar') {
    await sock.groupSettingUpdate(from, 'announcement')
    await sock.sendMessage(from, { text: '🔒 Grupo cerrado' })
  } else {
    await sock.sendMessage(from, { text: '❌ Usa: .grupo abrir/cerrar' })
  }
  return true
}