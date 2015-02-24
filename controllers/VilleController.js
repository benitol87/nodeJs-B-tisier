var model_ville = require('../models/ville.js');
var model_departement = require('../models/departement.js');
var home_controller = require('./HomeController.js');
var view_root = "ville/";

   // ////////////////////////////////////////////// L I S T E R     V I L L E S

module.exports.villes = function(request, response){
    response.title = 'Liste des villes';

    model_ville.getVilles( function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeVille = result;
        response.nbVille = result.length;
        response.render(view_root + 'villes', response);
    });
};

   // ////////////////////////////////////////////// A J O U T E R     V I L L E

module.exports.ajouter = function(request, response){
    if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
        home_controller.Index(request, response);
        return;
    }

    if (request.method == "POST") {
        model_ville.addVille(request.body, function (err, result) {
            if (err) {
                console.log(err);
                return;
            };

            response.title = "La ville a bien été ajoutée";
            response.nomVille = request.body.vil_nom;
            response.render(view_root + 'ajouter', response);
        });

    } else {
       response.title = 'Ajouter des villes';
       response.render(view_root + 'ajouter', response);
    }
};

   // ////////////////////////////////////////////// M O D I F I E R     V I L L E

module.exports.ville = function(request, response){
    if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
        home_controller.Index(request, response);
        return;
    }

    if (request.method == "POST") {
        model_ville.setVille(request.body, function (err, result) {
            if (err) {
                console.log(err);
                return;
            };
        });
    }

    var num = request.params.num;
    model_ville.getVille(num, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.title = 'Ville de ' + result[0].vil_nom;
        response.ville = result[0];
        response.render(view_root + 'ville', response);
    });
};


module.exports.supprimer = function(request, response){
    if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
        home_controller.Index(request, response);
        return;
    }

    var num = request.params.num;
    model_ville.getVille(num, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        var ville = result[0];
        response.ville = ville;
        model_departement.getDepartementByVille(ville, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            if (result.length != 0) {
                response.title = "Erreur : impossible de supprimer la ville";
                response.supprimer = false;
                response.render(view_root + 'supprimer', response);
                return;
            }
        });

        model_ville.deleteVille(ville, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.supprimer = true;
            response.render(view_root + 'supprimer', response);
        });
    });
};