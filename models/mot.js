var db = require('../configDb');


module.exports.getMotsInterdits = function(callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT mot_interdit FROM mot", callback);
            connexion.release();
        }
    });
};