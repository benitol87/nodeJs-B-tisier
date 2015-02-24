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
module.exports.getVilles = function (callback) {
    // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
            connexion.query('SELECT vil_num, vil_nom FROM ville', callback);
            connexion.release();
        }
    });
};

module.exports.getVille = function (vil_num, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            var query =
                'SELECT vil_num, vil_nom FROM ville ' +
                'WHERE vil_num = ' + connexion.escape(vil_num);

            connexion.query(query, callback);
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


module.exports.deleteVille = function(data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query('DELETE FROM ville WHERE vil_num = ?', data['vil_num'], callback);
            connexion.release();
        }
    });
};



module.exports.setVille = function(data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            var query = 'UPDATE ville SET vil_nom = ? WHERE vil_num = ?';
            connexion.query(query, [data['vil_nom'], data['vil_num']], callback);
            connexion.release();
        }
    });
};