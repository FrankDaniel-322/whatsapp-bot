// plugins/games/trivia.js
import { juegosActivos } from './juegosActivos.js'

const preguntas = [
  { pregunta: '¿Cuál es la capital de Perú?', respuesta: 'lima', pista: 'Empieza con L' },
  { pregunta: '¿En qué continente está México?', respuesta: 'america', pista: 'No es Europa' },
  { pregunta: '¿Cuántos días tiene una semana?', respuesta: '7', pista: 'Es un número' },
  { pregunta: '¿De qué color es el caballo blanco de Napoleón?', respuesta: 'blanco', pista: 'Color claro' },
  { pregunta: '¿Cuál es el planeta más cercano al Sol?', respuesta: 'mercurio', pista: 'Empieza con M' },
]

export default async function triviaCommand({ sock, from, msg, args }) {
  const juegoKey = `trivia_${from}`

  if (juegosActivos.has(juegoKey)) {
    const juego = juegosActivos.get(juegoKey)

    if (args.length > 0) {
      const respuestaUsuario = args.join(' ').toLowerCase().trim()

      if (respuestaUsuario === juego.respuesta) {
        juegosActivos.delete(juegoKey)
        await sock.sendMessage(from, {
          text: `🎉 *¡CORRECTO!*\n\n✅ Respuesta: ${juego.respuesta}`
        }, { quoted: msg })
      } else {
        const tiempoRestante = Math.max(0, Math.floor((juego.expira - Date.now()) / 1000))
        await sock.sendMessage(from, {
          text: `❌ Incorrecto\n⏱️ Tiempo: ${tiempoRestante}s\n💡 Pista: ${juego.pista}`
        })
      }
    }
    return true
  }

  const pregunta = preguntas[Math.floor(Math.random() * preguntas.length)]
  const juego = {
    ...pregunta,
    expira: Date.now() + 15000
  }

  juegosActivos.set(juegoKey, juego)

  await sock.sendMessage(from, {
    text: `📚 *TRIVIA EXPRESS*\n\n❓ ${pregunta.pregunta}\n\n⏱️ Tienes 15 segundos.`
  }, { quoted: msg })

  setTimeout(() => {
    if (juegosActivos.has(juegoKey)) {
      juegosActivos.delete(juegoKey)
      sock.sendMessage(from, {
        text: `⏰ *TIEMPO AGOTADO*\n\n✅ Respuesta: ${pregunta.respuesta}`
      })
    }
  }, 15000)

  return true
}