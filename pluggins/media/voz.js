// plugins/media/voz.js
import axios from 'axios'

export default async function vozCommand({ sock, from, args, msg }) {
  const texto = args.join(' ')
  if (!texto) {
    await sock.sendMessage(from, { text: '❌ Ejemplo: .voz hola que haceee' })
    return true
  }

  try {
    await sock.sendMessage(from, { text: '🔊 Generando voz...' })

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(texto)}&tl=es-ES&client=tw-ob&ttsspeed=0.8`

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://translate.google.com'
      },
      timeout: 10000
    })

    const audioBuffer = Buffer.from(response.data)

    await sock.sendMessage(from, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: true
    })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error al generar voz' })
  }
  return true
}