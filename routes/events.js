// CRUD
/* 
    Rutas de Eventos / Events
    host   +   /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos,
        crearEvento, 
        actualizarEvento, 
        eliminarEvento } = require('../controllers/events');

const router = Router();


router.get('/', validarJWT, getEventos );


router.post(
    '/', 
    [ // middlewares
    validarJWT,

    check( 'title', 'El titulo es obligatorio').not().isEmpty(),

    check( 'start', 'Fecha de inicio es obligatoria').custom( isDate ),

    check( 'end', 'Fecha de finalizacion es obligatorio').custom( isDate ),

    validarCampos
    ],
    crearEvento 
);

router.put('/:id', validarJWT, actualizarEvento );

router.delete('/:id', validarJWT, eliminarEvento );


module.exports = router;