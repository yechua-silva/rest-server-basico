const { response, request } = require('express') // Para tener la ayuda del autocompletado


const usuariosGet = (req = request, res = response) => {
    // Extraer parametros opcionales desde la URL - Estos parametro ya los parsea express, por lo que solo se debe modificar el controlador, ose aeste, y no la ruta - user, porque no es como el put. Para obtener los parametros, se hace con req.query
    const { nombre = 'No name', apikey, limit = '10', page = '1' } = req.query; // Desestructurar los parametros para obtener los que nos interesan

    res.json({
        msg: 'get API - desde el controlador',
        nombre,
        apikey,
        limit,
        page
    })
}

const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body; // Leer los elemetos enviados por el cliente, se inicializa en server.js como middleware
    res.json({
        msg: 'post API - desde el controlador',
        nombre,
        edad
    })
}

const usuariosPut = (req, res = response) => {
    // Acceder al id, de router.put
    const id = req.params.id;

    res.json({
        msg: 'put API - desde el controlador',
        id // Extrae el dato desde la URL - probado en postman
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - desde el controlador'
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - desde el controlador'
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}