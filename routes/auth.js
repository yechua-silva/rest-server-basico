
const { Router, request } = require('express');
const { check } = require('express-validator');

const { login, loginGoogle } = require('../controllers/authControlles');
const { validarCampos } = require('../middleware/validar-campo');

// Crear instacia del router
const router = Router();

// PATH: /api/auth
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(), // isEmail, le dice el tipo de dato que quiero que revise, si tiene formato de email
    check('password', 'La contraseña es obligatoria').not().isEmpty(), // Verifica si esta vacio
    
    validarCampos
], login )

// Ruta para acceder con google
router.post('/google', [
    check('id_token', 'Token de google es necesario').not().isEmpty(), // no tiene que estar vacio
    validarCampos
], loginGoogle )


module.exports = router;