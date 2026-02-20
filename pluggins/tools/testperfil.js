// plugins/tools/testperfil.js
import { cualquiercosaToJid, jidToNumero } from '../utils/validator.js'

export default async function testperfilCommand({ sock, from, msg, args }) {

  if (args.length === 0) {
    await sock.sendMessage(from, {
      text: '❌ Usa: .testperfil @usuario o .testperfil 51929416952'
    })
    return true
  }

  const inputCompleto = args.join(' ')
  const jid = cualquiercosaToJid(inputCompleto)
  const numero = jidToNumero(jid)

  let respuesta = `🔍 *TEST PERFIL - DEBUG*\n\n`
  respuesta += `📝 Input: ${inputCompleto}\n`
  respuesta += `🔗 JID generado: ${jid}\n`
  respuesta += `📱 Número extraído: ${numero}\n\n`

  try {
    const [profile] = await sock.onWhatsApp(jid)

    if (profile?.exists) {
      respuesta += `✅ *USUARIO ENCONTRADO*\n`
      respuesta += `📌 JID real: ${profile.jid}\n`
      respuesta += `📌 Número real: ${profile.jid.split('@')[0]}`
    } else {
      respuesta += `❌ *USUARIO NO ENCONTRADO*\n\n`
      respuesta += `💡 Prueba respondiendo a su mensaje con .perfil`
    }
  } catch (e) {
    respuesta += `❌ Error en la búsqueda`
  }

  await sock.sendMessage(from, { text: respuesta })
  return true
}