const jwt = require('jsonwebtoken');


const generarJWT = ( uid = '' ) => { // uid - identificador unico del usuario
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, { // Se le manda el payload - info a encriptar; la secret key, que es la firma y por ultimo las opciones
            expiresIn: '4h' // Expira en 3 dias
        },(err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        }  )
    })
}


module.exports = {
    generarJWT
}