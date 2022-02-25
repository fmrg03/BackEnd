const fs = require('fs')

const date = () => {
    const hoy = new Date()
    const fecha = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`
    const hora = `${hoy.getHours()}:${hoy.getMinutes()}:${hoy.getSeconds()}`
    return `${fecha} - ${hora}`
}

const leerArchivo = (ruta) => {
    let data = fs.readFileSync(ruta, { encoding: 'utf-8', flag: 'as+' })
    if (data.length != 0) {
        data = JSON.parse(data)
    } else {
        data = []
    }
    return data
}

const guardarArchivo = (ruta, data) => {
    fs.writeFileSync(ruta, JSON.stringify(data))
}

module.exports = {
    date,
    leerArchivo,
    guardarArchivo
}