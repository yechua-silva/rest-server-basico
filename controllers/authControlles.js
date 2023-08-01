const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login =  async (req = request, res = response) => {
    const { correo, password } = req.body;


    try {
        // VErificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) { // Si no existe - lo que hace es que si no existe, no entraria, por eso lo niega
            return res.status(404).json({
                msg: 'Correo / Constraseña no son correctos - correo'
            });
        }

        // Verificar es estado del usuario - false: no activo, true: activo
        if ( !usuario.estado ) { // Si el estado es false lo niega para  que caiga en el error, ya que el false significa que el usuario fue borrado
            return res.status(404).json({
                msg: 'Correo / Constraseña no son correcto - estado: false'
            });
        }
        // Verificar la contraseña
        const validarPass = bcryptjs.compareSync( password, usuario.password ); // Compara el password enviado por el login contra el almacenado en DB usuario.password - eso hace compareSync 
        if ( !validarPass ) { // El validarPass retorna un boolean, si es false no coincide con la DB y lo niega para que entre al error
            return res.status(404).json({
                msg: 'Correo / Constraseña no son correcto - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        
        res.json({
            usuario,
            token
        })
    } catch (error) { // ACa no deberia de entrar nunca, solo se pone para que la app no se caiga
        console.log(error);
        return res.status(500).json({ // 500 - Internal Server Error
            msg: 'Algo salio mal'
        })
    }
};

const loginGoogle = async (req = request, res = response) => {
    const { id_token } = req.body;

    // Google verify
    try {
        const { nombre, correo, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Crear un usuario
            const data = {
                nombre,
                correo,
                password: '',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario( data );
            // Guardar usuario de Google en DB
            await usuario.save();
        }

        // Si el usuario en DB fue borrado
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con administrador, usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }


};

module.exports = {
    login,
    loginGoogle
}