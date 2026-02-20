// plugins/basic/play.js
import yts from 'yt-search'

export default async function playCommand({ sock, from, args, msg }) {
  const query = args.join(' ')
  if (!query) {
    await sock.sendMessage(from, { text: '❌ Ejemplo: .play despacito' })
    return true
  }

  try {
    await sock.sendMessage(from, { text: '🎵 Buscando...' })
    const search = await yts(query)
    const videos = search.videos.slice(0, 3)

    let msgText = `🎵 *RESULTADOS:*\n\n`
    videos.forEach((v, i) => {
      msgText += `*${i + 1}.* ${v.title}\n👤 ${v.author.name}\n⏱️ ${v.timestamp}\n📎 ${v.url}\n\n`
    })
    msgText += `💡 *Descarga:* ytmp3.cc`

    await sock.sendMessage(from, { text: msgText })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error' })
  }
  return true
}