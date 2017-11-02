'use strict'

var express = require('express');
var StaffController = require('../controllers/staff');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');

api.get('/staff/:id', md_auth.ensureAuth, StaffController.getStaff);
api.get('/staffs/:page?', md_auth.ensureAuth, StaffController.getStaffs);
api.post('/staff', md_auth.ensureAuth, StaffController.saveStaff);
api.put('/staff/:id', md_auth.ensureAuth, StaffController.updateStaff);
api.delete('/staff/:id', md_auth.ensureAuth, StaffController.deleteStaff);

module.exports = api;