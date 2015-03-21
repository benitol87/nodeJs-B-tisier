var db = require('../configDb');

// Ajoute les informations d'un nouvel étudiant dans la table etudiant
// La personne doit exister dans la table personne
module.exports.addEtudiant = function (data, callback) {
	// connexion à la base
	db.getConnection(function (err, connexion){
		if (!err){
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

// Méthode permettant de récupérer l'étudiant dont on passe le numéro en paramètre
module.exports.getEtudiant = function(per_num, callback) {
	db.getConnection(function (err, connexion) {
		if (!err) {
			var sql = 'SELECT * FROM etudiant WHERE per_num = ' + connexion.escape(per_num);

			connexion.query(sql, callback);
			connexion.release();
		}
	});
};

// Mise à jour des informations sur un étudiant
module.exports.updateEtudiant = function (data, callback){
	db.getConnection(function(err,connexion){
		if(!err){
			var sql = 'UPDATE etudiant SET '+
				' dep_num = '+connexion.escape(data['dep_num'])+
				' ,div_num = '+connexion.escape(parseInt(data['div_num']))+
				' WHERE per_num = '+connexion.escape(data['per_num'])+';'; 
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		}
	});
}

// Méthode qui efface toutes les données d'un étudiant dont on passe l'identifiant, sauf celles contenues dans la table personne
module.exports.deleteEtudiant = function (data, callback){
	db.getConnection(function(err,connexion){
		if(!err){
			var sql = ''; 
			sql += 'DELETE FROM vote WHERE per_num = '+connexion.escape(data['per_num'])+';\n';
			sql += 'DELETE FROM vote WHERE cit_num IN (';
			sql +=			'SELECT cit_num FROM citation WHERE per_num	= '+connexion.escape(data['per_num'])+' OR per_num_valide = '+connexion.escape(data['per_num'])+' OR per_num_etu = '+connexion.escape(data['per_num']);
			sql += ');'
			sql += 'DELETE FROM citation WHERE per_num = '+connexion.escape(data['per_num'])+' OR per_num_valide = '+connexion.escape(data['per_num'])+' OR per_num_etu = '+connexion.escape(data['per_num'])+' ;';
			sql += 'DELETE FROM etudiant WHERE per_num = '+connexion.escape(data['per_num'])+';';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		}
	})
}
