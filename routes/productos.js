const { Router, request } = require("express");
const { check } = require("express-validator");

const { 
    obtenerProducto, 
    obtenerProductoPorId, 
    crearProducto, 
    actualizarProducto, 
    deleteProducto 
} = require("../controllers/productosControllers");
const { 
    validarJWT, 
    validarCampos, 
    tieneRol
} = require("../middleware");
const { 
    sonNumeros, 
    existeProducto 
} = require("../helpers/db-validator");


// Crear instacia del router
const router = Router();

// Obtenr todos los productos
router.get('/',[
    check( request.query).custom( sonNumeros ),
    validarCampos
], obtenerProducto )

// Obtener producto por id
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProductoPorId )


// Creacion de producto
router.post('/',[
    validarJWT,
    check('nombre', 'EL nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').not().isEmpty(),
    check('descripcion', 'Ingreasa un descripcion').not().isEmpty(),
    validarCampos
], crearProducto )


// Actualizar producto
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], actualizarProducto )

// Borrar producto
router.delete('/:id',[
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], deleteProducto )

module.exports = router;