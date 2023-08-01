const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token') // Accese a los reader de el pedido

    if ( !token ) {
        return res.status(401).json({ // 401 - unauthorized
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const { uid } = jwt.verify( token , process.env.SECRETORPRIVATEKEY );

        // leer uduario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        // Verificar que el usuario exista
        if ( !usuario ) {
            return res.status(401).json({ // 401 - unauthorized
                msg: 'Token no valido - usuario no existe en DB'
            })
        }

        // Verificar el estado del usuario
        if ( !usuario.estado ) {
            return res.status(401).json({ // 401 - unauthorized
                msg: 'Token no valido - usuario con estado: false'
            })
        }

        // Asignar al request el usuario, para hacerlo disponible en el request
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}


module.exports = {
    validarJWT
}