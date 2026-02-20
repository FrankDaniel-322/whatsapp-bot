// plugins/games/ppt.js
export default async function pptCommand({ sock, from, args, msg }) {
  const opciones = ['piedra', 'papel', 'tijera']
  const emojis = { piedra: '🪨', papel: '📄', tijera: '✂️' }

  if (!opciones.includes(args[0]?.toLowerCase())) {
    await sock.sendMessage(from, { text: '❌ Usa: .ppt piedra/papel/tijera' })
    return true
  }

  const user = args[0].toLowerCase()
  const bot = opciones[Math.floor(Math.random() * 3)]

  let res
  if (user === bot) res = '🤝 Empate'
  else if (
    (user === 'piedra' && bot === 'tijera') ||
    (user === 'papel' && bot === 'piedra') ||
    (user === 'tijera' && bot === 'papel')
  ) res = '🎉 GANASTE 🎉'
  else res = 'Perdiste... 🫵😹'

  await sock.sendMessage(from, {
    text: `✂️ *PPT*\n\nTú: ${emojis[user]} ${user}\nBot: ${emojis[bot]} ${bot}\n\n${res}`
  }, { quoted: msg })
  return true
}