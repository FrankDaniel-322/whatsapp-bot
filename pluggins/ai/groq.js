// pluggins/ai/groq.js
import Groq from 'groq-sdk'

let groq = null

// ============================================
// 🧠 SISTEMA DE MEMORIA POR USUARIO
// ============================================
const memoriaConversacion = new Map() // Guarda el historial por usuario

const MAX_HISTORIAL = 10 // Máximo de mensajes a recordar

// Limpiar memoria vieja (opcional, cada 1 hora)
setInterval(() => {
  const ahora = Date.now()
  for (const [userId, data] of memoriaConversacion) {
    if (ahora - data.ultima > 3600000) { // 1 hora sin hablar
      memoriaConversacion.delete(userId)
      console.log(`🧹 Memoria limpiada para: ${userId}`)
    }
  }
}, 3600000)

// ============================================
// 🎯 INICIALIZAR GROQ
// ============================================
export function initGroq(apiKey) {
  if (apiKey) {
    groq = new Groq({ apiKey })
    console.log('✅ Groq inicializado correctamente')
  } else {
    console.log('❌ No hay API key para Groq')
  }
}

// ============================================
// 🎯 LIMPIAR MEMORIA MANUALMENTE (comando)
// ============================================
export async function limpiarMemoria(userId) {
  if (memoriaConversacion.has(userId)) {
    memoriaConversacion.delete(userId)
    return true
  }
  return false
}

// ============================================
// 🎯 OBTENER CONTEXTO DE CONVERSACIÓN
// ============================================
function obtenerContexto(userId, nuevoMensaje) {
  // Obtener o crear historial del usuario
  if (!memoriaConversacion.has(userId)) {
    memoriaConversacion.set(userId, {
      historial: [],
      ultima: Date.now()
    })
  }

  const userData = memoriaConversacion.get(userId)
  userData.ultima = Date.now()

  // Construir los mensajes para Groq
  const messages = [
    {
      role: "system",
      content: `Eres un amigo conversacional, relajado y juvenil. Hablas como un compa peruano/ español.

      PERSONALIDAD:
      • Respondes de manera natural, como si estuvieras chateando con un amigo
      • Usas emojis de vez en cuando 😊 pero sin exagerar
      • Eres cálido y amigable, pero no empalagoso
      • Si no sabes algo, lo dices con honestidad y humor
      • Mantienes el flow de la conversación
      • Te adaptas al tono del usuario (si está serio, serio; si está bromista, bromista)
      • IMPORTANTE: Recuerdas la conversación anterior y respondes en contexto

      IDIOMA: Español peruano/neutro (usar "pues", "causa", "habla" de vez en cuando, pero natural)`
    }
  ]

  // Agregar historial (últimos MAX_HISTORIAL mensajes)
  const historialReciente = userData.historial.slice(-MAX_HISTORIAL)
  for (const msg of historialReciente) {
    messages.push(msg)
  }

  // Agregar el mensaje actual
  messages.push({ role: "user", content: nuevoMensaje })

  return { userData, messages }
}

// ============================================
// 🎯 GUARDAR EN MEMORIA
// ============================================
function guardarEnMemoria(userData, pregunta, respuesta) {
  // Guardar pregunta
  userData.historial.push({ role: "user", content: pregunta })

  // Guardar respuesta
  userData.historial.push({ role: "assistant", content: respuesta })

  // Limitar tamaño del historial
  if (userData.historial.length > MAX_HISTORIAL * 2) {
    userData.historial = userData.historial.slice(-MAX_HISTORIAL * 2)
  }
}

// ============================================
// 🎯 COMANDO PRINCIPAL .ia
// ============================================
export default async function iaCommand({ sock, from, args, msg, config, sender }) {
  const pregunta = args.join(' ')

  if (!pregunta) {
    await sock.sendMessage(from, {
      text: '❌ Ejemplo: .ia hola, cómo estás?'
    })
    return true
  }

  try {
    await sock.sendMessage(from, { text: '💭 Pensando...' })

    // Verificar que Groq esté inicializado
    if (!groq) {
      if (config.apis?.groq) {
        initGroq(config.apis.groq)
      } else {
        throw new Error('Groq no está configurado')
      }
    }

    // Obtener contexto de conversación
    const userId = sender || from
    const { userData, messages } = obtenerContexto(userId, pregunta)

    console.log(`🗣️ Usuario ${userId}: ${pregunta}`)
    console.log(`📚 Historial: ${userData.historial.length} mensajes`)

    // Enviar a Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 512
    })

    let respuesta = chatCompletion.choices[0]?.message?.content

    if (!respuesta) {
      throw new Error('No se obtuvo respuesta')
    }

    // Guardar en memoria
    guardarEnMemoria(userData, pregunta, respuesta)

    console.log(`🤖 IA: ${respuesta.substring(0, 50)}...`)

    // Limitar longitud
    if (respuesta.length > 4000) {
      respuesta = respuesta.substring(0, 4000) + '...\n\n(Respuesta acortada)'
    }

    await sock.sendMessage(from, {
      text: `🤖 *IA:*\n\n${respuesta}`
    })

  } catch (e) {
    console.log('Error IA:', e)

    if (e.message.includes('API key')) {
      await sock.sendMessage(from, {
        text: '❌ Error con la API key de Groq'
      })
    } else {
      await sock.sendMessage(from, {
        text: '❌ Error con la IA. Intenta de nuevo.'
      })
    }
  }
  return true
}