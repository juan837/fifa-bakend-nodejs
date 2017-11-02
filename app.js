'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// load routes
var user_routes = require('./routes/user');
var team_routes = require('./routes/team');
var staff_routes = require('./routes/staff');
var player_routes = require('./routes/player');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// config http headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
})

// base route
app.get('/prueba', (req, res) => {
    res.status(200).send({message: 'Welcome'});
});

// Base Route
app.use('/api', user_routes);
app.use('/api', team_routes);
app.use('/api', staff_routes);
app.use('/api', player_routes);

module.exports = app;