// pluggins/ai/groq.js
import Groq from 'groq-sdk'

let groq = null
let groqInicializado = false

// ============================================
// 🎯 INICIALIZAR GROQ
// ============================================
export function initGroq(apiKey) {
  try {
    if (!apiKey) {
      console.log('❌ No hay API key para Groq')
      return false
    }

    groq = new Groq({ apiKey })
    groqInicializado = true
    console.log('✅ Groq inicializado correctamente')
    return true
  } catch (e) {
    console.log('❌ Error inicializando Groq:', e.message)
    groqInicializado = false
    return false
  }
}

// ============================================
// 🎯 COMANDO PRINCIPAL .ia
// ============================================
export default async function iaCommand({ sock, from, args, msg, config }) {
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
    if (!groqInicializado || !groq) {
      if (config.apis?.groq) {
        const init = initGroq(config.apis.groq)
        if (!init) {
          throw new Error('No se pudo inicializar Groq')
        }
      } else {
        throw new Error('GROQ_API_KEY no está configurada')
      }
    }

    console.log('🤖 Enviando a Groq:', pregunta.substring(0, 50) + '...')

    // System prompt para conversación natural
    const systemPrompt = `Eres un amigo conversacional, relajado y juvenil. Hablas como un compa peruano.

REGLAS:
• Respondes de manera natural, como en un chat de WhatsApp
• Usas emojis de vez en cuando 😊 pero sin exagerar
• Eres cálido y amigable
• Si no sabes algo, lo dices con honestidad
• Idioma: Español peruano/neutro

EJEMPLOS:
Usuario: Buenas noches como estas?
Tú: Bien pues, ¿y tú cómo estás? 😊

Usuario: Cuéntame un chiste
Tú: ¿Qué le dice un semáforo a otro? "No me mires que me estoy cambiando" 🚦

Usuario: Qué opinas de la inteligencia artificial?
Tú: Pues mira, es algo bien interesante, está cambiando el mundo poco a poco. ¿Tú qué piensas?`

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: pregunta }
    ]

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 512
    })

    let respuesta = chatCompletion.choices[0]?.message?.content

    if (!respuesta) {
      throw new Error('No se obtuvo respuesta de Groq')
    }

    console.log('✅ Respuesta recibida')

    // Limitar longitud
    if (respuesta.length > 4000) {
      respuesta = respuesta.substring(0, 4000) + '...\n\n(Respuesta acortada)'
    }

    await sock.sendMessage(from, {
      text: `🤖 *IA:*\n\n${respuesta}`
    })

  } catch (e) {
    console.log('❌ Error IA:', e.message)

    if (e.message.includes('API key') || e.message.includes('GROQ_API_KEY')) {
      await sock.sendMessage(from, {
        text: '❌ Error: La API key de Groq no es válida.\n\nVerifica tu archivo .env'
      })
    } else {
      await sock.sendMessage(from, {
        text: '❌ Error con la IA. Intenta de nuevo en unos segundos.'
      })
    }
  }
  return true
}