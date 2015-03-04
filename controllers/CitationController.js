var model_citation = require('../models/citation.js');
var model_personne = require('../models/personne.js');
var model_etudiant = require('../models/etudiant.js');
var model_mot = require('../models/mot.js');
var home_controller = require('./HomeController.js');
var async = require("async");

var view_root = "citation/";

// ////////////////////////////////////////////// L I S T E R     C I T A T I O N

module.exports.citations = 	function(request, response){
	response.title = 'Liste des citations';

	model_citation.getCitations( function (err, result) {
		if (err) {
			console.log(err);
			return;
		}

        response.citations = result;
        response.nbCitation = result.length;

        if (!request.session.num || !request.session.login) {
            response.render(view_root + 'citations', response);
        } else {
            model_etudiant.getEtudiant(request.session.num, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (result.length != 0) {
                    response.is_etudiant = true;
                }
                response.render(view_root + 'citations', response);
            });
        }
	});
	} ;


// ////////////////////////////////////////////// A J O U T E R     C I T A T I O N

module.exports.ajouter = 	function(request, response){
	if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
		home_controller.Index(request, response);
		return;
	}

    model_etudiant.getEtudiant(request.session.num, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        if (result.length == 0) {
            response.message = "Seul les étudiants peuvent ajouter des blagues.";
            home_controller.Index(request, response);
            return;
        }

    	if (request.method == "POST") {
    		data = request.body;
    		data["per_num_etu"] = request.session.num;
    		model_citation.addCitation(data, function (err, result) {
    			if (err) {
    				console.log(err);
    				return;
    			};

    			response.title = "La citation a été ajoutée";
    			response.cit_date = request.body.cit_date;
    			response.cit_libelle = request.body.cit_libelle;

    			model_personne.getDetailPersonne(request.body.per_num, function (err, result) {
    				if (err) {
    					console.log(err);
    					return;
    				};
    				response.personne = result[0];
    				response.render(view_root + 'ajouter', response);
    			});
    		});

    	} else {
    		response.title = 'Ajouter des citations';

    		model_personne.getListePersonne( function (err, result) {
    			if (err) {
    				console.log(err);
    				return;
    			};
    			response.personnes = result;

                model_mot.getMotsInterdits(function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    response.mots = [];
                    for (var i = 0; i < result.length; i++)
                        response.mots.push(result[i]["mot_interdit"]);

                    response.render(view_root + 'ajouter', response);
                });
    		});
    	}
    });
	} ;


// ////////////////////////////////////////////// M O D I F I E R     C I T A T I O N

module.exports.citation = function(request, response){
    if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
        home_controller.Index(request, response);
        return;
    }

    model_etudiant.getEtudiant(request.session.num, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        if (result.length == 0) {
            response.message = "Seul les étudiants peuvent modifier des blagues.";
            home_controller.Index(request, response);
            return;
        }

        if (request.method == "POST") {
            data = request.body;
            data['cit_num'] = request.params.num;
            model_citation.setCitation(data, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                };
            });
        }

        model_citation.getCitation(request.params.num, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            response.title = 'Citation numéro ' + result[0].cit_num;
            response.citation = result[0];

    		model_personne.getDetailPersonne(result[0].per_num, function (err, result) {
    			if (err) {
    				console.log(err);
    				return;
    			};
    			response.personne = result[0];

    	        model_personne.getListePersonne( function (err, result) {
    				if (err) {
    					console.log(err);
    					return;
    				};
    				response.personnes = result;
    	        	response.render(view_root + 'citation', response);
    			});
    		});
        });
    });
};



// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N

module.exports.rechercher = function(request, response){
	response.title = 'Rechercher des citations';

	if (request.body.enseignant){
		// Recherche des citations
		async.parallel([
				function(callback){
					// Effectuer la recherche
					model_citation.rechercherCitations(request.body, function (err, result) {
						if (err) {
								// gestion de l'erreur
								console.log(err);
								return;
						}
						response.listeCitations = result;
						callback();
					});
				}
			],
			function(){
				// Fin des requetes
				response.render(view_root+'rechercher', response);
			}

		);
	} else {
		// Affichage du formulaire
		async.parallel([
				function(callback){
					// Récupérer la liste des enseignants cités
					model_citation.getAllEnseignantsCites( function (err, result) {
						if (err) {
								// gestion de l'erreur
								console.log(err);
								return;
						}
						response.enseignants = result;
						callback();
					});
				},function(callback){
					model_citation.getAllDatesCitations( function (err, result) {
						if (err) {
								// gestion de l'erreur
								console.log(err);
								return;
						}
						response.dates = result;
						callback();
					});
				},function(callback){
					model_citation.getAllMoyennesCitations( function (err, result) {
						if (err) {
								// gestion de l'erreur
								console.log(err);
								return;
						}
						response.moyennes = result;
						callback();
					});
				}
			],
			function(){
				// Fin des requetes
				response.render(view_root+'rechercher', response);
			}

		);
	}
} ;

