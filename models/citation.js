var db = require('../configDb');

/*
* Récupérer l'intégralité des Villes
* @return Un tableau de Ville avec le N° et le nom
*/
module.exports.getListeCitation = function (callback) {	
   // connection à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'SELECT per_nom, cit_libelle, cit_date, AVG(vot_valeur) AS moyenne FROM citation c '+
				'JOIN personne p ON c.per_num = p.per_num '+
				'JOIN vote v ON v.cit_num = c.cit_num '+
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


