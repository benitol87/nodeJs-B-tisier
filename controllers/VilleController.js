var model_ville = require('../models/ville.js');
var home_controller = require('./HomeController.js');
var view_root = "villes/";

   // ////////////////////////////////////////////// L I S T E R     V I L L E S

module.exports.ListerVille = function(request, response){
    response.title = 'Liste des villes';

    model_ville.getListeVille( function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeVille = result;
        response.nbVille = result.length;
        response.render(view_root + 'lister', response);
    });
};

   // ////////////////////////////////////////////// A J O U T E R     V I L L E

module.exports.AjouterVille = function(request, response){
    if (!request.session.num || !request.session.login) {
        console.log("vous n'êtes pas connecté");
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
            response.render(view_root + 'ajouter', response);
        });

    } else {
       response.title = 'Ajouter des villes';
       response.render(view_root + 'ajouter', response);
    }
};

   // ////////////////////////////////////////////// M O D I F I E R     V I L L E

module.exports.ModifierVille = function(request, response){
    if (!request.session.num || !request.session.login) {
        console.log("vous n'êtes pas connecté");
        home_controller.Index(request, response);
        return;
    }

   response.title = 'Modifier une ville';
   response.render(view_root + 'modifier', response);
};

