// plugins/tools/dato.js
export default async function datoCommand({ sock, from, msg }) {
  const datos = [
    '🐘 Los elefantes no pueden saltar',
    '🍌 Las bananas son radioactivas',
    '🐙 Los pulpos tienen 3 corazones',
    '🍯 La miel nunca caduca',
  ]
  await sock.sendMessage(from, { 
    text: `🔍 ${datos[Math.floor(Math.random() * datos.length)]}` 
  }, { quoted: msg })
  return true
}