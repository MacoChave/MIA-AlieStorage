const { Router } = require('express');
const oracledb = require('oracledb');
const path = require('path');
const multer = require('multer');
const executor = require('../db/exec');
const fs = require('fs');

const router = new Router();


let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './res/sync')
    }, 
    filename: (req, file, callback) => {
        callback(null, req.params.filename + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', (req, res) => {
    console.log(req.body);
    res.json({
        MESSAGE: 'JSON file was received'
    });
})

module.exports = router;