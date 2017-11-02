'use strict'

var express = require('express');
var TeamController = require('../controllers/team');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload_flag = multipart({ uploadDir: './uploads/teams/flags'});
var md_upload_shield = multipart({ uploadDir: './uploads/teams/shields'});

api.get('/team/:id', md_auth.ensureAuth, TeamController.getTeam);
api.get('/teams/:page?', md_auth.ensureAuth, TeamController.getTeams);
api.post('/team', md_auth.ensureAuth, TeamController.saveTeam);
api.put('/team/:id', md_auth.ensureAuth, TeamController.updateTeam);
api.delete('/team/:id', md_auth.ensureAuth, TeamController.deleteTeam);
api.post('/upload-image-team-flag/:id', [md_auth.ensureAuth, md_upload_flag], TeamController.uploadImageFlag);
api.get('/get-image-team-flag/:imageFile', TeamController.getImageFileFlag);
api.post('/upload-image-team-shield/:id', [md_auth.ensureAuth, md_upload_shield], TeamController.uploadImageShield);
api.get('/get-image-team-shield/:imageFile', TeamController.getImageFileShield);

module.exports = api;