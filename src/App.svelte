
<body class=" flex flex-col h-auto  " >
	<h1 class="text-center"> ZOMBIE GAME </h1>
	<h2 class="text-center"> Plateau Zombie Game - Test 1 (grille : 900x600, carré=10x10)  </h2>
	
	<div id="container" class=" containerSize border border-blue-500  m-auto">
		<div id="tableau">
		</div>
	</div>
	
	<div id="ball" class="bg-pink-600 h-12 w-12" >boule</div>
	

	<!-- containerSize = 900 x 600  -->

</body>
	<Tailwindcss />
<script>

	import Tailwindcss from './Tailwindcss.svelte'; 

	let tableau = []
	const lignes = 20
	const colonnes = 30

	window.onload = function(){

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


		const showTab = (tab) => {
			// tab[0][0]=1;
			// tab[1][4] = 2;
			// tab[3][1]=2;
			const jeu = document.querySelector('#tableau'); 
			let content = "<table>";
			for(let i=0; i<lignes; i++){
				content += "<tr class='relative'>";
				for(let j=0; j<colonnes; j++){
					if(tab[i][j] === 0){
						content += "<td class='border border-blue-500 bg-black squareSize'>"
					}
					if(tab[i][j] === 1){
						content += "<td class=' z-0 absolute border border-blue-500 bg-red-600 squareSize'>"
						content += "<img src= './img/nico.png' class='' alt = 'nico' style='z-index:1;'' />"
						
					}
					if(tab[i][j] === 2){
						content += "<td class='border border-blue-500 bg-blue-600 squareSize'>"
					}
					if(tab[i][j] === 3){

						content += "<td class='border border-blue-500 bg-yellow-600 squareSize'>"
					}

					if(tab[i][j] === 4){

						content += "<td class='border border-yellow-500 bg-white squareSize'>"
					}
				}
			}
			
			jeu.innerHTML = content
		}	


		const initGame = (newTab) => { 
			newTab[0][0] = 1
			// newTab[0][1] = 1
			// newTab[1][0] = 1
			// newTab[1][1] = 1
			showTab(newTab)
		}


//////////// B A S T O S /////////////////////

		function bastos(newTab, col, lig, lastE){

			if(event.key ==="a"){
				player(gun);
			}

			if(event.key ==="a" && lastE === "ArrowDown"){
				player(gun);
				let ligne = lig + 1
				newTab[ligne][col] = 3
				let myVar = setInterval( bastosDown, 80);


				function bastosDown() {
					if(ligne == 39){  //colonnes - 1
						newTab[ligne][col] = 2 
						clearInterval(myVar)
					} else {
						newTab[ligne][col] = 2
						ligne++
						newTab[ligne][col] = 3
						showTab(newTab)
						
					}	
				}	
				ligne = lig +1; 
				colonne = col; 	
			}


			if(event.key ==="a" && lastE === "ArrowRight"){
				let colonne = col + 1
				newTab[lig][colonne] = 3
				let myVar = setInterval( bastosRight, 30)

				function bastosRight(){
					if(colonne == 59){
						newTab[lig][colonne] = 2 
						clearInterval(myVar)
					} else {
						newTab[lig][colonne] = 2
						colonne++
						newTab[lig][colonne] = 3
						showTab(newTab)
					}

				}
				colonne = col + 1;
				ligne = lig 
			}

			if(event.key ==="a" && lastE === "ArrowUp"){
				let ligne = lig - 1
				newTab[ligne][col] = 3
				let myVar = setInterval( bastosUp, 30)

				function bastosUp(){
					if(ligne == 0){
						newTab[ligne][col] = 2 
						clearInterval(myVar)
					} else {
						newTab[ligne][col] = 2
						ligne--
						newTab[ligne][col] = 3
						showTab(newTab)
					}

				}
				ligne = lig - 1 
				colonne = col 
			}



			if(event.key ==="a" && lastE === "ArrowLeft"){
				let colonne  = col - 1
				newTab[lig][colonne] = 3
				let myVar = setInterval( bastosLeft, 30)

				function bastosLeft(){
					if(colonne == 0){
						newTab[lig][colonne] = 2 
						clearInterval(myVar)
					} else {
						newTab[lig][colonne] = 2
						colonne--
						newTab[lig][colonne] = 3
						showTab(newTab)
					}

				}
				colonne = col - 1
				ligne = lig 
			}
			
		}

		const gun = new Audio('./audios/gun.mp3')
		const player = (audio) => {
			// audio.pause()
			audio.currentTime=0;
			audio.play()
		}

//////////// B A S T O S /////////////////////



//////////// D R A W  E N E M Y //////////


		var enemyLoop;

		function createEnemies() {
			enemyLoop = setInterval( drawEnemy,500, tableau);
		}

		function drawEnemy(newTab){
			let randomLine = getRandom(1,40); 
			let randomCol = getRandom(1,60);
			newTab[randomLine][randomCol] = 4;

			let monuk = setInterval(enemyWalk, 600)
			
		
			function enemyWalk(){

				if(randomLine < 0){
					clearInterval(monuk);
					} else {
					newTab[randomLine][randomCol] = 0;
					randomLine--
					newTab[randomLine][randomCol] = 4;
					showTab(newTab)
					console.log("OKKKK")
				}
			}
		}

		createEnemies();


////	// D R A W  E N E M Y //////////


////	///  M O O V E P L A Y E R //////////////
		let c = 0;
		let l = 0; 
			const moovePlayer = (event, newTab) => {
				if(event.key === "ArrowDown" && l < lignes - 1 ){
					tableau [l][c] = 2;
					// tableau [l][c+1] = 2
					// tableau [l+1][c] = 2
					// tableau [l+1][c+1] = 2 
				l++;
					newTab[l][c] = 1;
					// tableau [l][c+1] = 1
					// tableau [l+1][c] = 1
					// tableau [l+1][c+1] = 1
				}
			
				if(event.key === "ArrowUp" && l>=1 ){
					tableau[l][c] = 2;
					// tableau [l][c+1] = 2
					// tableau [l+1][c] = 2
					// tableau [l+1][c+1] = 2 
					l--;
					newTab[l][c] = 1;
					// tableau [l][c+1] = 1
					// tableau [l+1][c] = 1
					// tableau [l+1][c+1] = 1
				}
			
				if(event.key === "ArrowRight" && c < colonnes - 1 ){
					tableau[l][c] = 2;
					// tableau [l][c+1] = 2
					// tableau [l+1][c] = 2
					// tableau [l+1][c+1] = 2 
					c++;
					newTab[l][c] = 1;
					// tableau [l][c+1] = 1
					// tableau [l+1][c] = 1
					// tableau [l+1][c+1] = 1
				}
			
				if(event.key === "ArrowLeft" && c>=1){
					tableau[l][c] = 2;
					// tableau [l][c+1] = 2
					// tableau [l+1][c] = 2
					// tableau [l+1][c+1] = 2 
					c--;
					newTab[l][c] = 1;
					// tableau [l][c+1] = 1
					// tableau [l+1][c] = 1
					// tableau [l+1][c+1] = 1
				}

				updateGame(newTab);
			
			}
///////////  M O O V E P L A Y E R //////////////




/////////// I N I T      G A M E ///////////////
			initGame(tableau);
/////////// I N I T      G A M E ///////////////


			const updateGame = (newTab) => {
			showTab(newTab); 
			}


			let array=[]
			let lastE=""
			document.addEventListener('keydown', (event) =>{
				array = [event.key, ...array]  // array = [dernier, avant-dernier, etc..]
				console.log(event.key)
				console.log(array)
				array.splice(2)   //array = [dernier, avant-dernier]
				console.log(array)
				moovePlayer(event, tableau);
				bastos(tableau,c,l, array[1]);
			})



			function getRandom(min, max) {
  				min = Math.ceil(min);
				max = Math.floor(max);
				let randomNum = Math.floor(Math.random() * (max - min +1)) + min;
				return randomNum; 

			}

    	}  //-------- W I N D O W . O N L O A D ------- 	
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
	

	