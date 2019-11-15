const { Router } = require('express');
const oracledb = require('oracledb');
const executor = require('../db/exec');

const router = new Router();

router.get('/', (req, res) => {
    executor.query(
        `SELECT
            COD_USUARIO,
            COD_DISCO,
            NOMBRE,
            SIZE_DISCO, 
            UNIT
        FROM view_disco`, 
        {}
    )
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json({
            message: 'Problemas buscando los discos'
        })
    })
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    executor.query(
        `SELECT
            COD_USUARIO,
            COD_DISCO,
            NOMBRE,
            SIZE_DISCO, 
            UNIT
        FROM view_disco
        WHERE 
            COD_USUARIO = :cod_usuario`, 
        { cod_usuario: id }
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        res.json({
            message: 'Problemas buscando los discos'
        })
    })
});

module.exports = router;