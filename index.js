'use strict'

var mongoose = require('mongoose');
var app = require('./app.js');
var port = process.env.PORT || 9000;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/refifa', (err, res) => {
    if(err){
        throw err;
    } else {
        console.log("database conection is OK");
        app.listen(port, function(){
            console.log('app refifa online');
        });
    }
});
