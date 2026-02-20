// plugins/tools/getid.js
import { extractPhoneNumber, getReadableNumber, formatPhoneNumber } from '../utils/validator.js'

export default async function getidCommand({ sock, from, msg, sender }) {

  const numeroReal = getReadableNumber(sender)
  const numeroFormateado = formatPhoneNumber(numeroReal)
  const jidOriginal = sender

  const info = `
📱 *TU INFORMACIÓN*

• JID completo: ${jidOriginal}
• Número real: ${numeroReal}
• Número formateado: ${numeroFormateado}

🔧 *Para ver perfil de alguien:*
1. Responde a su mensaje con .perfil
2. Etiquétalo con .perfil @usuario
3. Usa .perfil ${numeroReal}

⚠️ *NOTA:*
Tu número real es ${numeroReal}, aunque WhatsApp te haya dado un JID diferente.
  `

  await sock.sendMessage(from, { text: info }, { quoted: msg })
  return true
}