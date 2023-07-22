
const { Router } = require('express');
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosPatch, 
    usuariosDelete 
} = require('../controllers/userControllers');


const router = Router();

// Se le llama endpoint a la ruta "/api"
router.get('/', usuariosGet)

router.post('/', usuariosPost)

router.put('/:id', usuariosPut) // :id - se usa para obtener informacion del URl

router.patch('/', usuariosPatch)

router.delete('/', usuariosDelete)



module.exports = router