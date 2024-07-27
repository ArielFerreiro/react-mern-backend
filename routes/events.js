const { Router } = require('express');
const { check } = require('express-validator');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validateFields } = require('../middlewares/validateFields');

const { validateJWT } = require('../middlewares/validateJWT');
const { isDate } = require('../helpers/isDate');


const router = Router();

// /api/events

// All requests must come with a valid Token
router.use( validateJWT );

//Get Events
router.get(
    '/', 
    getEvents 
);

//Create Event
router.post('/',
    [ 
        check('title', 'Title is mandatory').not().isEmpty(),
        check('start', 'Start Date is mandatory').custom( isDate ),
        check('end', 'End Date is mandatory').custom( isDate ),
        validateFields
    ],    
    createEvent );

//Update Event
router.put('/:id', 
    [ 
        check('title', 'Title is mandatory').not().isEmpty(),
        check('start', 'Start Date is mandatory').custom( isDate ),
        check('end', 'End Date is mandatory').custom( isDate ),
        validateFields
    ], 
    updateEvent );

//Update Event
router.delete('/:id',     
    deleteEvent );

module.exports = router;