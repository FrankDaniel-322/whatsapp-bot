// plugins/basic/info.js
export default async function infoCommand({ sock, from, msg, config }) {
  const uptime = process.uptime()
  const hours = Math.floor(uptime / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)

  let infoText = `╔════════════════════════════╗\n║  ℹ️ ${config.mensajes.respuestas.info}  ║\n╠════════════════════════════╣\n`
  infoText += `║ 🤖 *${config.botName}*\n║ ⏰ *Uptime:* ${hours}h ${minutes}m\n║ 👤 *Owner:* ${config.ownerName}\n║ 🔣 *Prefijo:* ${config.prefix}\n╚════════════════════════════╝`

  await sock.sendMessage(from, { text: infoText }, { quoted: msg })
  return true
}