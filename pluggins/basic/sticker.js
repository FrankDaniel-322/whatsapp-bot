// plugins/basic/sticker.js
import { downloadMediaMessage } from '@whiskeysockets/baileys'

export default async function stickerCommand({ sock, from, msg, config }) {
  try {
    if (!msg.message?.imageMessage) {
      await sock.sendMessage(from, { text: config.mensajes.respuestas.sticker.error })
      return true
    }

    await sock.sendMessage(from, { text: config.mensajes.respuestas.sticker.procesando })
    const media = await downloadMediaMessage(msg, 'buffer')
    const sharp = (await import('sharp')).default

    const stickerBuffer = await sharp(media)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp()
      .toBuffer()

    await sock.sendMessage(from, { sticker: stickerBuffer })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Error al crear sticker :u' })
  }
  return true
}