'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StaffSchema = Schema({
    name: String,
    second_name: String,
    birthdate: Date,
    nationality: String,
    rol: String,
    team: { type: Schema.ObjectId, ref: 'Team'}
});

module.exports = mongoose.model('Staff', StaffSchema);