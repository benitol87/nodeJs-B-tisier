var model_citation = require('../models/citation.js');
var model_personne = require('../models/personne.js');
var model_etudiant = require('../models/etudiant.js');
var model_vote = require('../models/vote.js');
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
            model_personne.getDetailPersonne(request.session.num, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (result.length != 0) {
                    response.personne = result[0];
                    if (response.personne != 0) {
                        response.is_authorized = true;
                    }
                }
                model_etudiant.getEtudiant(request.session.num, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    if (result.length != 0) {
                        response.is_authorized = true;
                    }
                    response.render(view_root + 'citations', response);
                });
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


// ////////////////////////////////////////////// G E R E R     C I T A T I O N

module.exports.gestion = function(request, response) {
    if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
        home_controller.Index(request, response);
        return;
    }

    model_personne.getDetailPersonne(request.session.num, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        if (result.length == 0) {
            response.message = "Seuls les administrateurs peuvent accéder à la gestion des citations.";
            home_controller.Index(request, response);
            return;
        }

        model_citation.getCitations(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.citations = result;
            response.nbCitation = result.length;
            model_citation.getCitationsInvalides(function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }

                response.citations_invalides = result;
                response.nbCitation_invalides = result.length;
                response.render(view_root + 'gestion', response);
            });
        });
    });
};


// ////////////////////////////////////////////// M O D I F I E R     C I T A T I O N

module.exports.citation = function(request, response){
    if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
        home_controller.Index(request, response);
        return;
    }

    is_admin(request.session.num, function (is_admin) {
        response.is_admin = is_admin;

        model_etudiant.getEtudiant(request.session.num, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            if (!response.is_admin && result.length == 0) {
                response.message = "Seul les étudiants et administrateurs peuvent modifier des blagues.";
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

// ////////////////////////////////////////////// N O T E R     C I T A T I O N

module.exports.noter = function(request, response) {
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
            response.message = "Seul les étudiants peuvent noter des blagues.";
            home_controller.Index(request, response);
            return;
        }

        if (request.method == 'POST') {
            if (request.body.length != 0) {
                var data = request.body;
                data['per_num'] = request.session.num;
                data['cit_num'] = request.params.num;

                model_vote.addVote(data, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    response.redirect('/citation/' + request.params.num);
                });
            } else {
                response.message = "Erreur lors de l'ajout d'un vote : la valeur du vote n'est pas définie.";
                home_controller.Index(request, response);
                return;
            }
        } else {
            response.message = "Erreur lors de l'ajout d'un vote : aucun vote n'a été posté.";
            home_controller.Index(request, response);
            return;
        }
    });
};


// ////////////////////////////////////////////// V A L I D E R     C I T A T I O N

module.exports.valider = function(request, response) {
    var message = "Seuls les admins peuvent valider des citations."
    verif_connected_as_admin(request, response, message, function () {
        model_citation.validateCitation(request.params.num, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.message = "La citation " + request.params.num + " a été validée.";
            home_controller.Index(request, response);
        });
    });
};


// ////////////////////////////////////////////// S U P P R I M E R     C I T A T I O N

module.exports.supprimer = function(request, response) {
    var message = "Seuls les admins peuvent supprimer des citations."
    verif_connected_as_admin(request, response, message, function () {
        model_citation.deleteCitation(request.params.num, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.message = "La citation " + request.params.num + " a bien été supprimée.";
            home_controller.Index(request, response);
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