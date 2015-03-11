var db = require('../configDb');

/*
* Récupérer une partie des citations (celles notées, dont la date ne vaut pas NULL,
* et qui sont valides)
* @return Un tableau de citations avec le nom de la personne,
* la citation, la date et la moyenne des notes
*/
module.exports.getCitations = function (callback) {
    // connection à la base
	db.getConnection(function(err, connexion){
		if(!err){
			var sql = 'SELECT c.cit_num, per_nom, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") AS cit_date, AVG(vot_valeur) AS moyenne FROM citation c '+
				'JOIN personne p ON c.per_num = p.per_num '+
				'LEFT JOIN vote v ON v.cit_num = c.cit_num '+
				'WHERE cit_date IS NOT NULL AND cit_valide = 1 '+
				'GROUP BY per_nom, c.cit_num, cit_libelle, cit_date';
			// s'il n'y a pas d'erreur de connexion
			// execution de la requête SQL
			connexion.query(sql, callback);

			// la connexion retourne dans le pool
			connexion.release();
		 }
	});
};

module.exports.getCitationsInvalides = function (callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            var sql = 'SELECT c.cit_num, per_nom, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") AS cit_date, AVG(vot_valeur) AS moyenne FROM citation c '+
                'JOIN personne p ON c.per_num = p.per_num '+
                'JOIN vote v ON v.cit_num = c.cit_num '+
                'WHERE cit_date IS NOT NULL AND cit_valide = 0 '+
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


module.exports.getCitation = function (cit_num, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
        	var query =
        		'SELECT c.cit_num, c.per_num, per_nom, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") AS cit_date, AVG(vot_valeur) AS moyenne ' +
        		'FROM citation c ' +
					'JOIN personne p ON c.per_num = p.per_num ' +
					'LEFT JOIN vote v ON v.cit_num = c.cit_num ' +
                'WHERE c.cit_num = ' + connexion.escape(cit_num) +
					'AND cit_date IS NOT NULL ' +
					'AND cit_valide = 1 ' +
				'GROUP BY per_nom, c.cit_num, cit_libelle, cit_date ';

            connexion.query(query, callback);
            connexion.release();
         }
    });
};


module.exports.addCitation = function (data, callback) {
    // connection à la base
	db.getConnection(function(err, connexion){
		if(!err){
            var date = data['cit_date'].split('/');
            data['cit_date'] = date[2] + '-' + date[1] + '-' + date[0];

            connexion.query('INSERT INTO citation SET ?', data, callback);
			connexion.release();
		 }
	});
}

module.exports.setCitation = function(data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            var date = data['cit_date'].split('/');
            data['cit_date'] = date[2] + '-' + date[1] + '-' + date[0];

            var query = 'UPDATE citation SET cit_libelle = ?, cit_date = ? WHERE cit_num = ?';
            var res = connexion.query(query, [data['cit_libelle'], data['cit_date'], data['cit_num']], callback);
            connexion.release();
        }
    });
};

module.exports.validateCitation = function(cit_num, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            var sql = 'UPDATE citation SET cit_valide = 1 WHERE cit_num = ?';
            connexion.query(sql, cit_num, callback);
            connexion.release();
        }
    });
};

module.exports.deleteCitation = function(cit_num, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            var sql = 'DELETE FROM vote WHERE cit_num = ?';
            connexion.query(sql, cit_num, function (err, result) {
                var sql = 'DELETE FROM citation WHERE cit_num = ?';
                connexion.query(sql, cit_num, callback);
                connexion.release();
            });
        }
    });
};

module.exports.getAllEnseignantsCites = function( callback){
	db.getConnection(function(err, connexion){
        if(!err){
            var query = 'SELECT DISTINCT c.per_num, p.per_nom '+
            			' FROM citation c '+
            			' JOIN personne p ON p.per_num=c.per_num '+
            			' WHERE c.cit_valide=1 '+
            			' ORDER BY p.per_nom ';
            connexion.query(query, callback);
            connexion.release();
        }
    });
};

module.exports.getAllDatesCitations = function( callback){
	db.getConnection(function(err, connexion){
        if(!err){
            var query = 'SELECT DISTINCT DATE_FORMAT(cit_date, "%d/%m/%Y") AS cit_date '+
            			' FROM citation '+
            			' WHERE cit_valide=1 '+
            			' ORDER BY cit_date DESC';
            connexion.query(query, callback);
            connexion.release();
        }
    });
};

module.exports.getAllMoyennesCitations = function( callback){
	db.getConnection(function(err, connexion){
        if(!err){
            var query = 'SELECT AVG(vot_valeur) AS moyenne '+
            			' FROM vote v '+
            			' JOIN citation c ON v.cit_num = c.cit_num '+
            			' WHERE cit_valide=1 '+
            			' GROUP BY v.cit_num '+
            			' ORDER BY moyenne';
            connexion.query(query, callback);
            connexion.release();
        }
    });
};

module.exports.rechercherCitations = function(data, callback){
	db.getConnection(function(err, connexion){
        if(!err){
            var query = 'SELECT cit_libelle, per_nom, DATE_FORMAT(cit_date, "%d/%m/%Y") AS cit_date, AVG(vot_valeur) AS moyenne '+
            			' FROM citation c'+
            			' JOIN vote v ON c.cit_num = v.cit_num '+
            			' JOIN personne p ON p.per_num = c.per_num '+
            			' WHERE cit_valide=1 ';
            if(data["enseignant"]!="-1"){
            	query = query + ' AND p.per_num = '+connexion.escape(data["enseignant"]);
            }
            if(data["date"]!="-1"){
            	query = query + ' AND DATE_FORMAT(c.cit_date, "%d/%m/%Y") = '+connexion.escape(data["date"]);
            }
            query = query +	' GROUP BY c.cit_num, cit_libelle, per_nom, cit_date '
            if(data["note"]!="-1"){
            	query = query + ' HAVING moyenne BETWEEN '+connexion.escape(parseInt(data["note"])-1)+' AND '+connexion.escape(parseInt(data["note"])+1);
            }
            query = query +	' ORDER BY per_nom ';

            //console.log(query);
            connexion.query(query, callback);
            connexion.release();
        }
    });
}
