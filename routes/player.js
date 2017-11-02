'use strict'

var express = require('express');
var PlayerController = require('../controllers/player');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/teams/players'});

api.get('/player/:id', md_auth.ensureAuth, PlayerController.getPlayer);
api.get('/players/:team/:page?', md_auth.ensureAuth, PlayerController.getPlayers);
api.post('/player', md_auth.ensureAuth, PlayerController.savePLayer);
api.put('/player/:id', md_auth.ensureAuth, PlayerController.updatePlayer);
api.delete('/player/:id', md_auth.ensureAuth, PlayerController.deletePlayer);
api.post('/upload-image-player/:id', [md_auth.ensureAuth, md_upload], PlayerController.uploadImage);
api.get('/get-image-player/:imageFile', PlayerController.getImageFile);

module.exports = api;