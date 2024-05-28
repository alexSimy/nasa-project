const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

// allow front-end to interact with our server
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('short'));

app.use(express.json());

// rudimentary logging
/*
app.use((req, res, next) => {
    console.log(`${req.method} ${req.baseUrl}${req.url}`);
    next();
});
*/

app.use(express.static(path.join(__dirname, '..','public')));

app.use('/v1', api);


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public', 'index.html'));
})

module.exports = app;