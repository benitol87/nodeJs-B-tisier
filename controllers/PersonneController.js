
var model_personne = require('../models/personne.js');
var model_etudiant = require('../models/etudiant.js');
var model_salarie  = require('../models/salarie.js');
var model_fonction = require('../models/fonction.js');
var model_departement = require('../models/departement.js');
var model_division = require('../models/division.js');

var async = require('async');
var handlebars = require('express-handlebars')
var home_controller = require('./HomeController.js');


// ////////////////////////////////////////////// L I S T E R     P E R S O N N E S
module.exports.ListerPersonne = function(request, response){
	response.title = 'Liste des personnes';

	model_personne.getListePersonne( function (err, result) {
		if (err) {
				// gestion de l'erreur
				console.log(err);
				return;
		}
		response.listePersonne = result;
		response.nbPersonne = result.length;
		response.render('listerPersonne', response);
	});
};

// ////////////////////////////////////////////// D E T A I L S     P E R S O N N E
module.exports.DetailPersonne = function(request, response){
   response.title = 'Détail d\'une personne';
   var num = request.params.num;
   model_personne.getDetailPersonne(num, function (err, result) {
		if (err) {
				// gestion de l'erreur
				console.log(err);
				return;
		}
		response.personne = result[0];
		response.render('detailPersonne', response);
	});
};

// ////////////////////////////////////////////// A J O U T E R     P E R S O N N E S
module.exports.AjouterPersonne = function(request, response){
	if (!request.session.num || !request.session.login) {
        response.message = "Vous n'êtes pas connecté.";
		home_controller.Index(request, response);
		return;
	}

	if(!request.body.nom && !request.body.annee && !request.body.telprof){
		// Première arrivée sur la page : infos personnes
		response.title = 'Ajout d\'une personne';
		response.render('ajouterPersonne', response);
	} else if(request.body.nom){
		// Deuxième arrivée : redirection vers page formulaire étudiant ou salarié
		request.session.donneesAjoutPersonne = {};
		request.session.donneesAjoutPersonne.per_nom = request.body.nom;
		request.session.donneesAjoutPersonne.per_prenom = request.body.prenom;
		request.session.donneesAjoutPersonne.per_tel = request.body.tel;
		request.session.donneesAjoutPersonne.per_mail = request.body.mail;
		request.session.donneesAjoutPersonne.per_login = request.body.login;
		request.session.donneesAjoutPersonne.per_pwd = request.body.password;
		request.session.donneesAjoutPersonne.per_admin = 0;


		if(request.body.categorie=="1"){
			async.parallel([
					function(callback){
						model_division.getAllDivisions( function (err, result) {
							if (err) {
									// gestion de l'erreur
									console.log(err);
									return;
							}
							response.listeDivision = result;
							callback();
						});
					},function(callback){
						model_departement.getAllDepartements( function (err, result) {
							if (err) {
									// gestion de l'erreur
									console.log(err);
									return;
							}
							response.listeDepartement = result;
							callback();
						});
					}
				],
				function(){
					// Fin des requetes
					response.title = 'Ajout d\'un étudiant';
					response.render('ajouterEtudiant', response);
				}

			);
		} else {
			async.parallel([
					function(callback){
						model_fonction.getAllFonctions( function (err, result) {
							if (err) {
									// gestion de l'erreur
									console.log(err);
									return;
							}
							response.listeFonction = result;
							callback();
						});
					}
				],
				function(){
					// Fin des requetes
					response.title = 'Ajout d\'un salarié';
					response.render('ajouterSalarie', response);
				}

			);
		}
	} else if(request.body.annee){
		// Troisième arrivée 1 : récupération des données de l'étudiant
		request.session.donneesAjoutPersonne.dep_num = request.body.dep;
		request.session.donneesAjoutPersonne.div_num = request.body.annee;

		// TODO : Ajouter personne
		model_personne.addPersonne(request.session.donneesAjoutPersonne, function (err, result) {
            if (err) {
                console.log(err);
                return;
            };

			request.session.donneesAjoutPersonne.per_num = result.insertId;
			
			model_etudiant.addEtudiant(request.session.donneesAjoutPersonne, function (err, result) {
	            if (err) {
	                console.log(err);
	                return;
	            };

				response.title = 'Ajout d\'un étudiant';
				response.render('ajouterEtudiant', response);
	        });

        });


	} else {
		// Troisième arrivée 2 : récupération des données du salarié

		request.session.donneesAjoutPersonne.sal_telprof = request.body.telprof;
		request.session.donneesAjoutPersonne.fon_num = request.body.fonction;

		model_personne.addPersonne(request.session.donneesAjoutPersonne, function (err, result) {
            if (err) {
                console.log(err);
                return;
            };

			request.session.donneesAjoutPersonne.per_num = result.insertId;
			
			model_salarie.addSalarie(request.session.donneesAjoutPersonne, function (err, result) {
	            if (err) {
	                console.log(err);
	                return;
	            };
	            
				response.title = 'Ajout d\'un salarié';
				response.render('ajouterSalarie', response);
	        });

        });


	}

};


module.exports.ModifierPersonne = function(request, response){
	// Vérification des droits admin
	if (!request.session.admin) {
        response.message = "Seul un admin peut modifier une personne.";
		home_controller.Index(request, response);
		return;
	}

	if(!request.body.nom && !request.body.annee && !request.body.telprof){
		// Première arrivée sur la page : infos personnes

		var num = request.params.num;
		model_personne.getDetailPersonne(num, function (err, result) {
			if (err) {
					// gestion de l'erreur
					console.log(err);
					return;
			}
			request.session.personneModifiee = result[0];

			// Récupération du type de personne avant la modification
			if(request.session.personneModifiee.dep_num){
				request.session.personneModifiee.typePersonne="étudiant";
			}else {
				request.session.personneModifiee.typePersonne="salarié";
			}
		});

		response.title = 'Modifier une personne';
		response.render('modifierPersonne', response);
	} else if(request.body.nom){
		// Deuxième arrivée : redirection vers page formulaire étudiant ou salarié
		// Modification des premières données
		request.session.personneModifiee.per_nom = request.body.nom;
		request.session.personneModifiee.per_prenom = request.body.prenom;
		request.session.personneModifiee.per_tel = request.body.tel;
		request.session.personneModifiee.per_mail = request.body.mail;
		request.session.personneModifiee.per_login = request.body.login;
		request.session.personneModifiee.per_pwd = request.body.password;
		request.session.personneModifiee.per_admin = 0;

		if(request.body.categorie=="1"){
			// Cas de l'étudiant
			request.session.fon_num = "";
			async.parallel([
					function(callback){
						model_division.getAllDivisions( function (err, result) {
							if (err) {
									// gestion de l'erreur
									console.log(err);
									return;
							}
							response.listeDivision = result;
							callback();
						});
					},function(callback){
						model_departement.getAllDepartements( function (err, result) {
							if (err) {
									// gestion de l'erreur
									console.log(err);
									return;
							}
							response.listeDepartement = result;
							callback();
						});
					}
				],
				function(){
					// Fin des requetes
					response.title = 'Ajout d\'un étudiant';
					response.render('ajouterEtudiant', response);
				}

			);
		} else {
			// Cas du salarié
			request.session.dep_num = "";
			async.parallel([
					function(callback){
						model_fonction.getAllFonctions( function (err, result) {
							if (err) {
									// gestion de l'erreur
									console.log(err);
									return;
							}
							response.listeFonction = result;
							callback();
						});
					}
				],
				function(){
					// Fin des requetes
					response.title = 'Ajout d\'un salarié';
					response.render('ajouterSalarie', response);
				}

			);
		}
	} else if(request.body.annee){
		// Troisième arrivée 1 : récupération des données de l'étudiant
		request.session.personneModifiee.dep_num = request.body.dep;
		request.session.personneModifiee.div_num = request.body.annee;

		if(request.session.personneModifiee.typePersonne=="salarié"){
			// Suppression du salarié
			model_personne.deleteSalarie(request.session.personneModifiee, function (err, result){
				if (err) {
	                console.log(err);
	                return;
            	}

            	// Création de l'étudiant
            	model_etudiant.addEtudiant(request.session.personneModifiee, function(err, result){
					if (err) {
		                console.log(err);
		                return;
	            	}
	            	
	            	// Mise à jour des données de la personne
	            	model_personne.updatePersonne(request.session.personneModifiee, function(err, result){
						if (err) {
			                console.log(err);
			                return;
		            	}

						response.message = "Modification effectuée.";
						home_controller.Index(request, response);
	            	});
            	});

			});
		} else {
			// Mise à jour des données de l'étudiant
			model_personne.updateEtudiant(request.session.personneModifiee, function(err, result){
				if (err) {
	                console.log(err);
	                return;
            	}

            	// Mise à jour des données de la personne
				model_personne.updatePersonne(request.session.personneModifiee, function(err, result){
					if (err) {
		                console.log(err);
		                return;
	            	}

					response.message = "Modification effectuée.";
					home_controller.Index(request, response);
	        	});
        	});
		}


	} else {
		// Troisième arrivée 2 : récupération des données du salarié

		request.session.personneModifiee.sal_telprof = request.body.telprof;
		request.session.personneModifiee.fon_num = request.body.fonction;

		if(request.session.personneModifiee.typePersonne=="étudiant"){
			// Suppression de l'étudiant
			model_personne.deleteEtudiant(request.session.personneModifiee, function (err, result){
				if (err) {
	                console.log(err);
	                return;
            	}

            	// Création du salarié
            	model_salarie.addSalarie(request.session.personneModifiee, function(err, result){
					if (err) {
		                console.log(err);
		                return;
	            	}
	            	
	            	// Mise à jour des données de la personne
	            	model_personne.updatePersonne(request.session.personneModifiee, function(err, result){
						if (err) {
			                console.log(err);
			                return;
		            	}

						response.message = "Modification effectuée.";
						home_controller.Index(request, response);
	            	});
            	});

			});
		} else {
			// Mise à jour des données de l'étudiant
			model_personne.updateEtudiant(request.session.personneModifiee, function(err, result){
				if (err) {
	                console.log(err);
	                return;
            	}

            	// Mise à jour des données de la personne
				model_personne.updatePersonne(request.session.personneModifiee, function(err, result){
					if (err) {
		                console.log(err);
		                return;
	            	}

					response.message = "Modification effectuée.";
					home_controller.Index(request, response);
	        	});
        	});
		}

	}

};




module.exports.SupprimerPersonne = function(request, response){
	if (!request.session.admin) {
        response.message = "Seul un admin peut supprimer une personne.";
		home_controller.Index(request, response);
		return;
	}

	obj = {};
	obj.per_num = request.params.num;

	model_personne.deletePersonne(obj, function (err, result) {
        if (err) {
            console.log(err);
            return;
        };

        response.message = "Suppression effectuée.";
		home_controller.Index(request, response);
    });

};