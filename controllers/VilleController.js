var model_ville = require('../models/ville.js');
var model_personne = require('../models/personne.js');
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

        if (request.session.num) {
            is_admin(request.session.num, function (is_admin) {
                response.is_admin = is_admin;
                response.render(view_root + 'ville', response);
            });
        } else {
            response.render(view_root + 'ville', response);
        }
    });
};


   // ////////////////////////////////////////////// S U P P R I M E R     V I L L E

module.exports.supprimer = function(request, response){
    var message = "Seuls les admins peuvent supprimer des villes."
    verif_connected_as_admin(request, response, message, function () {
        model_ville.getVille(request.params.num, function (err, result) {
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
                    response.title = "Impossible de supprimer la ville, un département est associé à celle-ci";
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
    });
};



verif_connected_as_admin = function(request, response, message, callback) {
    if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
        home_controller.Index(request, response);
        return;
    }

    is_admin(request.session.num, function (is_admin) {
        console.log(is_admin);

        if (!is_admin) {
            response.message = message;
            home_controller.Index(request, response);
            return;
        }
        callback();
    });
};

is_admin = function(per_num, callback) {
    model_personne.getDetailPersonne(per_num, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        var is_admin = false;
        if (result.length > 0 && result[0].per_admin) {
            is_admin = true;
        }

        callback(is_admin);
    });
};