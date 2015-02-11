
var model = require('../models/personne.js');

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R 
module.exports.Connect = function(request, response){
	response.title = "Connexion";

	if(request.body.login){
		// Traitement des données envoyées depuis le formulaire
		// Vérification du couple login/mot de passe
		var data = {"login":request.body.login,"pass":request.body.pass};
		model.getLoginOk( data, function (err, result) {
			if (err) {
					// gestion de l'erreur
					console.log(err);
					response.
					return;
			}

			if(result.length == 1){ // Si login OK
				// On place le login et le numéro de l'étudiant 
				// dans une variable de session
				request.session.num = result[0].per_num;
				request.session.login = request.body.login;
			}
			
		});
	}

	response.session = request.session;
	console.log(request.session);
	
	// Renvoi vers la page
	response.render('connect', response);
};

 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R 
module.exports.Deconnect = function(request, response){
	response.title = "Déconnexion";
	request.session.login = ''; 
	response.redirect('/connect');
};


