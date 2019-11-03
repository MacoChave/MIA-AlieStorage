const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
    const data = {
        "module": "API Alie-Storage",
        "author": "2010 20831", 
        "endpoint": "/api"
    };
    res.json(data);
});

module.exports = router;