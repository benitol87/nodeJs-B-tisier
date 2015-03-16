var db = require('../configDb');


module.exports.addVote = function (data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query('INSERT INTO vote SET ?', data, callback);
            connexion.release();
         }
    });
}
