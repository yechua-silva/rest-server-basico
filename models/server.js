const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() { // El construcctor es el que se manda a llamar cuando se crea la instancia
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

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
        this.app.use( this.authPath, require('../routes/auth')) // Aca se usa el import de el router, que no son mas que lagica antes de las peticiones pertinente
        // Rutas usuarios con CRUD
        this.app.use( this.usuariosPath, require('../routes/user'))
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server running on port ' + this.port);
        })
    }
}

module.exports = Server;