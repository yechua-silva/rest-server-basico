const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() { // El construcctor es el que se manda a llamar cuando se crea la instancia
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios'
        }

        // Coneccion con base de datos
        this.conectarDB();

        // Middleware - funciones que le añaden funcionalidad al web server
        this.middleware();

        // Rutas de mi aplicacion

        this.routes();
    }

    async conectarDB() {
        await dbConnection()
    }

    middleware() {
        // CORS
        this.app.use( cors());

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public'));
    }

    routes() {
        // Rutas de autorizacion y login
        this.app.use( this.paths.auth, require('../routes/auth')) // Aca se usa el import de el router, que no son mas que lagica antes de las peticiones pertinente
        
        // Rutas categorias
        this.app.use( this.paths.categorias, require('../routes/categorias'))

        // Rutas productos
        this.app.use( this.paths.productos, require('../routes/productos'))

        
        // Rutas usuarios con CRUD
        this.app.use( this.paths.usuarios, require('../routes/user'))

        // Rutas para la busqueda
        this.app.use( this.paths.buscar, require('../routes/buscar'))

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server running on port ' + this.port);
        })
    }
}

module.exports = Server;