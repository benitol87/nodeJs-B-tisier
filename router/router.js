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
    app.get('/citations', CitationController.citations);
    app.get('/citations/ajouter', CitationController.ajouter);
    app.post('/citations/ajouter', CitationController.ajouter);
    app.get('/citations/gestion', CitationController.gestion);
    app.get('/citations/rechercher', CitationController.rechercher);
    app.post('/citations/rechercher', CitationController.rechercher);

    app.get('/citation/:num', CitationController.citation);
    app.post('/citation/:num', CitationController.citation);
    app.post('/citation/:num/noter', CitationController.noter);
    app.get('/citation/:num/valider', CitationController.valider);
    app.get('/citation/:num/supprimer', CitationController.supprimer);


 // villes
   app.get('/villes', VilleController.villes);
   app.get('/villes/ajouter', VilleController.ajouter);
   app.post('/villes/ajouter', VilleController.ajouter);

   app.get('/ville/:num', VilleController.ville);
   app.post('/ville/:num', VilleController.ville);
   app.get('/ville/:num/supprimer', VilleController.supprimer);


// connection
   app.get('/connect', ConnectController.Connect);
   app.post('/connect', ConnectController.Connect);
   app.get('/deconnect', ConnectController.Deconnect);


 //personne
   app.get('/listerPersonne', PersonneController.ListerPersonne);
   app.get('/detailPersonne/:num', PersonneController.DetailPersonne);
   app.get('/personne/modifier/:num', PersonneController.ModifierPersonne);
   app.post('/personne/modifier/:num', PersonneController.ModifierPersonne);
   app.get('/personne/supprimer/:num', PersonneController.SupprimerPersonne);
   app.get('/ajouterPersonne', PersonneController.AjouterPersonne);
   app.post('/ajouterPersonne', PersonneController.AjouterPersonne);


// tout le reste
  app.get('*', HomeController.Index);
  app.post('*', HomeController.Index);

};
