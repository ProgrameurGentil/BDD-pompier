let etatMenuFiltre = false;
let json;
lireJSON();



// apres l'initialisation du HTML

function initialiser() {
	let listeImages;
  for (let i = 0; i < json["vehicules"].length; i++) {
  	listeImages = json["vehicules"][i]["photos"];
  	if (listeImages.length > 0) ajouterVehicule(i, listeImages[0]);
    else ajouterVehicule(i, "./res/image_ref.jpg");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
	await lireJSON();
	initialiser();

	actionnerBoutonImageExplication(100, document.getElementById("suivant"));
	actionnerBoutonImageExplication(-100, document.getElementById("precedent"));

	document.getElementById("boutonMenuDeroulantFiltre").addEventListener("click", () => {
		actionnerBoutonFiltrer();
	});

	redimentionnerDivEcran();
	window.addEventListener("resize", () => {
		redimentionnerDivEcran();
	});
});

/* redimention */
function redimentionnerDivEcran() {
	const divEcran =  document.querySelector(".ecran");
	divEcran.style.width = window.innerWidth + "px";
  divEcran.style.height = (window.innerHeight - document.querySelector("header").offsetHeight) + "px";
}

/* bouton (pour le filtrage) */
function actionnerBoutonImageExplication(nbPixel, bouton) {
	const divConteneurImageExplication = document.getElementById("conteneurImageExplication");
	bouton.addEventListener('click', () => {
    divConteneurImageExplication.scrollBy({ left: nbPixel, behavior: 'smooth' });
  });
}
function actionnerBoutonFiltrer() {
	const flecheHaut = document.getElementById("flecheHautMenuDeroulantFiltre");
	const flecheBas = document.getElementById("flecheBasMenuDeroulantFiltre");
	const conteneurFiltre = document.querySelector(".surConteneurFiltre");

	etatMenuFiltre = !etatMenuFiltre;

	if (etatMenuFiltre) {
		
		flecheHaut.classList.remove("cacher");
		flecheBas.classList.add("cacher");
		conteneurFiltre.classList.remove("cacher");
	} else {
		flecheHaut.classList.add("cacher");
		flecheBas.classList.remove("cacher");
		conteneurFiltre.classList.add("cacher");
	}
}
// //

/* ajout d'un vehicule (balises) */
function ajouterVehicule(id, url_image) {
	const baliseButton = document.createElement('button');
	const baliseConteneur = document.createElement('div');
	const baliseNom = document.createElement('div');
	const baliseP = document.createElement('p');
    
  const parent = document.querySelector(".vehicules");

  baliseButton.setAttribute("class", "bouton_vehicule");
  baliseButton.value = id;
  baliseConteneur.setAttribute("class", "conteneur");
  baliseConteneur.style.backgroundImage = "url("+url_image+")";
  baliseConteneur.style.backgroundRepeat = "no-repeat";
  baliseConteneur.style.backgroundSize = "cover";
  baliseConteneur.style.backgroundPosition = "center";
  baliseNom.setAttribute("id", "nom");
  baliseP.innerText = "Nom du vehicule";

  baliseNom.appendChild(baliseP);
  baliseConteneur.appendChild(baliseNom);
  baliseButton.appendChild(baliseConteneur);

  parent.appendChild(baliseButton);
  baliseButton.addEventListener("click", (event) => {
  	afficherInfo(id);
  	//console.log(id)
  });
}

/* affichage infos */
function afficherInfo(idVehicule) {
  const balise = document.querySelector(".explication");
  if (balise) {
  	initialiserInfosVehicules(json["vehicules"][idVehicule]);
  	actionnerBoutonVehicule(true);
  	balise.classList.remove("cacher");

  	const divConteneurImageExplication = document.getElementById("conteneurImageExplication");
	  divConteneurImageExplication.scrollBy({ left: -5000, behavior: 'smooth' });

  	const baliseVehicules = document.querySelector(".vehicules");
  	if (baliseVehicules) baliseVehicules.classList.add("flouter");

  	balise.offsetHeight;

  	balise.focus();
		balise.addEventListener("blur", (event) => {
			
			if (event.relatedTarget != null && event.relatedTarget.classList.contains("boutonImageExplication")) { 
				balise.focus();
				return; 
			}

			
			setTimeout(() => {
				actionnerBoutonVehicule(false)
			}, 150);

			balise.classList.add("cacher"); //
			if (baliseVehicules) baliseVehicules.classList.remove("flouter");
		});
  }
}

/* boutons images activation/desactivation */
function actionnerBoutonVehicule(val) {
	const listeBoutonVehicule = document.getElementsByClassName("bouton_vehicule");
	for (let i = 0; i < listeBoutonVehicule.length; i++) {
		listeBoutonVehicule[i].disabled = val;
	}
}

/* ajout de l'image dans les explications */
async function initialiserImagesVehicule(listeImages) {
	const divImageExplication = document.querySelector("#conteneurImageExplication");
	divImageExplication.innerHTML = '';
	for (let i = 0; i < listeImages.length; i++) {
		const img = document.createElement('img');
		img.src = listeImages[i];

		divImageExplication.appendChild(img);
	}
}

/* intialisation des explications des vehicules */
function trouverElementJSON(id, liste) {
	for (var i = liste.length - 1; i >= 0; i--) {
		if (liste[i]["id"] == id) {
			return liste[i];
		}
	}
	return Object({});
}

function viderListeMatieresEtCouleurs() {
	document.querySelector("#infoCouleur #listeElement").replaceChildren();
	document.querySelector("#infoMatiere #listeElement").replaceChildren();
}

function ajouterElementMatieresOuCouleurs(identifiant, texte) {
	const baliseLi = document.createElement('li');
	const baliseP = document.createElement('p');
	baliseP.innerText = texte.toString();
	baliseLi.appendChild(baliseP);
	document.querySelector(identifiant + " #listeElement").appendChild(baliseLi);
}

async function initialiserInfosVehicules(jsonVehicule) {
	const pConstructeur = document.querySelector("#infoConstructeur p");
	const pMarque = document.querySelector("#infoMarque p");
	const pModele = document.querySelector("#infoModele p");
	const pType = document.querySelector("#infoType p");
	const pCouleur = document.querySelector("#infoCouleur p");
	const pEtat = document.querySelector("#infoEtat p");
	const pEchelle = document.querySelector("#infoEchelle p");
	const pBoite = document.querySelector("#infoBoite p");
	const pPays = document.querySelector("#infoPaysFabrication p");
	const pMatiere = document.querySelector("#infoMatiere p");
	const pRef = document.querySelector("#infoReference p");
	const pHistoire = document.querySelector("#infoHistoire p");
	const pNote = document.querySelector("#infoNote p");
	let temp;

	document.querySelector("#conteneurImageExplication").innerHTML = '';
	const listeImages = jsonVehicule["photos"];
	if (listeImages.length > 0) {
		initialiserImagesVehicule(listeImages);
		document.querySelector("#zoneImageExplication").classList.remove("cacher");
	} 
	else document.querySelector("#zoneImageExplication").classList.add("cacher");

	//console.log(listeImages.length);

	pHistoire.textContent = jsonVehicule["histoire"];
	pNote.textContent = jsonVehicule["note"];
	pRef.textContent = jsonVehicule["reference"];
	pModele.textContent = jsonVehicule["modele"];
	viderListeMatieresEtCouleurs();

	temp = trouverElementJSON(jsonVehicule["constructeur"], json["constructeurs"]);
	if (Object.keys(temp).length > 0) pConstructeur.textContent = temp["nom"];
	else pConstructeur.textContent = "Erreur";
	
	temp = trouverElementJSON(jsonVehicule["marque"], json["marques"]);
	if (Object.keys(temp).length > 0) pMarque.textContent = temp["nom"];
	else pMarque.textContent = "Erreur";
	
	temp = trouverElementJSON(jsonVehicule["type"], json["types"]);
	if (Object.keys(temp).length > 0) pType.textContent = temp["nom"];
	else pType.textContent = "Erreur";
	
	temp = trouverElementJSON(jsonVehicule["etat"], json["etats"]);
	if (Object.keys(temp).length > 0) pEtat.textContent = temp["nom"];
	else pEtat.textContent = "Erreur";
	
	temp = trouverElementJSON(jsonVehicule["echelle"], json["echelles"]);
	if (Object.keys(temp).length > 0) pEchelle.textContent = temp["nom"];
	else pEchelle.textContent = "Erreur";
	
	temp = trouverElementJSON(jsonVehicule["boite"], json["boites"]);
	if (Object.keys(temp).length > 0) pBoite.textContent = temp["nom"];
	else pBoite.textContent = "Erreur";
	
	temp = trouverElementJSON(jsonVehicule["pays"], json["pays"]);
	if (Object.keys(temp).length > 0) pPays.textContent = temp["nom"];
	else pPays.textContent = "Erreur";
	
	for (var i = jsonVehicule["couleur"].length - 1; i >= 0; i--) {
		temp = trouverElementJSON(jsonVehicule["couleur"][i], json["couleurs"]);
		if (Object.keys(temp).length > 0) ajouterElementMatieresOuCouleurs("#infoCouleur", temp["nom"]);
	}

	for (var i = jsonVehicule["matiere"].length - 1; i >= 0; i--) {
		temp = trouverElementJSON(jsonVehicule["matiere"][i], json["matieres"]);
		if (Object.keys(temp).length > 0) ajouterElementMatieresOuCouleurs("#infoMatiere", temp["nom"]);
	}

}

/* lecture du fichier JSON*/
async function lireJSON() {
  const reponse = await fetch("https://raw.githubusercontent.com/ProgrameurGentil/BDD-pompier/main/res/data/data.json");
  json = await reponse.json();
 	//console.log(json);
}