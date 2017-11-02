'use strict'

var fs = require('fs');
var path = require('path');

var mongoosePagination = require('mongoose-pagination');

var Staff = require('../models/staff');
var User = require('../models/user');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function getStaff(req, res) {
    var staffId = req.params.id;

    Staff.findById(staffId, (err, staff) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion.'});
        } else {
            if(!staff){
                res.status(404).send({message: 'El Cuerpo Técnico no existe'});
            } else{
                res.status(200).send({staff});
            }
        }
    });    
}

function getStaffs(req, res){
    var page = req.params.page || 1 ;

    var itemsPerPage = 3;

    Staff.find().sort('name').paginate(page, itemsPerPage, (err, staffs, total) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion.'});
        }else{
            if(!staffs){
                res.status(404).send({message: 'No hay Cuerpos Técnicos.'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    staffs: staffs
                });
            }
            
        }
    });
}

function saveStaff(req, res){
    var staff = new Staff();

    console.log(req.body);
    var params = req.body;
    staff.name = params.name;
    staff.second_name = params.second_name;
    staff.birthdate = params.birthdate;
    staff.nationality = params.nationality;
    staff.rol = params.rol;
    staff.team = params.teamId;

    staff.save((err, staffStorage) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el Cuerpo Técnico'});
        }else{
            if(!staffStorage){
                res.status(404).send({message: 'El Cuerpo Técnico no ha sido guardado'});
            } else {
                res.status(200).send({staff: staffStorage});
            }
        }
    });

}

function updateStaff(req, res){
    var staffId = req.params.id;
    var update = req.body;

    Staff.findByIdAndUpdate(staffId, update, (err, staffUpdate) => {
        if(err){
            res.status(500).send({message: "Error al actualizar el Cuerpo Técnico."});
        } else {
            if(!staffUpdate){
                res.status(404).send({message: "No se ha podio actualizar el Cuerpo Técnico"});
            } else {
                res.status(200).send({staff: staffUpdate});
            }
        }
    });
}

function deleteStaff(req, res){
    var staffId = req.params.id;
    
    Staff.findByIdAndRemove(staffId, (err, staffRemoved) => {
        if(err){
            res.status(500).send({message: "Error al Eliminar el Cuerpo Técnico."});
        } else {
            if(!staffRemoved){
                res.status(404).send({message: "El Cuerpo Técnico no ha sido eliminado."});
            } else {
                res.status(200).send({staff: staffRemoved});
            }
        }
    })
}

module.exports = {
    getStaff,
    saveStaff,
    getStaffs,
    updateStaff,
    deleteStaff
}