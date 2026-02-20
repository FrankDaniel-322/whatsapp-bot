// utils/logger.js
import chalk from 'chalk'

const logger = {
  info: (msg) => console.log(chalk.blue('ℹ️'), msg),
  success: (msg) => console.log(chalk.green('✅'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠️'), msg),
  error: (msg) => console.log(chalk.red('❌'), msg),
  qr: (msg) => console.log(chalk.magenta('📷'), msg),
  code: (msg) => console.log(chalk.cyan('🔑'), msg)
}

export default logger