// plugins/index.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../pluggins/utils/logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export class PluginLoader {
  constructor() {
    this.plugins = new Map()
    this.loadPlugins()
  }

  loadPlugins() {
    const categories = fs.readdirSync(__dirname)

    for (const category of categories) {
      const categoryPath = path.join(__dirname, category)
      if (!fs.statSync(categoryPath).isDirectory()) continue

      const pluginFiles = fs.readdirSync(categoryPath)

      for (const file of pluginFiles) {
        if (file === 'index.js' || !file.endsWith('.js')) continue

        try {
          const pluginPath = `./${category}/${file}`
          import(pluginPath).then(module => {
            const pluginName = file.replace('.js', '')
            if (module.default) {
              this.plugins.set(pluginName, module.default)
              logger.success(`Plugin cargado: ${category}/${pluginName}`)
            }
          })
        } catch (error) {
          logger.error(`Error cargando plugin ${file}:`, error.message)
        }
      }
    }

    logger.info(`Total plugins: ${this.plugins.size}`)
  }

  async execute(command, context) {
    const plugin = this.plugins.get(command)
    if (plugin) {
      try {
        return await plugin(context)
      } catch (error) {
        logger.error(`Error en plugin ${command}:`, error.message)
        await context.sock.sendMessage(context.from, {
          text: '❌ Error al ejecutar el comando'
        })
        return true
      }
    }
    return false
  }
}