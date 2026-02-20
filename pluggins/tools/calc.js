// plugins/tools/calc.js
export default async function calcCommand({ sock, from, args, msg }) {
  const operacion = args.join(' ')
  if (!operacion) {
    await sock.sendMessage(from, {
      text: '❌ Ejemplos:\n.calc 2+2\n.calc sin(30)\n.calc sqrt(16)'
    })
    return true
  }

  try {
    const math = {
      sin: (x) => Math.sin(x * Math.PI / 180),
      cos: (x) => Math.cos(x * Math.PI / 180),
      tan: (x) => Math.tan(x * Math.PI / 180),
      sqrt: Math.sqrt,
      log: Math.log10,
      ln: Math.log,
      pi: Math.PI,
      e: Math.E
    }

    let expSegura = operacion
      .replace(/\^/g, '**')
      .replace(/sin/g, 'math.sin')
      .replace(/cos/g, 'math.cos')
      .replace(/tan/g, 'math.tan')
      .replace(/sqrt/g, 'math.sqrt')
      .replace(/log/g, 'math.log')
      .replace(/ln/g, 'math.ln')
      .replace(/π/g, 'math.pi')
      .replace(/pi/g, 'math.pi')
      .replace(/e/g, 'math.e')

    if (!/^[0-9+\-*/() .math:\[\]a-z]+$/.test(expSegura)) {
      throw new Error('Caracteres no permitidos')
    }

    const resultado = eval(expSegura)
    const resultadoStr = typeof resultado === 'number'
      ? (Number.isInteger(resultado) ? resultado : resultado.toFixed(4))
      : resultado

    await sock.sendMessage(from, {
      text: `🧮 *CALCULADORA*\n\n📝 ${operacion}\n= *${resultadoStr}*`
    }, { quoted: msg })
  } catch (e) {
    await sock.sendMessage(from, { text: '❌ Operación inválida' })
  }
  return true
}