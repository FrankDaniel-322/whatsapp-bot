// database.js
import fs from 'fs'

class Database {
  constructor() {
    this.mensajes = {}
    this.usuarios = {}
    this.grupos = {}
    this.cargar()
  }

  cargar() {
    try {
      if (fs.existsSync('./database.json')) {
        const data = JSON.parse(fs.readFileSync('./database.json', 'utf-8'))
        this.mensajes = data.mensajes || {}
        this.usuarios = data.usuarios || {}
        this.grupos = data.grupos || {}
      }
    } catch (e) {
      console.log('📁 Nueva base de datos creada')
    }
  }

  guardar() {
    try {
      const data = {
        mensajes: this.mensajes,
        usuarios: this.usuarios,
        grupos: this.grupos
      }
      fs.writeFileSync('./database.json', JSON.stringify(data, null, 2))
    } catch (e) {
      console.log('Error guardando DB:', e.message)
    }
  }

  contarMensaje(grupoId, usuarioId) {
    const key = `${grupoId}|${usuarioId}`
    this.mensajes[key] = (this.mensajes[key] || 0) + 1
    this.guardar()
    return this.mensajes[key]
  }

  getUsuarioMensajes(grupoId, usuarioId) {
    const key = `${grupoId}|${usuarioId}`
    return this.mensajes[key] || 0
  }

  getTop(grupoId, limite = 15) {
    const top = []
    for (const [key, valor] of Object.entries(this.mensajes)) {
      const [gId, uId] = key.split('|')
      if (gId === grupoId) {
        top.push({ id: uId, mensajes: valor })
      }
    }
    return top.sort((a, b) => b.mensajes - a.mensajes).slice(0, limite)
  }

  registrarUsuario(usuarioId, nombre) {
    if (!this.usuarios[usuarioId]) {
      this.usuarios[usuarioId] = {
        nombre: nombre || 'Desconocido',
        nivel: 1,
        exp: 0,
        monedas: 100,
        primeraVez: new Date().toISOString(),
        ultimaVez: new Date().toISOString()
      }
      this.guardar()
    } else {
      this.usuarios[usuarioId].ultimaVez = new Date().toISOString()
      this.usuarios[usuarioId].nombre = nombre || this.usuarios[usuarioId].nombre
      this.guardar()
    }
    return this.usuarios[usuarioId]
  }

  getUsuario(usuarioId) {
    return this.usuarios[usuarioId] || null
  }
}

export default new Database()