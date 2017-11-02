'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

var UserSchema = Schema({
    user: String,
    name: String,
    email: String,
    password: String,
    role: String,
    status: String,
    is_active: Boolean,
    image: String
});

module.exports = mongose.model('User', UserSchema);