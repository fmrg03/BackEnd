# Proyecto Backend - CoderHouse

**[API - Ecommerce](https://near-interesting-tabletop.glitch.me)**

**Autor:** Froilán Ramos

## Información del Proyecto

El proyecto se trata, por los momentos de una API ecommerce, donde el usuario podrá realizar peticiones a la API para obtener información de productos, agregar nuevos productos, modificarlos o eliminarlos. Así mismo, podrá crear un carrito, visualizar los productos que contiene el carrito, agregar productos al carrito, eliminar los productos del carrito o eliminar el carrito completo.

La API se encuentra cargada en Glitch, y se puede acceder de la siguiente forma:

- La ruta base de la API para la seccion de **productos** es: https://near-interesting-tabletop.glitch.me/api/productos

- La ruta base de la API para la seccion de **carrito** es: https://near-interesting-tabletop.glitch.me/api/carrito

Así mismo, se puede instalar el proyecto en un servidor de desarrollo local, para ello se debe descargar los archivos del repositorio, luego desde la terminal ingresar a la carpeta que contiene los archivos y ejecutar el siguiente comando: ***npm install*** para instalar todas las dependencias y pueda funcionar correctamente.

Luego de que se instalen las dependencias, se debe ejecutar el siguiente comando en la terminal: ***npm start*** para iniciar el servidor.

Localmente, luego de iniciar el servidor, se puede acceder a la API de la siguiente forma:

- La ruta base de la API para la seccion de **productos** es: https://localhost:8080/api/productos

- La ruta base de la API para la seccion de **carrito** es: https://localhost:8080/api/carrito

Cabe destacar que existe una variable booleana para indicar si el usuario es administrador o no, y pueda acceder a ciertos endpoints teniendo los privilegios; actualmente esta variable se encuentra hardcodeada en _TRUE_, por tanto todos los endpoints serán accesibles.
##EndPoints

Como anteriormente se nombró, existen dos rutas bases, una para _productos_ y otra para _carrito_. Para usar la API, se puede usar [Postman](https://www.postman.com) y se pueden usar los endpoints de la siguiente forma:

Tomando en cuenta que para usar ciertos Endpoints se debe enviar en el body del request en formato JSON:

- Agregar los productos, se deben ingresar los keys con sus respectivos values _(**keys:** nombre, precio, descripcion, imagen, stock, categoria)_, ejemplo:

    ***{"nombre": "Arroz", "descripcion": "Arroz en Granos", "precio": 180, "imagen": "XXXXXXX", "stock": 12}***

- Agregar un producto al carrito, de debe ingresar el id del producto  _(id_prod)_ que se desea agregar al carrito, ejemplo:

    ***{"id_prod": 1}***


***Ruta Productos:*** _/api/productos_

- **GET :** '/:id?' - Para obtener todos los productos disponibles o un producto por su id. (disponible para usuarios y administradores)
- **POST :** '/' - Para incorporar productos al listado (disponible para administradores)
- **PUT :** '/:id' - Actualiza un producto por su id (disponible para administradores)
- **DELETE :** '/:id' - Borra un producto por su id (disponible para administradores)

***Ruta Carrito:*** _/api/carrito_

- **POST :** '/' - Crea un carrito y devuelve su id.
- **DELETE :** '/:id' - Vacía un carrito y lo elimina.
- **GET :** '/:id/productos' - Me permite listar todos los productos guardados en el carrito
- **POST :** '/:id/productos' - Para incorporar productos al carrito (id del carrito se coloca en la url) por su id de producto (se ingresa el id del producto en el body del request)
- **DELETE :** '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
