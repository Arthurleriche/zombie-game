




<body class=" flex flex-col h-auto  " >
<h1 class="text-center"> ZOMBIE GAME </h1>
<h2 class="text-center"> Plateau Zombie Game - Test 1 (grille : 900x600, carré=10x10)  </h2>

<div id="container" class=" containerSize border border-blue-500  m-auto">
	<div id="tableau">
	</div>
</div>
<!-- containerSize = 900 x 600  -->




</body>
<Tailwindcss />

<script>
	import Tailwindcss from './Tailwindcss.svelte'; 



	let tableau = []
	const lignes = 60
	const colonnes = 90

	window.onload = function(){

	


	

	// Fonction qui créer le tableau (mémoire)
	const createTab = (lignes,colonnes,car= 0) => {
		let tab =[]
		for(let i =0; i<lignes;i++){
			const ligne = []
			for(let j=0; j<colonnes; j++){
				ligne.push(car);
			}
			tab.push(ligne)
		}
		return tab;
	}

	tableau = createTab(lignes,colonnes);
	// console.log(tableau)
	
	

	// Fonction qui dessine le tableau (DOM)
	const showTab = (tab) => {
		// tab[0][0]=1;
		// tab[1][4] = 2;
		// tab[3][1]=2;
		const jeu = document.querySelector('#tableau'); //on met le jeu dans la div#tableau
		let content = "<table>";
		for(let i=0; i<lignes; i++){
			content += "<tr>";
			for(let j=0; j<colonnes; j++){
				// content += "<td class='border border-blue-500 squareSize'>"
				if(tab[i][j] === 0){
					content += "<td class='border border-blue-500 bg-black squareSize'>"
				}
				if(tab[i][j] === 1){
					content += "<td class='border border-blue-500 bg-red-600 squareSize'>"
				}
				if(tab[i][j] === 2){
					content += "<td class='border border-blue-500 bg-blue-600 squareSize'>"
				}
			}
		}
		jeu.innerHTML = content
	}	
	


	


	// Fonction qui commence le jeu 
	const initGame = (newTab) => { 
		newTab[0][0] = 1
		showTab(newTab)
	}

	// Fonction qui update le jeu en fonction du déplacement du héro 
	const updateGame = (newTab) => {
		showTab(newTab); 
		console.log(newTab);
	}

	




	let c = 0;
	let l = 0;
	//Fonction qui bouge le Héro 
	const moovePlayer = (event, newTab) => {
		if(event.key === "ArrowDown" && l < lignes - 1 ){
			tableau [l][c] = 2;
		l++;
			newTab[l][c] = 1;
		}

		if(event.key === "ArrowUp" && l>=1 ){
			tableau[l][c] = 2;
			l--;
			newTab[l][c] = 1;
		}

		if(event.key === "ArrowRight" && c < colonnes - 1 ){
			tableau[l][c] = 2;
			c++;
			newTab[l][c] = 1;
		}

		if(event.key === "ArrowLeft" && c>=1){
			tableau[l][c] = 2;
			c--;
			newTab[l][c] = 1;
		}

		//A chaque fois qu'on change le jeu, il faut le mettre à jour 
		// Création de la fonction UpdateGame 
		updateGame(newTab);

	}

	
	initGame(tableau);
	document.addEventListener('keydown', () =>{
		moovePlayer(event, tableau);
	})
}

</script>





<style>
	main {
		text-align: center;
		/* padding: 1em; */
		max-width: 240px;
		margin: 0 auto;
		/* background: no-repeat url('./img/spaceship.jpg'); */
		background-size: cover;
	}

	h1{
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	h2{
		color: black;
		/* text-transform: uppercase; */
		font-size: 1.5em;
		font-weight: 100;

	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}


</style>

