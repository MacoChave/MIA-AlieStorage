const { Router } = require('express');

const router = new Router();
const oracledb = require('oracledb');
const executor = require('../db/exec');

router.get('/', (req, res) => {
    const data = {
        "module": "Particion",
        "author": "2010 20831"
    };
    res.json(data);
});

router.get('/:disco', (req, res) => {
    const disco = req.params.disco;
    executor.query(
        `SELECT 
            P.COD_PARTICION, 
            P.COD_DISCO, 
            P.NOMBRE, 
            P.SIZE_PARTICION, 
            P.UNIT
        FROM 
            PARTICION P
        WHERE 
            P.COD_DISCO = :disco`, 
        { disco: disco }
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        res.json([{}])
    })
})

module.exports = router;