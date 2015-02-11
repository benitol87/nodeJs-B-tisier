/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/
var db = require('../configDb');

/*
* Récupérer l'intégralité des Villes
* @return Un tableau de Ville avec le N° et le nom
*/
module.exports.getListeVille = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
            connexion.query('SELECT vil_num, vil_nom from ville', callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};


module.exports.addVille = function(data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
          connexion.query('INSERT INTO ville SET ?', data, callback);
          connexion.release();
        }
    });
};