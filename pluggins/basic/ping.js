// plugins/basic/ping.js
export default async function pingCommand({ sock, from, msg, config }) {
  const start = Date.now()
  await sock.sendMessage(from, { text: '🏓' }, { quoted: msg })
  const end = Date.now()
  await sock.sendMessage(from, { text: `⚡ ${config.mensajes.respuestas.ping} *${end - start}ms*` })
  return true
}