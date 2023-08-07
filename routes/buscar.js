const { Router } = require('express');
const { buscar } = require('../controllers/buscarControllers');


const router = Router()

// Por lo general las peticiones de busquedas son get, y los parametros de pasan por el URL
router.get('/:coleccion/:termino', buscar)


module.exports = router;