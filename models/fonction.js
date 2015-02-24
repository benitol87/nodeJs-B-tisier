var db = require('../configDb');

/*
* Récupérer toutes les fonctions
* @return la liste des fonctions contenues dans la base
*/
module.exports.getAllFonctions = function (callback) {  
	// connection à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'SELECT fon_num, fon_libelle FROM fonction';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};