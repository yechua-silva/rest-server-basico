

const validarCampos  = require('../middleware/validar-campo');
const validaRoles = require('../middleware/validar-roles');
const validarJWT = require('../middleware/validar-jwt');


module.exports = { // Se exportanc con el spred operator para copiar todo lo de la funciones que traen consigo
    ...validaRoles,
    ...validarJWT,
    ...validarCampos
}