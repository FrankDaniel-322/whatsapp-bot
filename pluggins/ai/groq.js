// pluggins/ai/groq.js
import Groq from 'groq-sdk'

let groq = null

export function initGroq(apiKey) {
  if (apiKey) {
    groq = new Groq({ apiKey })
    console.log('✅ Groq inicializado correctamente')
  } else {
    console.log('❌ No hay API key para Groq')
  }
}

export default async function iaCommand({ sock, from, args, msg, config }) {
  const pregunta = args.join(' ')

  if (!pregunta) {
    await sock.sendMessage(from, {
      text: '❌ Ejemplo: .ia cuál es la capital de Perú?'
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
        throw new Error('Groq no está configurado. Revisa tu API key en config.js')
      }
    }

    // System prompt mejorado
    const systemPrompt = `Eres un asistente amigable, juvenil y conversacional.
    Respondes en español, de manera natural y con un tono relajado.
    Usas emojis ocasionalmente para darle vida a la conversación 😊
    Si la pregunta es técnica, das una respuesta clara pero no demasiado compleja.
    Si no sabes algo, lo dices honestamente.
    Idioma: Español (neutro, comprensible para todos).`

    // Detectar si es pregunta técnica
    const palabrasTecnicas = ['código', 'programar', 'programación', 'técnico', 'profesional', 'explicación']
    const esTecnico = palabrasTecnicas.some(p => pregunta.toLowerCase().includes(p))

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: pregunta }
    ]

    console.log('🤖 Enviando a Groq:', pregunta)

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: esTecnico ? 0.5 : 0.8,
      max_tokens: esTecnico ? 1024 : 512
    })

    let respuesta = chatCompletion.choices[0]?.message?.content

    if (!respuesta) {
      throw new Error('No se obtuvo respuesta de Groq')
    }

    // Limitar longitud para WhatsApp
    if (respuesta.length > 4000) {
      respuesta = respuesta.substring(0, 4000) + '...\n\n(Respuesta acortada)'
    }

    await sock.sendMessage(from, {
      text: `🤖 *IA:*\n\n${respuesta}`
    })

  } catch (e) {
    console.log('Error IA:', e)

    // Mensajes de error más amigables
    if (e.message.includes('API key')) {
      await sock.sendMessage(from, {
        text: '❌ Error de configuración: La API key de Groq no es válida. Revisa tu archivo .env'
      })
    } else if (e.message.includes('rate limit')) {
      await sock.sendMessage(from, {
        text: '⏳ Muchas peticiones a la vez. Espera un momento y vuelve a intentar.'
      })
    } else {
      await sock.sendMessage(from, {
        text: '❌ Error con la IA. Intenta de nuevo en unos segundos.'
      })
    }
  }
  return true
}