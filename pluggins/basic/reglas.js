// plugins/basic/reglas.js
export default async function reglasCommand({ sock, from, msg, config }) {
  let reglasText = `╔════════════════════════════╗\n║  📜 *REGLAS DEL GRUPO*  ║\n╠════════════════════════════╣\n`

  config.mensajes.reglas.forEach((regla, index) => {
    reglasText += `║ ${index + 1}. ${regla}\n`
  })

  reglasText += `╚════════════════════════════╝`

  await sock.sendMessage(from, { text: reglasText }, { quoted: msg })
  return true
}