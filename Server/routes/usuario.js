const { Router } = require('express');
const oracledb = require('oracledb');
const path = require('path');
const multer = require('multer');
const executor = require('../db/exec');
const fs = require('fs');
const pwd = require('../tools/password');

const router = new Router();

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './res/profile')
    }, 
    filename: (req, file, callback) => {
        callback(null, req.params.filename + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    const data = {
        "module": "Usuario",
        "author": "2010 20831"
    };
    res.json(data);
});

router.post('/profile/:filename', upload.single('image'), (req, res) => {
    const file = req.params.filename;
    
    res.json({message: 'Profile image uploaded', image: file});
})

router.post('/', (req, res) => {
    const { NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, TELEFONO, FOTOGRAFIA, GENERO, FECHA_NACIMIENTO, DIRECCION, TIPO } = req.body;
    executor.sp(
        `BEGIN 
            SP_NEWUSER(
                :nombre, :apellido, :username, :pass, :email, :telefono, :fotografia, :genero, :nacimiento, :direccion, :tipo
            );
        END`,
        {
            nombre: NOMBRE, 
            apellido: APELLIDO, 
            username: USERNAME, 
            pass: PASS, 
            email: EMAIL, 
            telefono: TELEFONO, 
            fotografia: FOTOGRAFIA, 
            genero: GENERO, 
            nacimiento: FECHA_NACIMIENTO, 
            direccion: DIRECCION, 
            tipo: TIPO
        }
    )
    .then(result => {
        res.json({ message: 'inserted'});
    })
})

module.exports = router;