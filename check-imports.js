// check-imports.js
import fs from 'fs'

const archivos = [
  'core/bot.js',
  'core/connection.js',
  'core/messageProcessor.js',
  'pluggins/index.js',
  'pluggins/admin/kick.js',
  'pluggins/admin/promote.js',
  'pluggins/admin/demote.js',
  'index.js'
]

console.log('🔍 VERIFICANDO IMPORTACIONES...\n')

archivos.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8')
    if (content.includes('../utils') || content.includes('./utils')) {
      console.log(`⚠️  ${file} - TIENE IMPORTACIONES INCORRECTAS`)
    } else {
      console.log(`✅ ${file} - OK`)
    }
  } else {
    console.log(`❌ ${file} - NO EXISTE`)
  }
})