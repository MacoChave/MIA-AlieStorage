const { Router } = require('express');
const oracledb = require('oracledb');
const path = require('path');
const multer = require('multer');
const executor = require('../db/exec');
const fs = require('fs');

const password = require('../tools/password');
const nodemail = require('../tools/send');

const router = new Router();
const email = new nodemail();

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
    const { id } = req.params;

    executor.query(
        `SELECT 
            COD_USUARIO, NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, TELEFONO, DIRECCION, FOTOGRAFIA, GENERO, 
            FECHA_NACIMIENTO, FECHA_REGISTRO, FECHA_VALIDACION, ESTADO, DESCRIPCION AS TIPO 
        FROM 
            Usuario U, Tipo T
        WHERE 
            U.COD_TIPO = T.COD_TIPO AND 
            COD_USUARIO = :cod_usuario`, 
        { cod_usuaio: id }
    )
    .then(result => {
        res.json(result.rows);
    })
})

router.post('/profile/:filename', upload.single('image'), (req, res) => {
    const file = req.params.filename;
    
    res.json({ 
        MESSAGE: 'Profile image was uploaded sucessfully', 
        RESULT: file 
    });
})

router.post('/', (req, res) => {
    const { NOMBRE, APELLIDO, USERNAME, EMAIL, TELEFONO, FOTOGRAFIA, GENERO, FECHA_NACIMIENTO, DIRECCION, TIPO } = req.body;
    const PASS = password.passwordGenerator();
    const mailOptions = {
        from: 'noreply@aliestorage.com', 
        to: EMAIL, 
        subject: 'Validar tu cuenta', 
        html: `<h1>Alie-Storage</h1>
                <h2>Verificar correo electrónico</h2>
                <p>El correo electrónico proporcionado <i>${EMAIL}</i> es válido</p>
                <h2>Configura tu contraseña</h2>
                <p>Para configurar tu contraseña, entra <a href="http://localhost:4200/validate-me">aquí</a></p>
                <p>Tus credenciales provisionales son: </p>
                <ul>
                    <li><b>Username: </b>${USERNAME}</li>
                    <li><b>Contraseña: </b>${PASS}</li>
                    </ul>`
                }
    executor.sp(
        `BEGIN 
            SP_NEWUSER(
                :nombre, :apellido, :username, :pass, :email, :telefono, 
                :fotografia, :genero, :nacimiento, :direccion, :tipo, :out_result
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
            tipo: TIPO, 
            out_result: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        }
    )
    .then(result => {
        if (result.outBinds.out_result > 0)
            email.sendMail(mailOptions)
            
        res.json({ 
            MESSAGE: 'User was inserted successfully', 
            ROWS_AFFECTED: result.outBinds.OUT_RESULT
        });
    })
    .catch(err => {
        res.json({ 
            MESSAGE: "User wasn't created", 
            ROWS_AFFECTED: result.outBinds.OUT_RESULT, 
            RESPONSE: err
        });
    })
})

router.post('/validate', (req, res) => {
    const { USERNAME, PASS, GENPASS } = req.body;
    CORRECT = password.paswordValidator(PASS);
    console.log(req.body)
    console.log(CORRECT)
    if (CORRECT) {
        executor.sp(
            `BEGIN 
                SP_SETTINGPASS(:username, :pass, :genpass, :out_result);
            END`, 
            {
                out_result: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }, 
                username: USERNAME, 
                pass: PASS, 
                genpass: GENPASS
            }
        )
        .then(result => {
            res.json({
                MESSAGE: 'Validate complete', 
                ROWS_AFFECTED: result.outBinds.out_result
            });
        })
        .catch(err => {
            err.json({
                MESSAGE: 'Sin registros', 
                ROWS_AFFECTED: result.outBinds.out_result, 
                RESPONSE: err
            });
        })
    } else {
        res.json({
            MESSAGE: 'Wrong password', 
            ROWS_AFFECTED: -3, 
            RESPONSE: err
        })
    }
})

router.put('/reloadpass', (req, res) => {
    const { USERNAME, EMAIL, GENPASS } = req.body;
    console.log(req.body)
    const PASS = password.passwordGenerator();
    const mailOptions = {
        from: 'noreply@aliestorage.com', 
        to: EMAIL, 
        subject: 'Validar tu cuenta', 
        html: `<h1>Alie-Storage</h1>
                <h2>Verificar correo electrónico</h2>
                <p>El correo electrónico proporcionado <i>${EMAIL}</i> es válido</p>
                <h2>Configura tu contraseña</h2>
                <p>Para configurar tu contraseña, entra <a href="http://localhost:4200/validate-me">aquí</a></p>
                <p>Tus credenciales provisionales son: </p>
                <ul>
                    <li><b>Username: </b>${USERNAME}</li>
                    <li><b>Contraseña: </b>${PASS}</li>
                    </ul>`
                }
    executor.query(
        `UPDATE USUARIO 
        SET 
            PASS = :pass,  
            FECHA_VALIDACION = CURRENT_TIMESTAMP 
        WHERE 
            USERNAME = :username AND 
            PASS = :genpass`, 
        {
            pass: PASS, 
            username: USERNAME, 
            genpass: GENPASS
        }
    )
    .then(result => {
        email.sendMail(mailOptions)
        res.json({
            MESSAGE: 'Password was reloaded successfully', 
            ROWS_AFFECTED: result.rowsAffected
        })
    })
    .catch(err => {
        res.json({
            MESSAGE: "Password wasn't reloaded", 
            ROWS_AFFECTED: result.rowsAffected, 
            RESPONSE: err
        })
    })
})

router.post('/check', (req, res) => {
    const { USERNAME, PASS } = req.body;
    console.info(USERNAME)
    console.info(PASS)

    executor.query(
        `SELECT 
            COD_USUARIO ,
            NOMBRE , APELLIDO , USERNAME , PASS ,
            EMAIL , TELEFONO , DIRECCION ,
            FOTOGRAFIA , GENERO , 
            FECHA_NACIMIENTO , FECHA_REGISTRO , FECHA_VALIDACION ,
            ESTADO , TIPO  
        FROM VIEW_USUARIO 
        WHERE 
            USERNAME LIKE :username AND 
            PASS LIKE :pass`, 
        {
            username: USERNAME, 
            pass: PASS
        }
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        res.json(err);
    })
})

router.put('/', (req, res) => {
    const { COD_USUARIO, NOMBRE, APELLIDO, PASS, TELEFONO, DIRECCION } = req.body;

    executor.sp(
        `BEGIN
            SP_UPDATEUSER(
                :cod_usuario, :nombre, :apellido :pass, :telefono, :direccion, :out_result
            );
        END`, 
        {
            cod_usuario: COD_USUARIO, 
            nombre: NOMBRE, 
            apellido: APELLIDO, 
            pass: PASS, 
            telefono: TELEFONO, 
            direccion: DIRECCION, 
            out_result: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        }
    )
    .then(result => {
        console.log(result.outBinds.OUT_RESULT)
        res.json({
            MESSAGE: 'Transaction was complete', 
            ROWS_AFFECTED: result.outBinds.OUT_RESULT
        })
    })
})

router.put('/role', (req, res) => {
    const { COD_USUARIO, TIPO } = req.body;

    executor.sp(
        `SET SERVEROUTPUT ON;
        BEGIN
            SP_UPDATEROL(
                :codigo, :tipo, :out_result
            );
        END`, 
        {
            codigo: COD_USUARIO, 
            tipo: TIPO, 
            out_result: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        }
    )
    .then(result => {
        res.json({
            MESSAGE: 'Transaction was complete', 
            ROWS_AFFECTED: result.outBinds.OUT_RESULT
        })
    })
})

module.exports = router;