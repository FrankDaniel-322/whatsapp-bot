// server.js
import http from 'http'
import url from 'url'
import { config } from './config.js'

const PORT = process.env.PORT || 10000

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname
  const uptime = process.uptime()
  const hours = Math.floor(uptime / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)

  if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>${config.botName}</title>
      <style>body{font-family:Arial;margin:40px;background:#f0f2f5}.container{max-width:600px;margin:auto;background:white;padding:30px;border-radius:15px}h1{color:#128C7E}.status{background:#25D366;color:white;padding:10px;border-radius:8px}</style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 ${config.botName}</h1>
          <div class="status">✅ BOT ACTIVO</div>
          <p><strong>⏱️ Uptime:</strong> ${hours}h ${minutes}m</p>
          <p><strong>👤 Owner:</strong> ${config.ownerName}</p>
          <p><strong>📱 Número:</strong> ${config.ownerNumber}</p>
          <p><strong>🔣 Prefijo:</strong> ${config.prefix}</p>
          <p>⚡ El bot está funcionando correctamente.</p>
        </div>
      </body>
      </html>
    `)
  } else if (path === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', uptime: `${hours}h ${minutes}m` }))
  } else {
    res.writeHead(404)
    res.end('404')
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor web: Puerto ${PORT}`)
})

export default server