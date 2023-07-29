const { response, request } = require('express') // Para tener la ayuda del autocompletado
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario'); // Es un estandar, empezar con mayuscula



const usuariosGet = async (req = request, res = response) => {
    // Desestructurar parametro de la URL
    const { limit = 5, desde = 0 } = req.query; // Por default, en caso de no entregrar ese parametro sera de 5
    const query = { estado: true};

    // Desestructuracion de arreglos - donde si o si el indice 0 es el el total, y el 1 el usuarios
    const [total, usuarios] = await Promise.all([ // El promise.all ejecura los await al mismo tiempo, o sea no espera que termine uno para pasar el sgt
        Usuario.countDocuments(query),
        Usuario.find(query) // Como no se borra de la base de datos, si no que deja de estar accesible, los que tengan el estado en false son los inaccesibles
            .skip(Number(desde)) // Le dice desde cual indice traer
            .limit(Number(limit)) // Limita el numero de registro que trae el find

    ])
    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body; // Leer los elemetos enviados por el cliente, se inicializa en server.js como middleware
    const usuario = new Usuario( { nombre, correo, password, rol} ); // Esta es solo la creacion de la instancia por lo que no se guarda aun en DB, a pesar de ya entregar id

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // El salt es el nuemero de vuelta que se le da a la encriptacion, por default esta en 10, entra mas grande mas se demora
    usuario.password = bcryptjs.hashSync( password, salt )

    // Guardad el usuario en DB
    await usuario.save();
    res.json({
        msg: 'post API - desde el controlador',
        usuario
    })
}

const usuariosPut = async (req, res = response) => {
    // Acceder al id, de router.put
    const { id } = req.params;
    const {_id, password, google, correo, ...resto } = req.body; // Se extrae el _id para no permitir que se modifique

    // TODO validar contra base de datos
    // Validar si manda el password, en caso de que asi sea, actualiza el password
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); // El salt es el nuemero de vuelta que se le da a la encriptacion, por default esta en 10, entra mas grande mas se demora
        resto.password = bcryptjs.hashSync( password, salt )
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto ) // Busca por el id y actualiza lo del resto

    res.json( usuario )
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - desde el controlador'
    })
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    // Borrar fisicamente - no recomendado
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Cambiar estado del usuario - estado en false significa que esta borrado
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }); // Buscas por el id, y cambia el estado a false

    res.json({
        usuario
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}