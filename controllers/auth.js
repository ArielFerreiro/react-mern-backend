const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {

        // Check if user already exists in DB
        let usuario = await Usuario.findOne({email});

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'A user already exists with that email.'    
            });
        }

        usuario = new Usuario( req.body );

        //Encrypt password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(usuario.password, salt);

        await usuario.save();   

        // Generate JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the DB admin.'    
        });
    }

}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Check if user already exists in DB
        const usuario = await Usuario.findOne({email});

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'User or password does not exist.'    
            });
        }

        // Check password
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password not valid, try again.'    
            });
        }

        // Generate JWT
        const token = await generarJWT(usuario.id, usuario.name);
        
        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please contact the DB admin.'    
        });
    }

}

const revalidarToken = async (req, res = response) => {

    const {uid, name} = req;

    //Generate new JWT
    const token = await generarJWT(uid, name);

    res.status(200).json({
        ok: true,
        uid,
        name,
        token
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}