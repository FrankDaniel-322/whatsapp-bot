// plugins/tools/chiste.js
export default async function chisteCommand({ sock, from, msg }) {
  const chistes = [
    '¿Qué le dice un semáforo a otro? "No me mires que me estoy cambiando" 🚦',
    '¿Cómo se despiden los químicos? "Ácido un placer" 🧪',
    '¿Qué hace una abeja en el gimnasio? Zumba 🐝',
    '¿Qué le dice una iguana a su hermana? "Iguanita" 🦎',
  ]
  await sock.sendMessage(from, {
    text: `😂 ${chistes[Math.floor(Math.random() * chistes.length)]}`
  }, { quoted: msg })
  return true
}