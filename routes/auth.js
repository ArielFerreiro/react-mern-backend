const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

// /api/auth

//login
router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La constrasena debe ser de 6 caracteres').isLength({ min: 6}),
        validateFields
    ], 
    loginUsuario );

//new user
router.post(
    '/new', 
    [ 
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La constrasena debe ser de 6 caracteres').isLength({ min: 6}),
        validateFields
    ], 
    crearUsuario );

//renew token
router.get('/renew', validateJWT, revalidarToken);

module.exports = router;