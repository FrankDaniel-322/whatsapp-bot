// plugins/games/dado.js
export default async function dadoCommand({ sock, from, msg }) {
  const r = Math.floor(Math.random() * 6) + 1
  const dados = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
  await sock.sendMessage(from, { text: `🎲 *${r}* ${dados[r-1]}` }, { quoted: msg })
  return true
}