// config.js
import chalk from 'chalk'
import 'dotenv/config'

export const config = {
  botName: 'El Psy Congro - Bot',
  ownerNumber: '51929416952',
  ownerName: 'El Psy Congro',
  prefix: '.',
  sessionDir: 'auth_session',

  soloGrupo: {
    activado: true,
    id: '120363223184454019@g.us',
  },

  apis: {
    groq: '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',
  },

  mensajes: {
    menu: {
      titulo: '*COMANDOS DISPONIBLES*',
      footer: 'No spamees los comandos *pe*, que me banean',
      comandos: [
        { cmd: 'menu', desc: 'Muestra comandos 👀' },
        { cmd: 'ping', desc: 'Verifica velocidad 🏃' },
        { cmd: 'info', desc: 'Info del bot ℹ️' },
        { cmd: 'sticker', desc: 'Crea sticker 🎨' },
        { cmd: 's', desc: 'Atajo sticker ⚡' },
        { cmd: 'reglas', desc: 'Reglas del grupo 📜' },
        { cmd: 'replicar', desc: 'Replica una imagen 👀' },
        { cmd: 'play', desc: 'Busca música 🎵' },
        { cmd: 'ytsearch', desc: 'Busca en YouTube 🔍' },
        { cmd: 'voz', desc: 'Voz masculina (español) 🎤' },
        { cmd: 'ia', desc: 'Pregunta a IA 🤖' },
        { cmd: 'iaauto', desc: 'Modo auto (solo owner) 🧠' },
        { cmd: 'add', desc: 'Añade miembro (admin) ➕' },
        { cmd: 'kick', desc: 'Elimina miembro (admin) 👋' },
        { cmd: 'promover', desc: 'Hace admin (admin) 👑' },
        { cmd: 'deg', desc: 'Quita admin (admin) ⬇️' },
        { cmd: 'grupo', desc: 'Abrir/cerrar grupo (admin) 🔒' },
        { cmd: 'tagall', desc: 'Menciona a todos (admin) 📢' },
        { cmd: 'link', desc: 'Link del grupo (admin) 🔗' },
        { cmd: 'perfil', desc: 'Ver perfil de usuario 👤' },
        { cmd: 'top', desc: 'Top mensajes (15) 🏆' },
        { cmd: 'hora', desc: 'Hora en Perú 🕐' },
        { cmd: 'clima', desc: 'Clima detallado 🌤️' },
        { cmd: 'dado', desc: 'Tira el dado 🎲' },
        { cmd: 'ppt', desc: 'Piedra, papel o tijera ✂️' },
        { cmd: 'adivina', desc: 'Adivina el número 🎯' },
        { cmd: 'trivia', desc: 'Juego de preguntas (15s) 📚' },
        { cmd: 'chiste', desc: 'Cuenta un chiste 😂' },
        { cmd: 'dato', desc: 'Dato curioso 🔍' },
        { cmd: 'meme', desc: 'Meme aleatorio :v' },
        { cmd: 'motivar', desc: 'Frase motivadora 💪' },
        { cmd: 'calc', desc: 'Calculadora científica 🧮' },
        { cmd: 'testowner', desc: 'Verifica si eres owner 🔧' },
        { cmd: 'getid', desc: 'Obtiene tu ID de WhatsApp 📱' },
        { cmd: 'testperfil', desc: 'Prueba búsqueda de perfil 🔧' },
      ]
    },

    reglas: [
      '🚫🚫🚫🚫 *NO SPAM* 🚫🚫🚫🚫',
      'No enviar mensajes repetitivos',
      '🤝 Tratar bien a todos *excepto a Yamiled*',
      '✅ Usar *.menu* para ver comandos',
      'Y ya, *no hay reglas* :v'
    ],

    respuestas: {
      ping: '*PRECOCIDAD*🥵:',
      info: '*INFORMACION DEL BOT* 🤖',
      sticker: {
        procesando: '*Horneando sticker...* 🍞🍞🍞',
        error: '❌ Envía una imagen con *.s* papu'
      }
    }
  }
}

console.log(chalk.blue.bold(`
╔════════════════════════════════════╗
║     ${config.botName}              ║
║    *Modo Sigilo Activado* 🕵️       ║
║    *Prefijo: ${config.prefix}*               ║
╚════════════════════════════════════╝
`))