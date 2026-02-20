// core/bot.js
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import NodeCache from 'node-cache'
import pino from 'pino'
import { handleConnection } from './connection.js'
import { processMessage } from './messageProcessor.js'
import logger from '../pluggins/utils/logger.js'
import { initGroq } from '../pluggins/ai/groq.js'

export default class Bot {
  constructor(config) {
    this.config = config
    this.sock = null
    this.msgRetryCounterCache = new NodeCache()
    this.logger = pino({ level: 'silent' })

    // Inicializar Groq al crear el bot
    if (config.apis?.groq) {
      logger.info('Inicializando Groq AI...')
      const initResult = initGroq(config.apis.groq)
      if (initResult) {
        logger.success('Groq AI inicializado correctamente')
      } else {
        logger.error('Error al inicializar Groq AI')
      }
    } else {
      logger.warn('No hay API key para Groq configurada')
    }
  }

  async start() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(this.config.sessionDir)
      const { version } = await fetchLatestBaileysVersion()

      logger.info(`Usando Baileys versión: ${version}`)

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

      // Evento de conexión
      this.sock.ev.on('connection.update', (update) =>
        handleConnection(update, this.sock, this.config, () => this.start())
      )

      // Guardar credenciales
      this.sock.ev.on('creds.update', saveCreds)

      // Procesar mensajes
      this.sock.ev.on('messages.upsert', async ({ messages }) => {
        await processMessage(messages, this.sock, this.config)
      })

      logger.success('Bot iniciado correctamente')
      return this.sock

    } catch (error) {
      logger.error('Error al iniciar el bot:', error.message)
      throw error
    }
  }
}