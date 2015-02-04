var db = require('../configDb');

/*
* Récupérer une partie des citations (celles notées, dont la date ne vaut pas NULL, 
* et qui sont valides)
* @return Un tableau de citations avec le nom de la personne,
* la citation, la date et la moyenne des notes
*/
module.exports.getListeCitation = function (callback) {	
   // connection à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'SELECT per_nom, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") AS cit_date, AVG(vot_valeur) AS moyenne FROM citation c '+
				'JOIN personne p ON c.per_num = p.per_num '+
				'JOIN vote v ON v.cit_num = c.cit_num '+
				'WHERE cit_date IS NOT NULL AND cit_valide = 1 '+
				'GROUP BY per_nom, c.cit_num, cit_libelle, cit_date '+
				'HAVING moyenne IS NOT NULL';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL        	  
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};


