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
    executor.query(
        `SELECT 
            NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, TELEFONO, DIRECCION, FOTOGRAFIA, GENERO, 
            FECHA_NACIMIENTO, FECHA_REGISTRO, FECHA_VALIDACION, ESTADO, DESCRIPCION AS TIPO 
        FROM 
            Usuario U, Tipo T
        WHERE 
            U.COD_TIPO = T.COD_TIPO`, 
        []
    )
    .then(result => {
        res.json(result.rows);
    })
});

router.get('/:id', (req, res) => {
    const { username } = req.params;

    executor.query(
        `SELECT 
            COD_USUARIO, NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, TELEFONO, DIRECCION, FOTOGRAFIA, GENERO, 
            FECHA_NACIMIENTO, FECHA_REGISTRO, FECHA_VALIDACION, ESTADO, DESCRIPCION AS TIPO 
        FROM 
            Usuario U, Tipo T
        WHERE 
            U.COD_TIPO = T.COD_TIPO AND 
            COD_USUARIO = :id;`, 
        [username]
    )
    .then(result => {
        res.json(result.rows);
    })
})

router.post('/profile/:filename', upload.single('image'), (req, res) => {
    const file = req.params.filename;
    
    res.json({ 
        message: 'Profile image was uploaded sucessfully', 
        image: file 
    });
})

router.post('/', (req, res) => {
    const { NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, TELEFONO, FOTOGRAFIA, GENERO, FECHA_NACIMIENTO, DIRECCION, TIPO } = req.body;
    PASS = pwd.customPassword();
    executor.sp(
        `BEGIN 
            SP_NEWUSER(
                :nombre, :apellido, :username, :pass, :email, :telefono, 
                :fotografia, :genero, :nacimiento, :direccion, :tipo
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
        res.json({ 
            message: 'User was inserted successfully', 
            rows_affected: result
        });
    })
})

router.post('/validate', (req, res) => {
    // TODO: MODIFICAR PROCEDIMIENTO ALMACENADO, PARA VALIDAR PASSWORD GENERADO
    const { USERNAME, PASS, GENPASS } = req.body;
    executor.sp(
        `BEGIN 
            SP_UPDATEPASS(:username, :pass, :genpass);
        END`, 
        {
            username: USERNAME, 
            pass: PASS, 
            genpass: GENPASS
        }
    )
    .then(result => {
        res.json({
            message: 'Validate complete', 
            rows_affected: result
        });
    })
})

router.post('/check', (req, res) => {
    const { USERNAME, PASS } = req.body;

    executor.query(
        `SELECT * FROM USUARIO 
        WHERE 
            USERNAME LIKE :username AND 
            PASS LIKE :pass`, 
        [USERNAME, PASS]
    )
    .then(result => {
        res.json(result.rows);
    })
})

router.put('/', (req, res) => {
    const { COD_USUARIO, NOMBRE, APELLIDO, PASS, TELEFONO, DIRECCION } = req.body;

    executor.sp(
        `BEGIN
            SP_UPDATEUSER(
                :cod_usuario, :nombre, :apellido :pass, :telefono, :direccion
            );
        END`, 
        {
            cod_usuario: COD_USUARIO, 
            nombre: NOMBRE, 
            apellido: APELLIDO, 
            pass: PASS, 
            telefono: TELEFONO, 
            direccion: DIRECCION
        }
    )
    .then(result => {
        res.json({
            message: 'Transaction was complete', 
            rows_affected: result
        })
    })
})

router.put('/role', (req, res) => {
    const { COD_USUARIO, TIPO } = req.body;

    executor.sp(
        `BEGIN
            SP_UPDATEROL(
                :codigo, :tipo
            );
        END`, 
        {
            codigo: COD_USUARIO, 
            tipo: TIPO
        }
    )
    .then(result => {
        res.json({
            message: 'Transaction was complete', 
            rows_affected: result
        })
    })
})

module.exports = router;