var db = require('../configDb');

/*
* Récupérer tous les départements
* @return la liste des départements contenus dans la base
*/
module.exports.getAllDepartements = function (callback) {  
	// connexion à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'SELECT dep_num, dep_nom FROM departement';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};