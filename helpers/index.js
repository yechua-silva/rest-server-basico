

const dbValidator = require('./db-validator')
const generarJWT = require('./generar-jwt')
const googleVarify = require('./google-verify')
const subirArchivo = require('./subir-archivo')


module.exports = { // Se hace con spreeed para tener todo su contenido
    ...dbValidator,
    ...generarJWT,
    ...googleVarify,
    ...subirArchivo
}