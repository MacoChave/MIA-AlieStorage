const { Router } = require('express');
const executor = require('../db/exec');
const oracledb = require('oracledb');

const router = new Router();

router.get('/', (req, res) => {
    executor.query(
        `SELECT 
            P.COD_PARTICION COD_PARTICION,
            P.COD_DISCO COD_DISCO, 
            C.COD_CARPETA COD_CARPETA,
            C.COD_PADRE COD_PADRE,
            C.NOMBRE NOMBRE,
            C.PERMISO PERMISO,
            C.NO_BLOQUE NO_BLOQUE,
            c.tipo, 
            c.contenido, 
            C.FECHA_CREACION FECHA_CREACION 
        FROM 
            CARPETA C,  
            PARTICION P 
        WHERE 
            c.cod_particion = p.cod_particion 
        ORDER BY C.TIPO AS`, 
        {}
    )
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.json({
            MESSAGE: err
        })
    })
});


router.post('/root', (req, res) => {
    const { PARTICION } = req.body;
    executor.query(
        `SELECT 
            P.COD_PARTICION COD_PARTICION,
            P.COD_DISCO COD_DISCO, 
            C.COD_CARPETA COD_CARPETA,
            C.COD_PADRE COD_PADRE,
            C.NOMBRE NOMBRE,
            C.PERMISO PERMISO,
            C.NO_BLOQUE NO_BLOQUE,
            c.tipo, 
            c.contenido, 
            C.FECHA_CREACION FECHA_CREACION 
        FROM 
            CARPETA C,  
            PARTICION P 
        WHERE 
            C.COD_PARTICION = P.COD_PARTICION AND 
            P.COD_PARTICION = :cod_particion AND 
            C.COD_PADRE IS NULL`, 
        { cod_particion: PARTICION }
    )
    .then(result => {
        res.json(result.rows)
    })
    .catch(err => {
        res.json({
            MESSAGE: err
        })
    })
});

router.post('/child', (req, res) => {
    const { PARTICION, PADRE } = req.body;
    console.log({ part: PARTICION, padre: PADRE })
    executor.query(
        `SELECT 
            P.COD_PARTICION COD_PARTICION,
            P.COD_DISCO COD_DISCO, 
            C.COD_CARPETA COD_CARPETA,
            C.COD_PADRE COD_PADRE,
            C.NOMBRE NOMBRE,
            C.PERMISO PERMISO,
            C.NO_BLOQUE NO_BLOQUE,
            c.tipo, 
            c.contenido, 
            C.FECHA_CREACION FECHA_CREACION 
        FROM 
            CARPETA C,  
            PARTICION P 
        WHERE 
            C.COD_PARTICION = P.COD_PARTICION AND 
            P.COD_PARTICION = :cod_particion AND 
            C.COD_PADRE = :cod_padre 
        ORDER BY C.TIPO ASC`, 
        {
            cod_particion: PARTICION, 
            cod_padre: PADRE
        }
    )
    .then(result => {
        res.json(result.rows)
    })
    .catch(err => {
        res.json({
            MESSAGE: err
        })
    })
});


router.post('/up', (req, res) => {
    const { PARTICION, COD_CARPETA } = req.body;
    executor.query(
        `SELECT 
            P.COD_PARTICION COD_PARTICION,
            P.COD_DISCO COD_DISCO, 
            C.COD_CARPETA COD_CARPETA,
            C.COD_PADRE COD_PADRE,
            C.NOMBRE NOMBRE,
            C.PERMISO PERMISO,
            C.NO_BLOQUE NO_BLOQUE,
            c.tipo, 
            c.contenido, 
            C.FECHA_CREACION FECHA_CREACION 
        FROM 
            CARPETA C,  
            PARTICION P 
        WHERE 
            C.COD_PARTICION = P.COD_PARTICION AND 
            P.COD_PARTICION = :cod_particion AND 
            C.COD_CARPETA = :cod_carpeta 
        ORDER BY C.TIPO ASC`, 
        {
            cod_particion: PARTICION, 
            cod_carpeta: COD_CARPETA
        }
    )
    .then(result => {
        res.json(result.rows)
    })
    .catch(err => {
        res.json({
            MESSAGE: err
        })
    })
});

module.exports = router;