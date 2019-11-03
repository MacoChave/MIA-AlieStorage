const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
    const data = {
        "module": "Usuario",
        "author": "2010 20831"
    };
    res.json(data);
});

module.exports = router;