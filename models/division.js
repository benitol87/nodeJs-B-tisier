var db = require('../configDb');

/*
* Récupérer tous les départements
* @return la liste des départements contenus dans la base
*/
module.exports.getAllDivisions = function (callback) {  
	// connexion à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'SELECT div_num, div_nom FROM division';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};