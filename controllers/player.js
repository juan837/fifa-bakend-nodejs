'use strict'

var fs = require('fs');
var path = require('path');

var mongoosePagination = require('mongoose-pagination');

var Player = require('../models/player');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function getPlayer(req, res) {
    var playerId = req.params.id;

    Player.findById(playerId, (err, player) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion.'});
        } else {
            if(!player){
                res.status(404).send({message: 'El Jugador no existe'});
            } else{
                res.status(200).send({player});
            }
        }
    });    
}

function getPlayers(req, res){
    var teamId = req.params.team;
    var page = req.params.page || 1 ;

    console.log('Team ID ', teamId);
    var itemsPerPage = 3;

    Player.find({team: teamId}).sort('name').paginate(page, itemsPerPage, (err, players, total) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion.'});
        }else{
            if(!players){
                res.status(404).send({message: 'No hay Jugadores.'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    players: players
                });
            }
            
        }
    });
}

function savePLayer(req, res){
    var player = new Player();

    var params = req.body;
    player.name = params.name;
    player.second_name = params.second_name;
    player.birthdate = params.birthdate;
    player.position = params.position;
    player.jersey = params.jersey;
    player.holder = params.holder;
    player.image = 'null';
    player.team = params.teamId;

    player.save((err, playerStorage) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el Jugador'});
        }else{
            if(!playerStorage){
                res.status(404).send({message: 'El Jugador no ha sido guardado'});
            } else {
                res.status(200).send({player: playerStorage});
            }
        }
    });

}

function updatePlayer(req, res){
    var playerId = req.params.id;
    var update = req.body;

    Player.findByIdAndUpdate(playerId, update, (err, playerUpdate) => {
        if(err){
            res.status(500).send({message: "Error al actualizar el Jugador."});
        } else {
            if(!playerUpdate){
                res.status(404).send({message: "No se ha podio actualizar el Jugador"});
            } else {
                res.status(200).send({player: playerUpdate});
            }
        }
    });
}

function deletePlayer(req, res){
    var playerId = req.params.id;
    
    Player.findByIdAndRemove(playerId, (err, playerRemoved) => {
        if(err){
            res.status(500).send({message: "Error al Eliminar el Jugador."});
        } else {
            if(!playerRemoved){
                res.status(404).send({message: "El Jugador no ha sido eliminado."});
            } else {
                res.status(200).send({player: playerRemoved});
            }
        }
    })
}

function uploadImage(req, res){

    var playerId = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[3];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(file_ext);
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            Player.findByIdAndUpdate(playerId, {image: file_name}, (err, playerUpdate) => {
                if(!playerUpdate){
                    res.status(404).send({message: 'No se ha podido actualizar el Jugador...'});
                } else {
                    res.status(200).send({team: playerUpdate});
                }
            })
        } else {
            res.status(404).send({message: 'No ha subido ninguna image...'});
        }
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/teams/players/' + imageFile;

    fs.exists(path_file, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No existe la imagen...'})
        }
    })
}

module.exports = {
    getPlayer,
    savePLayer,
    getPlayers,
    updatePlayer,
    deletePlayer,
    uploadImage,
    getImageFile
}