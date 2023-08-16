
const { Router, request } = require('express');
const { check } = require('express-validator');



const { validarCampos, validarArchivoSubir } = require('../middleware');
const { cargarArchivo,
    actualizarImagen, 
    mostrarImagenes, 
    actualizarImagenCloudinary
} = require('../controllers/uploadsControllers');
const { coleccionesPermitidas } = require('../helpers')

// Crear instacia del router
const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo )

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser un id de Mongo').isMongoId(),
    check('coleccion').custom( coleccion => coleccionesPermitidas( coleccion, ['usuarios', 'productos'])), // se le pasa la coleccion de la peticion, en base esta revisa que este en el arreglo de las permitidas, en dado caso prosigue
    validarCampos
], actualizarImagenCloudinary)
// ], actualizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un id de Mongo').isMongoId(),
    check('coleccion').custom( coleccion => coleccionesPermitidas( coleccion, ['usuarios', 'productos'])), // se le pasa la coleccion de la peticion, en base esta revisa que este en el arreglo de las permitidas, en dado caso prosigue
    validarCampos
], mostrarImagenes)


module.exports = router;