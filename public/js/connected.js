var compteur = 3;

function modifierCompteur(){
	
	$("#compteRebours").text(compteur);
	compteur--;

	if(compteur==-1){
		// Redirection
		$(location).attr("href", "/");
	}else{
		setTimeout(modifierCompteur,1000);
	}
}

$(function(){
	if($("#compteRebours"))
		modifierCompteur();
});