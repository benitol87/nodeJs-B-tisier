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
			var sql = 'SELECT per_nom, per_prenom, per_mail, per_tel, fon_libelle, vil_nom, dep_nom, sal_telprof FROM personne p '+
				'LEFT JOIN etudiant e ON p.per_num = e.per_num '+
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
	// connection à la base
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
			req= "SELECT per_num from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " +connexion.escape(resu);
		//console.log(req);
			connexion.query(req, callback);
			connexion.release();
		}
	});
};

