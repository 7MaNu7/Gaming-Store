//API REST
var express = require('express');
var bodyParser = require('body-parser');


var juego = require('./routes/juego');
var consola = require('./routes/consola');
var index = require('./routes/index');
var user = require('./routes/usuario');
var login = require('./routes/login');
var models = require('./models');

var app = express();

var cors = require('cors');
app.use(cors());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use('/api/juegos', juego);
app.use('/api/consolas', consola);
app.use('/api/usuarios', user);
app.use('/api/login', login);
app.use('/', index);

//Ante cualquier error, generamos un status 500
//y en el cuerpo de la respuesta mandamos info sobre el error en JSON

app.use(function(err, req, res, next) {
    res.status(500);
    res.send({
        mensaje: err.message,
        error: err
    });
});

module.exports = app;