// plugins/basic/ytsearch.js
import yts from 'yt-search'

export default async function ytsearchCommand({ sock, from, args, msg }) {
  const query = args.join(' ')
  if (!query) {
    await sock.sendMessage(from, { text: '❌ Ejemplo: .ytsearch despacito' })
    return true
  }

  try {
    await sock.sendMessage(from, { text: '🔍 Buscando...' })
    const result = await yts(query)
    const videos = result.videos.slice(0, 5)

    let msgText = `🎵 *RESULTADOS:* ${query}\n\n`
    videos.forEach((video, i) => {
      msgText += `*${i + 1}.* ${video.title}\n👤 ${video.author.name}\n⏱️ ${video.timestamp}\n📎 ${video.url}\n\n`
    })

    await sock.sendMessage(from, { text: msgText })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error en búsqueda' })
  }
  return true
}