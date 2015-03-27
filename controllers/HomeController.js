

  // ////////////////////////////////////////////// A C C U E I L
module.exports.Index = function(request, response){
    response.title = "Bienvenue sur le bêtisier de l'IUT.";
    response.render('home', response);
};


