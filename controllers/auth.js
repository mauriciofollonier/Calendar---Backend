const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
    
        let usuario = await Usuario.findOne({ email });

            if( usuario ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            };

        usuario = new Usuario( req.body );

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        // Grabar en BdD
        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Por favor cominíquese con el admin'
        });
    };
};

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });
        
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con ese email no existe'
            });
        };
       
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        };
        
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {

        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Por favor cominíquese con el admin'
        });
    }; 
};

const revalidarToken =  async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid: uid,
        name: name,
        token: token
    })
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}