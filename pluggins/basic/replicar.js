// pluggins/basic/replicar.js
import { downloadMediaMessage } from '@whiskeysockets/baileys'

export default async function replicarCommand({ sock, from, msg }) {
  try {
    // Obtener el mensaje citado
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage

    if (!quotedMsg) {
      await sock.sendMessage(from, {
        text: '❌ Responde a un mensaje que contenga imagen, video, audio o documento'
      })
      return true
    }

    await sock.sendMessage(from, { text: '📸 *Copiando...*' })

    // Determinar el tipo de mensaje
    let mediaType = null
    let mediaBuffer = null

    // Verificar si es imagen (incluyendo "ver una vez")
    if (quotedMsg.imageMessage) {
      mediaType = 'image'
      const isViewOnce = quotedMsg.imageMessage.viewOnce || false
      console.log('📷 Imagen detectada, viewOnce:', isViewOnce)

      try {
        mediaBuffer = await downloadMediaMessage(
          { key: msg.key, message: quotedMsg },
          'buffer',
          {
            reuploadRequest: true // IMPORTANTE: Esto permite reenviar mensajes de "ver una vez"
          }
        )
      } catch (e) {
        console.log('Error descargando imagen:', e)
      }
    }

    // Verificar si es video (incluyendo "ver una vez")
    else if (quotedMsg.videoMessage) {
      mediaType = 'video'
      const isViewOnce = quotedMsg.videoMessage.viewOnce || false
      console.log('🎥 Video detectado, viewOnce:', isViewOnce)

      try {
        mediaBuffer = await downloadMediaMessage(
          { key: msg.key, message: quotedMsg },
          'buffer',
          { reuploadRequest: true }
        )
      } catch (e) {
        console.log('Error descargando video:', e)
      }
    }

    // Verificar si es audio
    else if (quotedMsg.audioMessage) {
      mediaType = 'audio'
      console.log('🎵 Audio detectado')

      try {
        mediaBuffer = await downloadMediaMessage(
          { key: msg.key, message: quotedMsg },
          'buffer',
          { reuploadRequest: true }
        )
      } catch (e) {
        console.log('Error descargando audio:', e)
      }
    }

    // Verificar si es documento
    else if (quotedMsg.documentMessage) {
      mediaType = 'document'
      console.log('📄 Documento detectado')

      try {
        mediaBuffer = await downloadMediaMessage(
          { key: msg.key, message: quotedMsg },
          'buffer',
          { reuploadRequest: true }
        )
      } catch (e) {
        console.log('Error descargando documento:', e)
      }
    }

    // Verificar si es GIF (viene como videoMessage)
    else if (quotedMsg.videoMessage?.gifPlayback) {
      mediaType = 'gif'
      console.log('🎞️ GIF detectado')

      try {
        mediaBuffer = await downloadMediaMessage(
          { key: msg.key, message: quotedMsg },
          'buffer',
          { reuploadRequest: true }
        )
      } catch (e) {
        console.log('Error descargando GIF:', e)
      }
    }

    // Si no se pudo obtener el buffer
    if (!mediaBuffer || !mediaType) {
      await sock.sendMessage(from, {
        text: '❌ No se pudo copiar el mensaje. Asegúrate de responder a una imagen, video, audio o documento.'
      })
      return true
    }

    // Reenviar según el tipo
    if (mediaType === 'image') {
      await sock.sendMessage(from, {
        image: mediaBuffer,
        caption: '📸 *Imagen copiada*'
      })
    }
    else if (mediaType === 'video' || mediaType === 'gif') {
      await sock.sendMessage(from, {
        video: mediaBuffer,
        caption: mediaType === 'gif' ? '🎞️ *GIF copiado*' : '🎥 *Video copiado*'
      })
    }
    else if (mediaType === 'audio') {
      await sock.sendMessage(from, {
        audio: mediaBuffer,
        mimetype: 'audio/mp4',
        ptt: quotedMsg.audioMessage?.ptt || false // ptt = mensaje de voz
      })
    }
    else if (mediaType === 'document') {
      const fileName = quotedMsg.documentMessage?.fileName || 'documento'
      await sock.sendMessage(from, {
        document: mediaBuffer,
        mimetype: quotedMsg.documentMessage?.mimetype || 'application/octet-stream',
        fileName: fileName
      })
    }

  } catch (e) {
    console.log('Error en replicar:', e)
    await sock.sendMessage(from, {
      text: '❌ Error al copiar. Puede ser un mensaje de "ver una vez" muy antiguo.'
    })
  }
  return true
}