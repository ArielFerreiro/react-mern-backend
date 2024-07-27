const {response} = require('express');

const Evento = require('../models/Evento');

const getEvents = async (req, res = response) => {

    const events = await Evento.find().populate('user', 'name');

    res.status(200).json({
        ok: true,
        events
    });

}

const createEvent = async (req, res = response) => {

    const event = new Evento( req.body );

    try {

        event.user = req.uid;

        const savedEvent = await event.save();

        res.status(201).json({
            ok: true,
            event: savedEvent
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the DB admin.'    
        });
    }
}

const updateEvent = async (req, res = response) => {

    const uid = req.uid;
    const eventId = req.params.id;

    try {

        const event = await Evento.findById(eventId);

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event does not exist with given ID'
            });  
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Unauthorized updated to event!'
            });  
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Evento.findByIdAndUpdate(eventId, newEvent, { new: true });

        res.status(200).json({
            ok: true,
            event: updatedEvent
        });   

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the DB admin.'    
        });
    }

}

const deleteEvent = async (req, res = response) => {

    const uid = req.uid;
    const eventId = req.params.id;

    try {
        
        const event = await Evento.findById(eventId);

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event does not exist with given ID'
            });  
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Unauthorized deletion of event!'
            });  
        }

        await Evento.findByIdAndDelete(eventId);

        res.status(200).json({
            ok: true
        });  

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the DB admin.'    
        });
    }

}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}