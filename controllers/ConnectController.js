
var model = require('../models/personne.js');
var async = require('async');

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R
module.exports.Connect = function(request, response){
	response.title = "Connexion";

	async.parallel([
    function(callback){
		if(request.body.login){
			// Traitement des données envoyées depuis le formulaire
			// Vérification du couple login/mot de passe
			var data = {"login":request.body.login,"pass":request.body.pass};
			model.getLoginOk( data, function (err, result) {
				if (err) {
						// gestion de l'erreur
						console.log(err);
						callback();
						return;
				}

				if(result.length == 1){ // Si login OK
					// On place le login et le numéro de l'étudiant
					// dans une variable de session
					request.session.num = result[0].per_num;
					request.session.login = request.body.login;

					callback();
					return;
					
				}
				else {
					callback();
					return;
				}

			});
		}
		else{
			callback();
		}
    }], function(){
		// Callback
		// Renvoi vers la page de redirection
		if(request.session.login){
			response.render('connected');
			return;
		}

		// Renvoi vers la page de formulaire
		response.render('connect', response);
	});


};

 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R
module.exports.Deconnect = function(request, response){
	response.title = "Déconnexion";

	request.session.login = ''; 
	response.render('disconnect');

};


