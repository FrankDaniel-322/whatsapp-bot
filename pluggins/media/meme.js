// plugins/media/meme.js
import axios from 'axios'

export default async function memeCommand({ sock, from, msg }) {
  try {
    const res = await axios.get('https://meme-api.com/gimme')
    await sock.sendMessage(from, { image: { url: res.data.url } }, { quoted: msg })
  } catch {
    await sock.sendMessage(from, { text: '😅 Error con meme' })
  }
  return true
}