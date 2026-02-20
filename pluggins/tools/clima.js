// plugins/tools/clima.js
import axios from 'axios'

export default async function climaCommand({ sock, from, args, msg }) {
  const ciudad = args.join(' ')
  if (!ciudad) {
    await sock.sendMessage(from, { text: '❌ Ejemplo: .clima Lima' })
    return true
  }

  try {
    await sock.sendMessage(from, { text: `🔍 Consultando clima de ${ciudad}...` })

    const response = await axios.get(`https://wttr.in/${encodeURIComponent(ciudad)}?format=j1`, {
      timeout: 10000
    })

    const data = response.data
    const current = data.current_condition[0]
    const area = data.nearest_area[0].areaName[0].value
    const region = data.nearest_area[0].region[0].value
    const pais = data.nearest_area[0].country[0].value

    let climaText = `╔════════════════════════════╗\n`
    climaText += `║  🌤️ *CLIMA DETALLADO*  ║\n`
    climaText += `╠════════════════════════════╣\n`
    climaText += `║ 📍 ${area}, ${region}, ${pais}\n`
    climaText += `║ 🌡️ Actual: ${current.temp_C}°C\n`
    climaText += `║ 💧 Humedad: ${current.humidity}%\n`
    climaText += `║ ☁️ ${current.weatherDesc[0].value}\n`
    climaText += `╠════════════════════════════╣\n`

    const horas = [0, 3, 6, 9, 12, 15, 18, 21]
    for (let i = 0; i < horas.length; i++) {
      const hora = horas[i]
      if (data.weather[0].hourly[hora]) {
        const h = data.weather[0].hourly[hora]
        climaText += `║ ${hora}:00 → ${h.temp_C}°C, ${h.weatherDesc[0].value}\n`
      }
    }

    await sock.sendMessage(from, { text: climaText }, { quoted: msg })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ No se pudo obtener el clima' })
  }
  return true
}