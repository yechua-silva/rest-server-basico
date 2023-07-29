
const { Router, request } = require('express');
const { check } = require('express-validator');
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosPatch, 
    usuariosDelete 
} = require('../controllers/userControllers');
const { validarCampos } = require('../middleware/validar-campo');
const { esRolValido, existeEmail, existeUsuarioPorId, sonNumeros } = require('../helpers/db-validator');


const router = Router();

// Se le llama endpoint a la ruta "/api"
router.get('/',[
    check(request.query).custom( sonNumeros ),
    validarCampos
]
, usuariosGet)

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(), // Verifica si la id del url es un ID de mongo valido
    check('id').custom( existeUsuarioPorId ), // Valida la existencia de el id en la base de datos
    check('rol').custom( esRolValido ), // Valida existecia del rol contra la base de datos
    validarCampos // Tiene que ir al final de todo los check para que en caso de haber algun error no continue a las rutas usuriosPut
], usuariosPut) // :id - se usa para obtener informacion del URl

router.post('/', [
    // Aca van los middleware - Son funciones que se llaman entremedio de un peticion 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se evalua en nombre, desde req.body - isEmpty verifica que es vacio, - not es la negacion, osea verifica que no este vacio 
    check('password', 'El password debe tener al menos 6 caracteres').isLength({min: 6}),// VErifica la longitud con isLength()
    check('correo', 'El correo es invalido').isEmail(), // Toma como primer parametro que elemento de req.body quiero revisar, y como segundo el msg de error - isEmail, es para decirle que es el dato del body que le digo que revise
    check('correo').custom( existeEmail ),
    check('rol').custom( esRolValido ), // No es necesario mandarle el rol como parametro para que lo tome la funcion, como el primer argumento es igual el argumento que recibe, seria tal que asi: custom( rol => esRolValido(rol)) se obvia el rol
    validarCampos // Si lso middleware de arriba resgresan algu error, entonces no parasa este
], usuariosPost)


router.delete('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete)

router.patch('/', usuariosPatch)



module.exports = router