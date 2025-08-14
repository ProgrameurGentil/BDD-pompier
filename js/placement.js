let etatMenuFiltre = false;

// apres l'initialisation du HTML
document.addEventListener("DOMContentLoaded", () => {
    		for (let i = 0; i < 10; i++) {
    			ajouterVehicule("./res/image_ref.jpg");
    		}

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

function redimentionnerDivEcran() {
	const divEcran =  document.querySelector(".ecran");
	divEcran.style.width = window.innerWidth + "px";
  divEcran.style.height = (window.innerHeight - document.querySelector("header").offsetHeight) + "px";
}

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

function ajouterVehicule(url_image) {
	const baliseButton = document.createElement('button');
	const baliseConteneur = document.createElement('div');
	const baliseNom = document.createElement('div');
	const baliseP = document.createElement('p');
    
    const parent = document.querySelector(".vehicules");

    baliseButton.setAttribute("class", "bouton_vehicule");
    baliseConteneur.setAttribute("class", "conteneur");
    baliseConteneur.style.backgroundImage = "url("+url_image+")";
    baliseNom.setAttribute("id", "nom");
    baliseP.innerText = "Nom du vehicule";

    baliseNom.appendChild(baliseP);
    baliseConteneur.appendChild(baliseNom);
    baliseButton.appendChild(baliseConteneur);

    parent.appendChild(baliseButton);
    baliseButton.addEventListener("click", (event) => {
    	afficherInfo();
    	initialiserImagesVehicule("col");
    });
}

function afficherInfo() {
  const balise = document.querySelector(".explication");
  if (balise) {
  	actionnerBoutonVehicule(true);
  	balise.classList.remove("cacher");

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

function actionnerBoutonVehicule(val) {
	const listeBoutonVehicule = document.getElementsByClassName("bouton_vehicule");
	for (let i = 0; i < listeBoutonVehicule.length; i++) {
		listeBoutonVehicule[i].disabled = val;
	}
}

async function donnerListeImages(nom) {
	const dossier = "./res/collection/"; // a changer
	let listeImages = [];

	for (let i = 1; i < 6; i++) {
		let image = dossier + nom + i + ".jpg";
		
		let reponse = await fetch(image, { method: "HEAD" });
		try { 
			if (reponse.ok) {
			  listeImages.push(image);
			} else {
			}
		} catch {
			console.log("Erreur réseau ou fichier inaccessible")
		} ;
	}

	return listeImages;
}

async function initialiserImagesVehicule(nom) {
	const divImageExplication = document.querySelector("#conteneurImageExplication");
	let listeImages = await donnerListeImages(nom);
	divImageExplication.innerHTML = '';

	for (let i = 0; i < listeImages.length; i++) {
		const img = document.createElement('img');
		img.src = listeImages[i];

		divImageExplication.appendChild(img);
	}
}

