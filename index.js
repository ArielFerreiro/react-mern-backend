const express = require('express');
var cors = require('cors')
const { dbConnection } = require('./database/config');
require('dotenv').config();

//console.log( process.env );

// Express Server
const app = express();
app.use(cors());

// Base de Datos
dbConnection();

// Routes

//Public Route
app.use( express.static('public'));

// Lectura y Parse de los bodies
app.use( express.json() );

// AUTH: create, login, renew
app.use('/api/auth', require('./routes/auth'));

// CRUD: eventos
app.use('/api/events', require('./routes/events'));


// Listening Requests
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`);
});

