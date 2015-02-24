var db = require('../configDb');

module.exports.addEtudiant = function (data, callback) {  
	// connexion à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'INSERT INTO etudiant (per_num, dep_num, div_num) '+
			' VALUES ('+connexion.escape(data['per_num'])+
			', '+connexion.escape(data['dep_num'])+
			', '+connexion.escape(data['div_num'])+
			' );';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};

