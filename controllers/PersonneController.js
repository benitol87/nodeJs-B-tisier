
var model = require('../models/personne.js');


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
		response.session = request.session;
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
		response.session = request.session;
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
   response.title = 'Ajout des personnes';
   response.session = request.session;
   response.render('ajouterPersonne', response);
};