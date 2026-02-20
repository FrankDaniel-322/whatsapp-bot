// plugins/basic/menu.js
export default async function menuCommand({ sock, from, msg, config }) {
  let menuText = `╔════════════════════════════╗\n║  📋 ${config.mensajes.menu.titulo}  ║\n╠════════════════════════════╣\n`

  config.mensajes.menu.comandos.forEach(cmd => {
    menuText += `║ *${config.prefix}${cmd.cmd}* - ${cmd.desc}\n`
  })

  menuText += `╠════════════════════════════╣\n║ ${config.mensajes.menu.footer}\n╚════════════════════════════╝`

  await sock.sendMessage(from, { text: menuText }, { quoted: msg })
  return true
}