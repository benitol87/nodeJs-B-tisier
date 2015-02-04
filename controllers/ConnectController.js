

  // ////////////////////////////////////////////// C O N N E C T   U T I L I S A T E U R 
module.exports.Connect = function(request, response){
	
    response.render('connect', response);
};

 // ////////////////////////////////////////////// D E C O N N E C T   U T I L I S A T E U R 
module.exports.Deconnect = function(request, response){
	 
	 response.redirect('/connect');
};


