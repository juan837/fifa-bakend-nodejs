'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = Schema({
    name: String,
    image_flag: String,
    image_shield: String,
    user: { type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Team', TeamSchema);