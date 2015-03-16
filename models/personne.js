// appel du module pour le cryptage du mot de passe
var crypto=require('crypto');
var db = require('../configDb');

/*
* Récupérer le détail d'une personne
* @return Une personne avec les différents détails propres aux
* étudiants et aux salariés
*/
module.exports.getDetailPersonne = function (per_num, callback) {  
	// connection à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'SELECT p.*, d.*, s.sal_telprof, f.*, di.*, v.* FROM personne p '+
				'LEFT JOIN etudiant e ON p.per_num = e.per_num '+
				'LEFT JOIN division di ON di.div_num = e.div_num '+
				'LEFT JOIN departement d ON e.dep_num = d.dep_num '+
				'LEFT JOIN ville v ON v.vil_num = d.vil_num '+
				'LEFT JOIN salarie s ON s.per_num = p.per_num '+
				'LEFT JOIN fonction f ON f.fon_num = s.fon_num '+
				'WHERE p.per_num = '+connexion.escape(per_num);
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};

/*
* Récupérer l'intégralité des personnes
* @return Un tableau de personnes avec le numéro, le nom et le
* prénom de la personne
*/
module.exports.getListePersonne = function (callback) {  
	// connexion à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'SELECT per_num, per_nom, per_prenom FROM personne';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};

/*
* Vérifie le nom utilisateur et son mot de passe
* 
* @param     data.login : le login de l'utilisateur
* @param     data.pass : le mot de passe
* @return l'identifiant de la personne si le mot de passe et le login sont bons
*     Rien sinon
*
*/
module.exports.getLoginOk = function (data, callback) {
	db.getConnection(function(err, connexion){
		if(!err){
			var sha256 = crypto.createHash("sha256"); // cryptage en sha256
			sha256.update(data.pass, "utf8");
			var resu = sha256.digest("base64");	
		//console.log ('Mot de passe en clair : ' + data.pass); 
		//console.log ('Mot de passe crypté : ' + resu);	 	
			req= "SELECT per_num, per_admin from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " +connexion.escape(resu);
		//console.log(req);
			connexion.query(req, callback);
			connexion.release();
		}
	});
};


module.exports.addPersonne = function (data, callback) {  
	// cryptage en sha256
	var sha256 = crypto.createHash("sha256"); 
	sha256.update(data['per_pwd'], "utf8");
	var pwd_crypte = sha256.digest("base64");

	// connexion à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'INSERT INTO personne (per_nom, per_prenom, per_tel, per_mail, per_admin, per_login, per_pwd) '+
			' VALUES ('+connexion.escape(data['per_nom'])+
			', '+connexion.escape(data['per_prenom'])+
			', '+connexion.escape(data['per_tel'])+
			', '+connexion.escape(data['per_mail'])+
			', '+connexion.escape(data['per_admin'])+
			', '+connexion.escape(data['per_login'])+
			', '+connexion.escape(pwd_crypte)+
			' );';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		 }
	});   
};

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

// Méthode qui supprime toutes les informations de la personne dont on passe l'identifiant en paramètre dans l'objet data
module.exports.deletePersonne = function (data, callback){
	db.getConnection(function(err,connexion){
		if(!err){
			var sql = ''; 
			sql += 'DELETE FROM vote WHERE per_num = '+connexion.escape(data['per_num'])+';\n';
			sql += 'DELETE FROM vote WHERE cit_num IN (';
			sql +=			'SELECT cit_num FROM citation WHERE per_num	= '+connexion.escape(data['per_num'])+' OR per_num_valide = '+connexion.escape(data['per_num'])+' OR per_num_etu = '+connexion.escape(data['per_num']);
			sql += ');'
			sql += 'DELETE FROM citation WHERE per_num = '+connexion.escape(data['per_num'])+' OR per_num_valide = '+connexion.escape(data['per_num'])+' OR per_num_etu = '+connexion.escape(data['per_num'])+' ;';
			sql += 'DELETE FROM etudiant WHERE per_num = '+connexion.escape(data['per_num'])+';';
			sql += 'DELETE FROM salarie WHERE per_num = '+connexion.escape(data['per_num'])+';';
			sql += 'DELETE FROM personne WHERE per_num = '+connexion.escape(data['per_num'])+';';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		}
	})
}

// 
module.exports.updatePersonne = function (data, callback){
	var sha256 = crypto.createHash("sha256"); 
	sha256.update(data['per_pwd'], "utf8");
	var pwd_crypte = sha256.digest("base64");

	db.getConnection(function(err,connexion){
		if(!err){
			var sql = 'UPDATE personne SET '+
				' per_nom = '+connexion.escape(data['per_nom'])+
				' ,per_prenom = '+connexion.escape(data['per_prenom'])+
				' ,per_tel = '+connexion.escape(data['per_tel'])+
				' ,per_mail = '+connexion.escape(data['per_mail'])+
				' ,per_login = '+connexion.escape(data['per_login'])+
				' ,per_pwd = '+connexion.escape(pwd_crypte)+
				' WHERE per_num = '+connexion.escape(data['per_num'])+';'; 
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL           
			connexion.query(sql, callback);
			
			// la connexion retourne dans le pool
			connexion.release();
		}
	});
}

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

module.exports.updateSalaire = function (data, callback){
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