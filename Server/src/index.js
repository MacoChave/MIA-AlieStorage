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


// STARTING THE SERVER
app.listen(app.get('port'), () => {
    console.log('El servidor está corriendo en el puerto 3000');
});