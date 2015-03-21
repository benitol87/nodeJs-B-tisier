var db = require('../configDb');

// Ajoute les informations d'un nouveau salarié dans la table salarie
// La personne doit exister dans la table personne
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

// Mise à jour des informations sur un salarié
module.exports.updateSalarie = function (data, callback){
	db.getConnection(function(err,connexion){
		if(!err){
			var sql = 'UPDATE salarie SET '+
				' sal_telprof = '+connexion.escape(data['sal_telprof'])+
				' ,fon_num = '+connexion.escape(data['fon_num'])+
				' WHERE per_num = '+connexion.escape(data['per_num'])+';'; 
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		}
	});
}

// Méthode qui efface toutes les données d'un salarié dont on passe l'identifiant, sauf celles contenues dans la table personne
module.exports.deleteSalarie = function (data, callback){
	db.getConnection(function(err,connexion){
		if(!err){
			var sql = ''; 
			sql += 'DELETE FROM vote WHERE cit_num IN (';
			sql +=			'SELECT cit_num FROM citation WHERE per_num	= '+connexion.escape(data['per_num'])+' OR per_num_valide = '+connexion.escape(data['per_num'])+' OR per_num_etu = '+connexion.escape(data['per_num']);
			sql += ');'
			sql += 'DELETE FROM citation WHERE per_num = '+connexion.escape(data['per_num'])+' OR per_num_valide = '+connexion.escape(data['per_num'])+' OR per_num_etu = '+connexion.escape(data['per_num'])+' ;';
			sql += 'DELETE FROM salarie WHERE per_num = '+connexion.escape(data['per_num'])+';';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		}
	})
}