var db = require('../configDb');

module.exports.addSalarie = function (data, callback) {  
	// connexion à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'INSERT INTO salarie (per_num, sal_telprof, fon_num) '+
			' VALUES ('+connexion.escape(data['per_num'])+
			', '+connexion.escape(data['sal_telprof'])+
			', '+connexion.escape(data['fon_num'])+
			' );';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};