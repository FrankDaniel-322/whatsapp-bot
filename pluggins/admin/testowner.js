// pluggins/admin/testowner.js
import { isOwner, extractPhoneNumber, formatPhoneNumber } from '../utils/validator.js'

export default async function testownerCommand({ sock, from, msg, config, sender }) {

  // Verificar si es owner usando la función correcta
  const esOwner = isOwner(sender, config)
  const numeroReal = extractPhoneNumber(sender)
  const numeroFormateado = formatPhoneNumber(numeroReal)

  // Determinar el mensaje según el resultado
  let mensajeEstado = ''
  let emojiEstado = ''

  if (esOwner) {
    mensajeEstado = '✅ SÍ ERES EL OWNER'
    emojiEstado = '👑'
  } else {
    mensajeEstado = '❌ NO ERES EL OWNER'
    emojiEstado = '😢'
  }

  const info = `
🔍 *TEST DE OWNER* ${emojiEstado}

${mensajeEstado}

📱 *Tu información:*
• JID: ${sender}
• Número real: ${numeroFormateado}
• Tipo: ${sender.includes('g.us') ? 'Grupo' : 'Usuario'}

👑 *Owner configurado:*
• Número: ${config.ownerNumber}

📊 *Debug:*
• ¿Coincide? ${esOwner ? '✅' : '❌'}

💡 *¿Qué significa?*
${esOwner
  ? 'Puedes usar todos los comandos de admin sin restricciones.'
  : 'No tienes permisos de admin. Pide al owner que te agregue.'}
  `

  await sock.sendMessage(from, { text: info }, { quoted: msg })
  return true
}