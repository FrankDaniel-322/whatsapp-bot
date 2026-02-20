// pluggins/utils/validator.js
import fs from 'fs'

// ============================================
// 🎯 CONFIGURACIÓN DEL OWNER
// ============================================
const OWNER_CONFIG = {
  jid: '58888581865722@lid',
  numero: '51929416952',
  nombre: 'FrankDaniel'
}

// Base de datos para owners conocidos
const knownOwners = new Map()

// Cargar owners conocidos
try {
  if (fs.existsSync('./owners.json')) {
    const data = JSON.parse(fs.readFileSync('./owners.json', 'utf-8'))
    for (const [jid, phone] of Object.entries(data)) {
      knownOwners.set(jid, phone)
    }
  }
} catch (e) {}

// ============================================
// 🎯 FUNCIÓN PARA OBTENER NÚMERO REAL DE WHATSAPP
// ============================================
export async function getRealPhoneNumber(sock, jid) {
  try {
    // Si es el owner, devolver su número real
    if (jid.includes(OWNER_CONFIG.jid) || jid.includes(OWNER_CONFIG.numero)) {
      return OWNER_CONFIG.numero
    }

    // Intentar obtener el número real de WhatsApp
    const [result] = await sock.onWhatsApp(jid)
    if (result?.exists) {
      // El JID que devuelve onWhatsApp tiene el formato correcto
      const realJid = result.jid
      const realNumber = realJid.split('@')[0]
      return realNumber
    }

    // Si no se puede obtener, devolver el ID limpio
    return jid.split('@')[0].replace(/[^0-9]/g, '')
  } catch (e) {
    console.log('Error obteniendo número real:', e)
    return jid.split('@')[0].replace(/[^0-9]/g, '')
  }
}

// ============================================
// 🎯 FUNCIÓN UNIVERSAL: Convierte CUALQUIER entrada a JID
// ============================================
export function cualquiercosaToJid(input) {
  if (!input) return null

  console.log('🔍 cualquiercosaToJid - INPUT:', input)

  if (Array.isArray(input)) {
    input = input.join(' ')
  }

  input = String(input).trim()

  if (input.includes('@s.whatsapp.net') || input.includes('@lid') || input.includes('@g.us')) {
    return input
  }

  if (input.startsWith('@')) {
    const match = input.match(/@(\d+)/)
    if (match) {
      const numero = match[1]
      const jid = numero + '@s.whatsapp.net'
      console.log('✅ Mención convertida:', jid)
      return jid
    }
  }

  const soloNumeros = input.replace(/[^0-9]/g, '')

  if (soloNumeros.length >= 10) {
    if (soloNumeros.length === 9) {
      return '51' + soloNumeros + '@s.whatsapp.net'
    }
    return soloNumeros + '@s.whatsapp.net'
  }

  return null
}

// ============================================
// 🎯 EXTRAER NÚMERO DE UN JID (versión simple)
// ============================================
export function jidToNumero(jid) {
  if (!jid) return 'Desconocido'

  if (jid.includes(OWNER_CONFIG.jid) || jid.includes(OWNER_CONFIG.numero)) {
    return OWNER_CONFIG.numero
  }

  return jid.split('@')[0].replace(/[^0-9]/g, '') || 'Desconocido'
}

// ============================================
// 🎯 FORMATEAR NÚMERO PARA MOSTRAR
// ============================================
export function formatearNumero(numero) {
  if (!numero) return 'Desconocido'
  const limpio = numero.replace(/[^0-9]/g, '')
  if (limpio.length === 12) return `+${limpio}`
  if (limpio.length === 11) return `+${limpio}`
  return limpio
}

// ============================================
// 🎯 VERIFICAR SI ES OWNER
// ============================================
export function isOwner(userId, config) {
  if (!userId) return false

  const jid = typeof userId === 'string' && (userId.includes('@') || userId.startsWith('@'))
    ? cualquiercosaToJid(userId)
    : userId

  const numero = jidToNumero(jid)
  const ownerNumero = config.ownerNumber.replace(/[^0-9]/g, '')

  if (numero === ownerNumero) return true
  if (jid.includes(OWNER_CONFIG.jid)) return true
  if (knownOwners.has(jid) || knownOwners.has(numero)) return true

  return false
}

export function isAdmin(participant, groupMetadata) {
  const member = groupMetadata.participants.find(p => p.id === participant)
  return member?.admin === 'admin' || member?.admin === 'superadmin'
}

export function isProtectedUser(userId, config) {
  return isOwner(userId, config)
}