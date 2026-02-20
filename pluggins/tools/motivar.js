// plugins/tools/motivar.js
export default async function motivarCommand({ sock, from, msg }) {
  const frases = [
    '💪 El éxito es la suma de pequeños esfuerzos',
    '🌟 No importa lo lento que vayas, no te detengas',
    '🚀 El único límite eres tú',
    '🌈 Cree en ti mismo y todo será posible',
  ]
  await sock.sendMessage(from, {
    text: `💭 ${frases[Math.floor(Math.random() * frases.length)]}`
  }, { quoted: msg })
  return true
}