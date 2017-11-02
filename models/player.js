'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = Schema({
    name: String,
    second_name: String,
    birthdate: Date,
    position: Number,
    jersey: Number,
    holder: Boolean,
    image: String,
    team: { type: Schema.ObjectId, ref: 'Team'}
});

module.exports = mongoose.model('Player', PlayerSchema);