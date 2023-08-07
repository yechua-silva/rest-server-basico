const { Router, request } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRol } = require('../middleware');
const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoriaPorId, 
    categoriasPut,
    categoriasDelete
} = require('../controllers/categoriasControllers');
const { 
    sonNumeros, 
    existeCategoria
} = require('../helpers/db-validator');


// Crear instacia del router
const router = Router();

// Obtener todas las categorias - publico
router.get('/',[
    check(request.query).custom( sonNumeros ),
    validarCampos
], obtenerCategorias )

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoria ),
    
    validarCampos
], obtenerCategoriaPorId )

// Crear una categoria - privado - cualquier persona con token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria )

// Actualizar una categoria - privado - cualquier persona con token valido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoria ),
    validarCampos,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriasPut)

// Borrar una categoria - privado - solo admin
router.delete('/:id',[
    validarJWT,
    tieneRol( 'ADMIN_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoria ),
    validarCampos
], categoriasDelete )

module.exports = router;