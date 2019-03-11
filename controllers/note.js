// notes controller

const db = require("../models");

module.exports = {
    //find all notes by ID
    findAll: function (req, res) {
        db.Note
        .find({ article: req.params.id })
        .then(dbNote => {
            res.json(dbNote);
        })
        .catch(err => {res.json(err)} )
    },
    //delete note by ID
    delete: function(req, res){
        db.Note
        .remove( {_id: req.params.id })
        .then (dbNote => {
            res.json(dbNote);
        })
        .catch(err => {res.json(err)} )
    }
};