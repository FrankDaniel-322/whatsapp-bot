// core/connection.js
import { DisconnectReason } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import qrcode from 'qrcode-terminal'
import logger from '../pluggins/utils/logger.js'

let pairingCodeShown = false

export async function handleConnection(update, sock, config, startBot) {
  const { connection, lastDisconnect, qr } = update

  if (!sock.authState.creds.registered && qr) {
    logger.qr('NUEVO CÓDIGO QR GENERADO')
    qrcode.generate(qr, { small: true })

    if (!pairingCodeShown && config.ownerNumber) {
      try {
        const phone = config.ownerNumber.replace(/[^0-9]/g, '')
        const code = await sock.requestPairingCode(phone)
        const formatted = code.match(/.{1,4}/g)?.join('-') || code
        console.log('\n' + '='.repeat(40))
        console.log('🔑 CÓDIGO DE VINCULACIÓN:', formatted)
        console.log('='.repeat(40) + '\n')
        pairingCodeShown = true
      } catch (e) {
        logger.error('Error al generar código: ' + e.message)
      }
    }
  }

  if (connection === 'close') {
    const shouldReconnect = lastDisconnect?.error instanceof Boom
      ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
      : true
    if (shouldReconnect) {
      logger.warn('Reconectando...')
      setTimeout(startBot, 5000)
    } else {
      logger.error('Sesión cerrada. Elimina la carpeta auth_session')
    }
  }

  if (connection === 'open') {
    logger.success('¡CONECTADO!')
    console.log(`📱 Número: ${sock.user?.id?.split(':')[0] || 'Desconocido'}`)
    if (config.soloGrupo.activado) {
      console.log(`🆔 Grupo: ${config.soloGrupo.id}\n`)
    }
  }
}