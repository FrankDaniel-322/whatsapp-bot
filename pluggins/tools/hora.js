// plugins/tools/hora.js
export default async function horaCommand({ sock, from, msg }) {
  const opciones = {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  const fecha = new Date()
  const horaPeru = fecha.toLocaleString('es-PE', opciones)
  const diaSemana = fecha.toLocaleString('es-PE', { timeZone: 'America/Lima', weekday: 'long' })

  await sock.sendMessage(from, {
    text: `🕐 *HORA PERÚ*\n\n📅 ${diaSemana}, ${horaPeru}\n🇵🇪 Zona horaria: Lima`
  }, { quoted: msg })
  return true
}