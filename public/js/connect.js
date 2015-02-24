$(function(){
	var nb1 = Math.round(Math.random()*100000) % 9 +1;
	var nb2 = Math.round(Math.random()*100000) % 9 +1;
	$('#image1').attr('src', '/image/nb/'+nb1+'.jpg');
	$('#image2').attr('src', '/image/nb/'+nb2+'.jpg');

	// Test de la somme lors de l'envoi du formulaire
	$('#form').on("submit", function(){
		if( $('#nombre').val() != nb1+nb2){
			$('#error').html('La somme est incorrecte.');
			return false;
		}
	});
});