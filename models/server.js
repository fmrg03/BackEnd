const express = require('express')
const { Router } = express
const productos = Router()
const carrito = Router()
const { date, leerArchivo, guardarArchivo } = require('./funciones')

let idProducto = 1
let idCarrito = 9500
let administrador = true

class Server {
    constructor() {
        this.app = express()
        this.puerto = process.env.PORT || 8080

        this.middlewares()

        this.routesProductos()
        this.routesCarrito()
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use('/api/productos', productos)
        this.app.use('/api/carrito', carrito)
        this.app.use((req, res) => {
            res.status(500).send({ error: -2, descripcion: `ruta '${req.url}', método '${req.method}' no implementada` })
        })
    }

    routesProductos() {
        productos.get('/:id?', (req, res) => {
            let id = req.params.id
            let dataProductos = leerArchivo('./outputs/productos.txt')
            if (id == undefined) {
                if (dataProductos.length != 0) {
                    res.send(dataProductos)
                } else {
                    res.send({ error: 'No hay productos' })
                }
            } else {
                let producto = dataProductos.filter(producto => producto.id == id)
                if (producto.length == 0) {
                    res.send({ error: 'No existe el producto' })
                } else {
                    res.send(producto)
                }
            }
        })

        productos.post('/', (req, res) => {
            if (administrador) {
                let dataProductos = leerArchivo('./outputs/productos.txt')
                if (dataProductos.length != 0) {
                    idProducto = dataProductos[dataProductos.length - 1].id + 1
                }
                if (Object.keys(req.body).length != 0) {
                    const objetoProducto = {}
                    objetoProducto.id = idProducto
                    objetoProducto.timestamp = date()
                    objetoProducto.nombre = req.body.nombre
                    objetoProducto.descripcion = req.body.descripcion
                    objetoProducto.precio = req.body.precio
                    objetoProducto.imagen = req.body.imagen
                    objetoProducto.stock = req.body.stock
                    dataProductos.push(objetoProducto)
                    guardarArchivo('./outputs/productos.txt', dataProductos)
                    res.send(dataProductos)
                } else {
                    res.send({ error: 'Datos enviados, vacios' })
                }
            } else {
                res.send({ error: -1, descripcion: `Ruta '${req.url}', método '${req.method}' no autorizada` })
            }

        })

        productos.put('/:id', (req, res) => {
            if (administrador) {
                let id = req.params.id
                let producto = leerArchivo('./outputs/productos.txt').filter(producto => producto.id == id)
                let dataProductos = leerArchivo('./outputs/productos.txt').filter(producto => producto.id != id)
                if (producto.length == 0) {
                    res.send({ error: 'No existe el producto' })
                } else {
                    producto = producto[0]
                    producto.timestamp = date()
                    producto.nombre = req.body.nombre
                    producto.descripcion = req.body.descripcion
                    producto.codigo = req.body.codigo
                    producto.precio = req.body.precio
                    producto.imagen = req.body.imagen
                    producto.stock = req.body.stock
                    dataProductos.push(producto)
                    guardarArchivo('./outputs/productos.txt', dataProductos)
                    res.send(dataProductos)
                }
            } else {
                res.send({ error: -1, descripcion: `Ruta '${req.url}', método '${req.method}' no autorizada` })
            }
        })

        productos.delete('/:id', (req, res) => {
            if (administrador) {
                let id = req.params.id
                let dataProductos = leerArchivo('./outputs/productos.txt').filter(producto => producto.id != id)
                guardarArchivo('./outputs/productos.txt', dataProductos)
                res.send(dataProductos)
            } else {
                res.send({ error: -1, descripcion: `Ruta '${req.url}', método '${req.method}' no autorizada` })
            }
        })
    }

    routesCarrito() {
        carrito.post('/', (req, res) => {
            let dataCarrito = leerArchivo('./outputs/carrito.txt')
            if (dataCarrito.length != 0) {
                idCarrito = dataCarrito[dataCarrito.length - 1].id + 1
            }
            const objetoCarrito = {}
            objetoCarrito.id = idCarrito
            objetoCarrito.timestamp = date()
            objetoCarrito.productos = []
            dataCarrito.push(objetoCarrito)
            guardarArchivo('./outputs/carrito.txt', dataCarrito)
            res.send(objetoCarrito)
        })

        carrito.delete('/:id', (req, res) => {
            let idCart = req.params.id
            let dataCarrito = leerArchivo('./outputs/carrito.txt').filter(carrito => carrito.id != idCart)
            guardarArchivo('./outputs/carrito.txt', dataCarrito)
            res.send(dataCarrito)
        })

        carrito.get('/:id/productos', (req, res) => {
            let idCart = req.params.id
            let productosCarrito = leerArchivo('./outputs/carrito.txt').filter(carrito => carrito.id == idCart)
            if ((productosCarrito[0].productos.length != 0) || (productosCarrito[0].productos.length == undefined)) {
                res.send(productosCarrito)
            } else {
                res.send({ error: 'No hay productos en el carrito' })
            }
        })

        carrito.post('/:id/productos', (req, res) => {
            let id = req.params.id
            let producto = leerArchivo('./outputs/productos.txt').filter(producto => producto.id == req.body.id_prod)
            let carritosTodos = leerArchivo('./outputs/carrito.txt').filter(carrito => carrito.id != id)
            if (producto.length != 0) {
                let dataCarrito = leerArchivo('./outputs/carrito.txt').filter(carrito => carrito.id == id)
                if (dataCarrito.length != 0) {
                    dataCarrito[0].productos.push(producto[0])
                    carritosTodos.push(dataCarrito[0])
                    guardarArchivo('./outputs/carrito.txt', carritosTodos)
                    res.send(dataCarrito)
                } else {
                    res.send({ error: 'No existe el carrito' })
                }
            } else {
                res.send({ error: 'No existe el producto' })
            }
        })

        carrito.delete('/:id/productos/:id_prod', (req, res) => {
            let id = req.params.id_prod
            let idCart = req.params.id
            let carrito = leerArchivo('./outputs/carrito.txt').filter(carrito => carrito.id == idCart)
            if (carrito.length != 0) {
                let carritosTodos = leerArchivo('./outputs/carrito.txt').filter(carrito => carrito.id != idCart)
                if (carrito[0].productos.filter(producto => producto.id == id).length != 0) {
                    carrito[0].productos = carrito[0].productos.filter(producto => producto.id != id)
                    carritosTodos.push(carrito[0])
                    guardarArchivo('./outputs/carrito.txt', carritosTodos)
                    res.send(carrito[0])
                } else {
                    res.send({ error: 'No existe el producto' })
                }
            } else {
                res.send({ error: 'No existe el carrito' })
            }
        })
    }

    listen() {
        this.app.listen(this.puerto, () => {
            console.log(`Servidor corriendo en el puerto: ${this.puerto}`)
        })
    }
}

module.exports = Server