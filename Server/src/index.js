const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// SETTINGS
app.set('port', 3000);
app.set('json spaces', 2);

// MIDDLEWARE
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// ROUTES
app.use(require('../routes/index'));
app.use('/api/info', require('../routes/info'));
app.use('/api/usuario', require('../routes/usuario'));
app.use('/api/disco', require('../routes/disco'));
app.use('/api/particion', require('../routes/particion'));
app.use('/api/journal', require('../routes/journal'));
app.use('/api/carpeta', require('../routes/carpeta'));
app.use('/api/archivo', require('../routes/archivo'));
app.use('/api/detalledisco', require('../routes/detalledisco'));
app.use('/api/chat', require('../routes/chat'));
app.use('/api/detallechat', require('../routes/detallechat'));


// STARTING THE SERVER
app.listen(app.get('port'), () => {
    console.log('El servidor está corriendo en el puerto 3000');
});