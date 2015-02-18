
var model = require('../models/personne.js');
var model_fonction = require('../models/fonction.js');
var model_departement = require('../models/departement.js');
var model_division = require('../models/division.js');

var async = require('async');
var home_controller = require('./HomeController.js');


// ////////////////////////////////////////////// L I S T E R     P E R S O N N E S
module.exports.ListerPersonne = function(request, response){
	response.title = 'Liste des personnes';

	model.getListePersonne( function (err, result) {
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
   model.getDetailPersonne(num, function (err, result) {
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
		console.log("vous n'êtes pas connecté");
		home_controller.Index(request, response);
		return;
	}

	if(!request.body.nom && !request.body.annee && !request.body.telprof){
		// Première arrivée sur la page : infos personnes
		response.title = 'Ajout d\'une personne';
		response.render('ajouterPersonne', response);
	} else if(request.body.nom){
		// Deuxième arrivée : redirection vers page formulaire étudiant ou salarié
		request.session.nomAjout = request.body.nom;
		request.session.prenomAjout = request.body.prenom;
		request.session.telAjout = request.body.tel;
		request.session.mailAjout = request.body.mail;
		request.session.loginAjout = request.body.login;
		request.session.passwordAjout = request.body.password;


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
		// TODO : Ajouter étudiant

		response.title = 'Ajout d\'un étudiant';
		response.render('ajouterEtudiant', response);
	} else {
		// Troisième arrivée 2 : récupération des données du salarié
		// TODO : Ajouter salarié

		response.title = 'Ajout d\'un salarié';
		response.render('ajouterSalarie', response);
	}
	
};