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

router.post('/folder', (req, res) => {
    const { COD_PARTICION, COD_PADRE, NOMBRE, PERMISO, NO_BLOQUE } = req.body;

    executor.sp(
        `BEGIN 
            SP_NEWFOLDER2(
                :cod_carpeta, 
                :cod_particion, 
                :inodo_padre, 
                :nombre, 
                :permiso, 
                :no_inodo
            );
        END;`, 
        {
            cod_carpeta: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }, 
            cod_particion: COD_PARTICION, 
            cod_padre: COD_PADRE, 
            nombre: NOMBRE, 
            permiso: PERMISO, 
            no_inodo: NO_BLOQUE
        }
    )
    .then(result => {
        res.json({
            MESSAGE: 'Transaction complete', 
            ROWS_AFFECTED: result.outBinds.cod_carpeta
        })
    })
    .catch(err => {
        res.json({
            MESSAGE: err, 
            ROWS_AFFECTED: -3
        })
    })
})

router.post('/file', (req, res) => {
    const { COD_PARTICION, COD_PADRE, NOMBRE, PERMISO, NO_BLOQUE, CONTENIDO } = req.body;

    executor.sp(
        `BEGIN 
            SP_NEWFILE2(
                :cod_carpeta, 
                :cod_particion, 
                :inodo_padre, 
                :nombre, 
                :contenido, 
                :permiso, 
                :no_inodo
            );
        END;`, 
        {
            cod_carpeta: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }, 
            cod_particion: COD_PARTICION, 
            cod_padre: COD_PADRE, 
            nombre: NOMBRE, 
            contenido: CONTENIDO, 
            permiso: PERMISO, 
            no_inodo: NO_BLOQUE
        }
    )
    .then(result => {
        res.json({
            MESSAGE: 'Transaction complete', 
            ROWS_AFFECTED: result.outBinds.cod_carpeta
        })
    })
    .catch(err => {
        res.json({
            MESSAGE: err, 
            ROWS_AFFECTED: -3
        })
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    executor.query(
        `SET SERVEROUTPUT ON;
        BEGIN
            SP_DELETEFOLDER(:codigo)
        END`, 
        { codigo: id }
    )
    .then(result => {
        res.json({
            MESSAGE: 'Transaccion completa', 
            ROWS_AFFECTED: result.resultSet
        })
    })
    .catch(err => {
        res.json({
            MESSAGE: err, 
            ROWS_AFFECTED: -3
        })
    })
})

router.put('/nombre', (req, res) => {
    const { COD_CARPETA, NOMBRE } = req.body;

    executor.sp(
        `SET SERVEROUTPUT ON; 
        BEGIN 
            SP_UPDATENAMEFOLDER(
                :codigo, :nombre
            )
        END;`, 
        {
            codigo: COD_CARPETA, 
            nombre: NOMBRE
        }
    )
    .then(result => {
        res.json({
            MESSAGE: 'Transaccion finalizada', 
            ROWS_AFFECTED: result.resultSet
        })
    })
    .catch(err => {
        res.json({
            MESSAGE: err, 
            ROWS_AFFECTED: -3
        })
    })
})

router.put('/contenido', (req, res) => {
    const { COD_CARPETA, CONTENIDO } = req.body;

    executor.sp(
        `SET SERVEROUTPUT ON; 
        BEGIN 
            SP_UPDATECONTENTFILE(
                :codigo, :contenido
            )
        END;`, 
        {
            codigo: COD_CARPETA, 
            contenido: CONTENIDO
        }
    )
    .then(result => {
        res.json({
            MESSAGE: 'Transaccion finalizada', 
            ROWS_AFFECTED: result.resultSet
        })
    })
    .catch(err => {
        res.json({
            MESSAGE: err, 
            ROWS_AFFECTED: -3
        })
    })
})

module.exports = router;