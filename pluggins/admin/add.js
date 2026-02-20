// plugins/admin/add.js
export default async function addCommand({ sock, from, args, esAdmin }) {
  if (!esAdmin) {
    await sock.sendMessage(from, { text: '❌ Solo admins' })
    return true
  }

  const input = args.join('')
  if (!input) {
    await sock.sendMessage(from, { text: '❌ Ejemplo: .add 521234567890' })
    return true
  }

  try {
    let numero = input.replace(/[^0-9]/g, '')
    if (numero.length < 10) {
      await sock.sendMessage(from, { text: '❌ Número inválido' })
      return true
    }

    const jid = numero + '@s.whatsapp.net'
    await sock.sendMessage(from, { text: `👤 Añadiendo +${numero}...` })
    await sock.groupParticipantsUpdate(from, [jid], 'add')
    await sock.sendMessage(from, { text: '*Un marrón ha sido añadido* 👨🏾' })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error al añadir' })
  }
  return true
}