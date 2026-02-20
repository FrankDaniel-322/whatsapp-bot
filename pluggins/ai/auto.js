// plugins/ai/auto.js
import fs from 'fs'

export const modoAuto = new Map()
export const entrenamiento = new Map()

try {
  if (fs.existsSync('./entrenamiento.json')) {
    const data = JSON.parse(fs.readFileSync('./entrenamiento.json', 'utf-8'))
    for (const [key, val] of Object.entries(data)) {
      entrenamiento.set(key, {
        frases: val.frases || [],
        bigramas: new Map(Object.entries(val.bigramas || {})),
        total: val.total || 0
      })
    }
    console.log(`📚 Datos cargados: ${entrenamiento.size} grupos`)
  }
} catch (e) {}

function guardarEntrenamiento() {
  try {
    const exportable = {}
    for (const [key, val] of entrenamiento) {
      exportable[key] = {
        frases: val.frases,
        bigramas: Object.fromEntries(val.bigramas),
        total: val.total
      }
    }
    fs.writeFileSync('./entrenamiento.json', JSON.stringify(exportable, null, 2))
  } catch (e) {}
}

export function entrenarConMensaje(texto, from, esOwner) {
  if (!texto || texto.startsWith('.') || !esOwner) return

  const palabras = texto.toLowerCase().split(/\s+/)
  const patrones = []

  for (let i = 0; i < palabras.length - 1; i++) {
    patrones.push(`${palabras[i]} ${palabras[i+1]}`)
  }

  if (!entrenamiento.has(from)) {
    entrenamiento.set(from, { frases: [], bigramas: new Map(), total: 0 })
  }

  const data = entrenamiento.get(from)
  data.frases.push(texto)
  data.total++

  patrones.forEach(p => data.bigramas.set(p, (data.bigramas.get(p) || 0) + 1))

  if (data.frases.length > 1000) data.frases.shift()
  if (data.total % 10 === 0) guardarEntrenamiento()
}

export function generarRespuestaAuto(texto, from) {
  const data = entrenamiento.get(from)
  if (!data || data.total < 10) return null

  const palabrasUsuario = texto.toLowerCase().split(/\s+/)

  let mejorBigrama = null
  let mayorFrecuencia = 0

  for (const [bigrama, freq] of data.bigramas) {
    if (freq > mayorFrecuencia && !bigrama.includes('.')) {
      const palabrasBigrama = bigrama.split(' ')
      if (palabrasUsuario.some(p => palabrasBigrama.includes(p))) {
        mejorBigrama = bigrama
        mayorFrecuencia = freq
      }
    }
  }

  if (mejorBigrama) {
    const frasesConBigrama = data.frases.filter(f => f.toLowerCase().includes(mejorBigrama))
    if (frasesConBigrama.length > 0) {
      return frasesConBigrama[Math.floor(Math.random() * frasesConBigrama.length)]
    }
  }

  return data.frases[Math.floor(Math.random() * data.frases.length)] || null
}

export async function procesarAuto(msg, body, from, sender, esOwner, sock, config) {
  if (esOwner) entrenarConMensaje(body, from, true)

  if (!esOwner && !body.startsWith('.')) {
    const respuesta = generarRespuestaAuto(body, from)
    if (respuesta && Math.random() < 0.3) {
      await sock.sendMessage(from, {
        text: `🧠 *[Auto-${config.ownerName}]:* ${respuesta}`
      })
    }
  }
}

export default async function iaautoCommand({ sock, from, msg, args, esOwner }) {
  if (!esOwner) {
    await sock.sendMessage(from, { text: '❌ Solo el owner' })
    return true
  }

  const sub = args[0]?.toLowerCase()

  if (sub === 'on') {
    modoAuto.set(from, true)
    await sock.sendMessage(from, { text: '🧠 *MODO AUTO ACTIVADO*' })
  }
  else if (sub === 'off') {
    modoAuto.delete(from)
    await sock.sendMessage(from, { text: '✅ Modo auto desactivado' })
  }
  else if (sub === 'stats') {
    const data = entrenamiento.get(from)
    if (data) {
      await sock.sendMessage(from, {
        text: `📊 Frases: ${data.frases.length}\nPatrones: ${data.bigramas.size}\nTotal: ${data.total}`
      })
    } else {
      await sock.sendMessage(from, { text: '📊 Sin datos' })
    }
  }
  else if (sub === 'frases') {
    const data = entrenamiento.get(from)
    if (!data?.frases.length) {
      await sock.sendMessage(from, { text: '📊 No hay frases' })
      return true
    }

    let texto = `📝 *ÚLTIMAS FRASES:*\n\n`
    data.frases.slice(-15).reverse().forEach((f, i) => texto += `${i+1}. ${f}\n`)
    await sock.sendMessage(from, { text: texto })
  }
  else if (sub === 'export') {
    const data = entrenamiento.get(from)
    if (!data) {
      await sock.sendMessage(from, { text: '📊 No hay datos' })
      return true
    }

    try {
      const exportData = {
        frases: data.frases,
        bigramas: Object.fromEntries(data.bigramas),
        total: data.total
      }

      const fileName = `entrenamiento_${Date.now()}.json`
      fs.writeFileSync(`./${fileName}`, JSON.stringify(exportData, null, 2))
      const fileBuffer = fs.readFileSync(`./${fileName}`)

      await sock.sendMessage(from, {
        document: fileBuffer,
        mimetype: 'application/json',
        fileName: fileName,
        caption: `📦 Frases: ${data.frases.length}`
      })

      fs.unlinkSync(`./${fileName}`)
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Error al exportar' })
    }
  }
  else {
    await sock.sendMessage(from, {
      text: '🤖 *IA AUTO*\n\n.iaauto on/off\n.iaauto stats\n.iaauto frases\n.iaauto export'
    })
  }
  return true
}