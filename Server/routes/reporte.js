const { Router } = require('express');
const executor = require('../db/exec');
const oracle = require('oracledb');

const router = new Router();

router.get('/', (req, res) => {
    const data = {
        "module": "Reporte",
        "author": "2010 20831"
    };
    res.json(data);
});

router.post('/usuario', (req, res) => {
    const { YEAR } = req.body;
    console.log(YEAR);

    executor.query(
        `SELECT 
            COD_USUARIO ,
            NOMBRE ,
            APELLIDO ,
            USERNAME ,
            PASS ,
            EMAIL ,
            TELEFONO ,
            DIRECCION ,
            FOTOGRAFIA ,
            GENERO ,
            FECHA_NACIMIENTO ,
            FECHA_REGISTRO ,
            FECHA_VALIDACION ,
            ESTADO ,
            COD_TIPO  
        FROM USUARIO
        WHERE 
            EXTRACT(YEAR FROM (FECHA_NACIMIENTO)) > :year`, 
        { year: YEAR }
    )
    .then(result => res.json(result.rows))
})

router.post('/mod', (req, res) => {
    const { Y_DATE, Z_DATE, CARPETA } = req.body;

    console.log(Y_DATE);
    console.log(Z_DATE);
    console.log(CARPETA);

    executor.query(
        `SELECT 
            U.COD_USUARIO, 
            U.USERNAME AS USUARIO, 
            DV.COD_DISCO, 
            DV.NOMBRE AS DISCO, 
            P.COD_PARTICION, 
            P.NOMBRE AS PARTICION, 
            J.STRING1 AS CARPETA, 
            J.DATE_WRITTER
        FROM 
            USUARIO U, 
            DISCOVIRTUAL DV, 
            DETALLEDISCO DD, 
            PARTICION P, 
            JOURNAL J
        WHERE 
            U.COD_USUARIO = DD.COD_USUARIO AND 
            DD.COD_DISCO = DV.COD_DISCO AND 
            DV.COD_DISCO = P.COD_DISCO AND 
            P.COD_PARTICION = J.COD_PARTICION AND 
            TRUNC(J.DATE_WRITTER) > :y_date AND 
            TRUNC(J.DATE_WRITTER) < :z_date AND 
            J.STRING1 LIKE :carpeta`, 
        { 
            y_date: Y_DATE, 
            z_date: Z_DATE, 
            carpeta: CARPETA 
        }
    )
    .then(result => res.json(result.rows))
})

router.get('/log', (req, res) => {
    executor.query(
        `SELECT 
            U.COD_USUARIO, 
            U.USERNAME AS USUARIO, 
            DV.COD_DISCO, 
            DV.NOMBRE AS DISCO, 
            P.COD_PARTICION, 
            P.NOMBRE AS PARTICION, 
            J.STRING1 AS CARPETA, 
            J.DATE_WRITTER
        FROM 
            USUARIO U, 
            DISCOVIRTUAL DV, 
            DETALLEDISCO DD, 
            PARTICION P, 
            JOURNAL J
        WHERE 
            U.COD_USUARIO = DD.COD_USUARIO AND 
            DD.COD_DISCO = DV.COD_DISCO AND 
            DV.COD_DISCO = P.COD_DISCO AND 
            P.COD_PARTICION = J.COD_PARTICION`, 
        { }
    )
    .then(result => res.json(result.rows))
})

router.post('/carpeta', (req, res) => {
    const { YEAR } = req.body;
    console.log(YEAR);
    executor.query(
        `SELECT 
            U.COD_USUARIO COD_USUARIO, 
            U.FECHA_REGISTRO FECHA_REGISTRO, 
            C.COD_DISCO COD_DISCO,
            P.COD_PARTICION COD_PARTICION,
            P.NOMBRE PARTICION, 
            COUNT(C.COD_CARPETA) CARPETAS
        FROM 
            USUARIO U, 
            DETALLEDISCO DD, 
            DISCOVIRTUAL C, 
            PARTICION P, 
            CARPETA C
        WHERE 
            U.COD_USUARIO = DD.COD_USUARIO AND 
            DD.COD_DISCO = C.COD_DISCO AND
            C.COD_DISCO = P.COD_DISCO AND
            P.COD_PARTICION = C.COD_PARTICION AND 
            TRUNC(U.FECHA_REGISTRO) = :year 
        group by 
            U.COD_USUARIO, U.FECHA_REGISTRO, C.COD_DISCO, P.COD_PARTICION, P.NOMBRE`, 
        { year: YEAR }
    )
    .then(result => res.json(result.rows))
})

module.exports = router;