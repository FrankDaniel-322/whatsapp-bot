// pluggins/ai/memoria.js
import { limpiarMemoria } from './groq.js'

// Ver historial de conversación
export async function memoriaCommand({ sock, from, msg, sender }) {
  try {
    const { memoriaConversacion } = await import('./groq.js')
    const userData = memoriaConversacion.get(sender)

    if (!userData || userData.historial.length === 0) {
      await sock.sendMessage(from, {
        text: '📭 No hay historial de conversación contigo.'
      })
      return true
    }

    let texto = `📝 *TU HISTORIAL CON LA IA*\n\n`
    const ultimos = userData.historial.slice(-6) // Últimos 3 intercambios

    for (let i = 0; i < ultimos.length; i += 2) {
      if (ultimos[i]?.role === 'user') {
        texto += `👤 Tú: ${ultimos[i].content.substring(0, 50)}...\n`
        if (ultimos[i+1]?.role === 'assistant') {
          texto += `🤖 IA: ${ultimos[i+1].content.substring(0, 50)}...\n\n`
        }
      }
    }

    texto += `📊 Total mensajes: ${userData.historial.length}`

    await sock.sendMessage(from, { text: texto })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error al obtener memoria' })
  }
  return true
}

// Limpiar memoria manualmente
export async function limpiarMemoriaCommand({ sock, from, msg, sender }) {
  const limpiado = await limpiarMemoria(sender)

  if (limpiado) {
    await sock.sendMessage(from, {
      text: '🧹 *Memoria limpiada*\n\nLa IA ya no recordará nuestra conversación anterior.'
    })
  } else {
    await sock.sendMessage(from, {
      text: '📭 No había memoria que limpiar.'
    })
  }
  return true
}