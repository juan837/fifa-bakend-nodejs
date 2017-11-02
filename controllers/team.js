'use strict'

var fs = require('fs');
var path = require('path');

var mongoosePagination = require('mongoose-pagination');

var Team = require('../models/team');
var Player = require('../models/player');
var Staff = require('../models/staff');
var User = require('../models/user');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function getTeam(req, res) {
    var teamId = req.params.id;

    Team.findById(teamId, (err, team) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion.'});
        } else {
            if(!team){
                res.status(404).send({message: 'El equipo no existe'});
            } else{
                res.status(200).send({team});
            }
        }
    });    
}

function getTeams(req, res){
    var page = req.params.page || 1 ;

    var itemsPerPage = 3;

    Team.find().sort('name').paginate(page, itemsPerPage, (err, teams, total) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion.'});
        }else{
            if(!teams){
                res.status(404).send({message: 'No hay equipos.'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    teams: teams
                });
            }
            
        }
    });
}

function saveTeam(req, res){
    var team = new Team();

    var params = req.body;
    team.name = params.name;
    team.image_flag = 'null';
    team.image_shield = 'null';
    team.user = req.user.sub;

    team.save((err, teamStorage) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el equipo'});
        }else{
            if(!teamStorage){
                res.status(404).send({message: 'El equipo no ha sido guardado'});
            } else {
                res.status(200).send({team: teamStorage});
            }
        }
    });

}

function updateTeam(req, res){
    var teamId = req.params.id;
    var update = req.body;

    Team.findByIdAndUpdate(teamId, update, (err, teamUpdate) => {
        if(err){
            res.status(500).send({message: "Error al actualizar el equipo."});
        } else {
            if(!teamUpdate){
                res.status(404).send({message: "No se ha podio actualizar el equipo"});
            } else {
                res.status(200).send({team: teamUpdate});
            }
        }
    });
}

function deleteTeam(req, res){
    var teamId = req.params.id;
    
    Team.findByIdAndRemove(teamId, (err, teamRemoved) => {
        if(err){
            res.status(500).send({message: "Error al Eliminar el Equipo."});
        } else {
            if(!teamRemoved){
                res.status(404).send({message: "El equipo no ha sido eliminado."});
            } else {
                Player.find({team: teamRemoved._id}).remove((err, playerRemoved) => {
                    if(err){
                        res.status(500).send({message: "Error al Eliminar el Jugador."});
                    } else {
                        if(!playerRemoved){
                            res.status(404).send({message: "El Jugador no ha sido eliminado."});
                        } else {
                            Sta.find({team: teamRemoved._id}).remove((err, staffRemoved) => {
                                if(err){
                                    res.status(500).send({message: "Error al Eliminar el Cuerpo Técnico."});
                                } else {
                                    if(!staffRemoved){
                                        res.status(404).send({message: "El Cuerpo Técnico no ha sido eliminado."});
                                    } else {
                                        res.status(200).send({team: teamRemoved});
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

function uploadImageFlag(req, res){
    console.log('Iniciando carga de bandera');

    var teamId = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[3];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(file_ext);
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            Team.findByIdAndUpdate(teamId,{image_flag: file_name}, (err, teamUpdate) => {
                if(!teamUpdate){
                    res.status(404).send({message: 'No se ha podido actualizar el equipo...'});
                } else {
                    res.status(200).send({team: teamUpdate});
                }
            })
        } else {
            res.status(404).send({message: 'No ha subido ninguna image...'});
        }
    }
}

function getImageFileFlag(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/team/flags/' + imageFile;

    fs.exists(path_file, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No existe la imagen...'})
        }
    })
}

function uploadImageShield(req, res){
    var teamId = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            Team.findByIdAndUpdate(teamId,{image_shield: file_name}, (err, teamUpdate) => {
                if(!teamUpdate){
                    res.status(404).send({message: 'No se ha podido actualizar el equipo...'});
                } else {
                    res.status(200).send({team: teamUpdate});
                }
            })
        } else {
            res.status(404).send({message: 'No ha subido ninguna image...'});
        }
    }
}

function getImageFileShield(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/teams/shields/' + imageFile;

    fs.exists(path_file, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No existe la imagen...'})
        }
    })
}

module.exports = {
    getTeam,
    saveTeam,
    getTeams,
    updateTeam,
    deleteTeam,
    uploadImageFlag,
    getImageFileFlag,
    uploadImageShield,
    getImageFileShield
}