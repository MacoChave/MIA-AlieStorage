const { Router } = require('express');
const oracledb = require('oracledb');
const path = require('path')
const multer = require('multer');
const executor = require('../db/exec');
const fs = require('fs');

const router = new Router();
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './res/info')
    },
    filename: (req, file, cb) => {
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        cb(null, file.fieldname + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/**
 * GET INFO
 */
router.get('/', (req, res) => {
    executor.query(
        `SELECT * 
        FROM INFO 
        LAST`, 
        []
    )
    .then((result) => {
        res.json(result.rows);
    });
})

/**
 * UPDATE INFO
 */
router.put('/', (req, res) => {
    const { NOMBRE, ESLOGAN, MISION, VISION, ABOUT } = req.body;

    executor.query(
        `UPDATE INFO SET
        NOMBRE = :NOMBRE, 
        ESLOGAN = :ESLOGAN, 
        MISION = :MISION, 
        VISION = :VISION, 
        ABOUT = :ABOUT`, 
        [NOMBRE, ESLOGAN, MISION, VISION, ABOUT]
    )
    .then(result => {
        res.json(result.rows);
    });
})

/**
 * UPDATE VIDEO
 */
router.put('/video', upload.single('file'), (req, res) => {
    const VIDEO = `/info/${req.file.fieldname}`;
    console.log(VIDEO);

    executor.query(
        `UPDATE INFO SET
        VIDEO = :VIDEO`, 
        [VIDEO]
    )
    .then(result => {
        res.json(result.rows);
    });
})

router.get('/video', (req, res) => {
    res.writeHead(200, {'Content-Type': 'video/mp4'});
    var rs = fs.createReadStream('./res/info/file.mp4');
    rs.pipe(res);
})

router.get('/logo', (req, res) => {
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    var rs = fs.createReadStream('./res/info/Logo.svg');
    rs.pipe(res);
})

router.get('/logo/1tint_blue', (req, res) => {
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    var rs = fs.createReadStream('./res/info/Logo_1TintaAzul.svg');
    rs.pipe(res);
})

router.get('/logo/1tint_red', (req, res) => {
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    var rs = fs.createReadStream('./res/info/Logo_1TintaRojo.svg');
    rs.pipe(res);
})

router.get('/logo/black', (req, res) => {
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    var rs = fs.createReadStream('./res/info/Logo_FondoWhite.svg');
    rs.pipe(res);
})

router.get('/logo/white', (req, res) => {
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    var rs = fs.createReadStream('./res/info/Logo_FondoNegro.svg');
    rs.pipe(res);
})
module.exports = router;