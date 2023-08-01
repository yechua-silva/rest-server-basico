
const { Router, request } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/authControlles');
const { validarCampos } = require('../middleware/validar-campo');

// Crear instacia del router
const router = Router();

// PATH: /api/auth
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(), // isEmail, le dice el tipo de dato que quiero que revise, si tiene formato de email
    check('password', 'La contraseña es obligatoria').not().isEmpty(), // Verifica si esta vacio
    
    validarCampos
], login )


module.exports = router;