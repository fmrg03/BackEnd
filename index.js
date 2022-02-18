const express = require('express')
const app = express()
const { Router } = express
const productos = Router()
const carrito = Router()
const fs = require('fs')
const { networkInterfaces } = require('os')

let arrayProductos = []
let arrayCarrito = []
let idProducto = 1
let idCarrito = 9500
let administrador = true

const date = () => {
    const hoy = new Date()
    const fecha = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`
    const hora = `${hoy.getHours()}:${hoy.getMinutes()}:${hoy.getSeconds()}`
    return `${fecha} - ${hora}`
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/productos', productos)
app.use('/api/carrito', carrito)

productos.get('/:id?', (req, res) => {
    let id = req.params.id
    if (id == undefined) {
        if (arrayProductos.length != 0) {
            res.send(arrayProductos)
        } else {
            res.send({ error: 'No hay productos' })
        }
    } else {
        let producto = arrayProductos.filter(producto => producto.id == id)
        if (producto.length == 0) {
            res.send({ error: 'No existe el producto' })
        } else {
            res.send(producto)
        }
    }
})

productos.post('/', (req, res) => {
    if (administrador) {
        const objetoProducto = {}
        objetoProducto.id = idProducto
        objetoProducto.timestamp = date()
        objetoProducto.nombre = req.body.nombre
        objetoProducto.descripcion = req.body.descripcion
        objetoProducto.precio = req.body.precio
        objetoProducto.imagen = req.body.imagen
        objetoProducto.stock = req.body.stock
        arrayProductos.push(objetoProducto)
        res.send(arrayProductos)
        idProducto++
        fs.writeFileSync('./productos.txt', JSON.stringify(arrayProductos))
    } else {
        res.send({ error: -1, descripcion: `Ruta '${req.url}', método '${req.method}' no autorizada` })
    }
    
})

productos.put('/:id', (req, res) => {
    if (administrador) {
        let id = req.params.id
        let producto = arrayProductos.filter(producto => producto.id == id)
        if (producto.length == 0) {
            res.send({ error: 'No existe el producto' })
        } else {
            arrayProductos[id - 1].timestamp = date()
            arrayProductos[id - 1].nombre = req.body.nombre
            arrayProductos[id - 1].descripcion = req.body.descripcion
            arrayProductos[id - 1].codigo = req.body.codigo
            arrayProductos[id - 1].precio = req.body.precio
            arrayProductos[id - 1].imagen = req.body.imagen
            arrayProductos[id - 1].stock = req.body.stock
            res.send(arrayProductos)
            fs.writeFileSync('./productos.txt', JSON.stringify(arrayProductos))
        }
    } else {
        res.send({ error: -1, descripcion: `Ruta '${req.url}', método '${req.method}' no autorizada` })
    }
})

productos.delete('/:id', (req, res) => {
    if (administrador) {
        let id = req.params.id
        arrayProductos = arrayProductos.filter(producto => producto.id != id)
        res.send(arrayProductos)
        fs.writeFileSync('./productos.txt', JSON.stringify(arrayProductos))
    } else {
        res.send({ error: -1, descripcion: `Ruta '${req.url}', método '${req.method}' no autorizada` })
    }
})

carrito.post('/', (req, res) => {
    const objetoCarrito = {}
    objetoCarrito.id = idCarrito
    objetoCarrito.timestamp = date()
    objetoCarrito.productos = []
    arrayCarrito.push(objetoCarrito)
    res.send(arrayCarrito)
    idCarrito++
    fs.writeFileSync('./carrito.txt', JSON.stringify(arrayCarrito))
})

carrito.delete('/:id', (req, res) => {
    let idCart = req.params.id
    arrayCarrito = arrayCarrito.filter(carrito => carrito.id != idCart)
    res.send(arrayCarrito)
    fs.writeFileSync('./carrito.txt', JSON.stringify(arrayCarrito))
})

carrito.get('/:id/productos', (req, res) => {
    let idCart = req.params.id
    let indice = arrayCarrito.findIndex(carrito => carrito.id == idCart)
    let productosCarrito = arrayCarrito[indice].productos
    if (productosCarrito.length != 0) {
        res.send(productosCarrito)
    } else {
        res.send({ error: 'No hay productos en el carrito' })
    }
})

carrito.post('/:idC/:id/productos', (req, res) => {
    let id = req.params.id
    let idCart = req.params.idC
    let producto = arrayProductos.filter(producto => producto.id == id)
    if (producto.length != 0) {
        let indice = arrayCarrito.findIndex(carrito => carrito.id == idCart)
        arrayCarrito[indice].productos.push(producto[0])
        res.send(arrayCarrito)
        fs.writeFileSync('./carrito.txt', JSON.stringify(arrayCarrito))
    } else {
        res.send({ error: 'No existe el producto' })
    }
})

carrito.delete('/:id/productos/:id_prod', (req, res) => {
    let id = req.params.id_prod
    let idCart = req.params.id
    let indice = arrayCarrito.findIndex(carrito => carrito.id == idCart)
    if (indice != -1) {
        let productosNuevos = arrayCarrito[indice].productos.filter(producto => producto.id != id)
        arrayCarrito[indice].productos = productosNuevos
        res.send(arrayCarrito)
        fs.writeFileSync('./carrito.txt', JSON.stringify(arrayCarrito))
    } else {
        res.send({ error: 'No existe el carrito' })
    }

})

app.use((req, res) => {
    res.status(500).send({ error: -2, descripcion: `ruta '${req.url}', método '${req.method}' no implementada` })
}) 

const PORT = 8080 || process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
})
server.on("error", (error) => console.log("hola", error));
