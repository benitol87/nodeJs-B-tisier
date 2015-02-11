var HomeController = require('./../controllers/HomeController');
var ConnectController = require('./../controllers/ConnectController');
var PersonneController = require('./../controllers/PersonneController');
var CitationController = require('./../controllers/CitationController');
var VilleController = require('./../controllers/VilleController');

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);

// citations
    app.get('/citations/lister', CitationController.ListerCitation);
    app.get('/citations/ajouter', CitationController.AjouterCitation);
    app.post('/citations/ajouter', CitationController.AjouterCitation);
    app.get('/citations/rechercher', CitationController.RechercherCitation);

 // villes
   app.get('/villes/lister', VilleController.ListerVille);
   app.get('/villes/ajouter', VilleController.AjouterVille);
   app.post('/villes/ajouter', VilleController.AjouterVille);
   app.get('/villes/modifier', VilleController.ModifierVille);

// connection
   app.get('/connect', ConnectController.Connect);
   app.post('/connect', ConnectController.Connect);
   app.get('/deconnect', ConnectController.Deconnect);


 //personne
   app.get('/listerPersonne', PersonneController.ListerPersonne);
   app.get('/detailPersonne/:num', PersonneController.DetailPersonne);
   app.get('/ajouterPersonne', PersonneController.AjouterPersonne);

// tout le reste
  app.get('*', HomeController.Index);
  app.post('*', HomeController.Index);

};
