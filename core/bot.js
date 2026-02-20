// core/bot.js
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import NodeCache from 'node-cache'
import pino from 'pino'
import { handleConnection } from './connection.js'
import { processMessage } from './messageProcessor.js'
import logger from '../pluggins/utils/logger.js'

export default class Bot {
  constructor(config) {
    this.config = config
    this.sock = null
    this.msgRetryCounterCache = new NodeCache()
    this.logger = pino({ level: 'silent' })
  }

  async start() {
    const { state, saveCreds } = await useMultiFileAuthState(this.config.sessionDir)
    const { version } = await fetchLatestBaileysVersion()

    this.sock = makeWASocket({
      version,
      logger: this.logger,
      printQRInTerminal: false,
      auth: state,
      browser: ['Chrome', 'Desktop', '20.0.04'],
      markOnlineOnConnect: true,
      msgRetryCounterCache: this.msgRetryCounterCache,
      syncFullHistory: false,
    })

    logger.info('Esperando conexión...')

    this.sock.ev.on('connection.update', (update) =>
      handleConnection(update, this.sock, this.config, () => this.start())
    )

    this.sock.ev.on('creds.update', saveCreds)

    this.sock.ev.on('messages.upsert', async ({ messages }) => {
      await processMessage(messages, this.sock, this.config)
    })

    return this.sock
  }
}