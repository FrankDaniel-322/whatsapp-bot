// index.js
import 'dotenv/config'
import { config } from './config.js'
import Bot from './core/bot.js'
import logger from './pluggins/utils/logger.js'
import './server.js'

// Inicializar bot
const bot = new Bot(config)

bot.start().catch(error => {
  logger.error('Error fatal:', error)
  process.exit(1)
})

// Manejo de errores global
process.on('uncaughtException', (err) => {
  if (!err.message.includes('Bad MAC')) {
    logger.error('Error no capturado:', err.message)
  }
})