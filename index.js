const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');


// Crear el servidor de express
const app = express();

// Base de Datos
dbConnection();

// CORS
app.use(cors());

// Directorio Público
app.use( express.static('public') );

// Lectura y parseo del body
// Las peticiones que vengan en formato JSON las procesamos y
// extraemos su contenido
app.use( express.json() );




// Rutas
// Autenticación
app.use('/api/auth', require('./routes/auth') );

// CRUD eventos
app.use('/api/events', require('./routes/events') );



// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
});