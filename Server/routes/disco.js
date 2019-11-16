const { Router } = require('express');
const oracledb = require('oracledb');
const executor = require('../db/exec');

const router = new Router();

router.get('/', (req, res) => {
    executor.query(
        `SELECT 
            DD.COD_USUARIO,
            HD.COD_DISCO,
            HD.NOMBRE,
            HD.SIZE_DISCO, 
            HD.UNIT
        FROM 
            detalledisco DD, 
            discovirtual HD, 
            usuario U 
        WHERE 
            dd.cod_usuario = u.cod_usuario AND 
            dd.cod_disco = hd.cod_disco`, 
        {}
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        res.json([{}])
    })
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    executor.query(
        `SELECT 
            DD.COD_USUARIO,
            HD.COD_DISCO,
            HD.NOMBRE,
            HD.SIZE_DISCO, 
            HD.UNIT
        FROM 
            detalledisco DD, 
            discovirtual HD, 
            usuario U 
        WHERE 
            dd.cod_usuario = u.cod_usuario AND 
            dd.cod_disco = hd.cod_disco AND
            u.cod_usuario = :cod_usuario`, 
        { cod_usuario: id }
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        res.json([{}])
    })
});

module.exports = router;