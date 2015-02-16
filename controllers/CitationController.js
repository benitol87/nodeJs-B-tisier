var model_citation = require('../models/citation.js');
var model_personne = require('../models/personne.js');
var home_controller = require('./HomeController.js');

var view_root = "citations/";

// ////////////////////////////////////////////// L I S T E R     C I T A T I O N

module.exports.ListerCitation = 	function(request, response){
	response.title = 'Liste des personne';

	model_citation.getListeCitation( function (err, result) {
		if (err) {
			// gestion de l'erreur
			console.log(err);
			return;
		}
		response.citations = result;
		response.nbCitation = result.length;
		response.session = request.session;
		response.render(view_root + 'lister', response);
	});

	} ;

// ////////////////////////////////////////////// A J O U T E R     C I T A T I O N

module.exports.AjouterCitation = 	function(request, response){
	if (!request.session.num || !request.session.login) {
		console.log("vous n'êtes pas connecté");
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
				response.session = request.session;
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
			response.session = request.session;
			response.render(view_root + 'ajouter', response);
		});
	}
	} ;


// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N

module.exports.RechercherCitation = function(request, response){
	 response.title = 'Rechercher des citations';
	 response.session = request.session;
	 response.render(view_root + 'rechercher', response);
	} ;

