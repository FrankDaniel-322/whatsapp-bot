// plugins/games/adivina.js
import { juegosActivos } from './juegosActivos.js'

export default async function adivinaCommand({ sock, from, args, msg }) {
  const juego = juegosActivos.get(from)

  if (!juego) {
    const num = Math.floor(Math.random() * 100) + 1
    juegosActivos.set(from, { numero: num, intentos: 0 })
    await sock.sendMessage(from, {
      text: '🎯 *ADIVINA EL NÚMERO*\n\nHe pensado un número del 1 al 100.\nUsa .adivina [número]'
    }, { quoted: msg })
    return true
  }

  const num = parseInt(args[0])
  if (isNaN(num)) {
    await sock.sendMessage(from, { text: '❌ Envía un número' })
    return true
  }

  juego.intentos++

  if (num === juego.numero) {
    juegosActivos.delete(from)
    await sock.sendMessage(from, {
      text: `🎉 *CORRECTO!*\n\nNúmero: ${num}\nIntentos: ${juego.intentos}`
    }, { quoted: msg })
  } else if (num < juego.numero) {
    await sock.sendMessage(from, { text: '⬆️ Más alto' })
  } else {
    await sock.sendMessage(from, { text: '⬇️ Más bajo' })
  }
  return true
}