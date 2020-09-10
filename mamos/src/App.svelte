




<body class=" flex flex-col h-auto  " >
<h1 class="text-center"> ZOMBIE GAME </h1>
<h2 class="text-center"> Plateau Zombie Game - Test 1 (grille : 900x600, carré=10x10)  </h2>

<div id="container" class=" containerSize border border-blue-500  m-auto">
	<!-- <Grid></Grid> -->
</div>
<!-- containerSize = 900 x 600  -->




</body>
<Tailwindcss />

<script>
	import Tailwindcss from './Tailwindcss.svelte'; 
	// import Grid from './Grid.svelte';

	const lines = 5; 
	const columns = 3; 


	window.onload = function(){
		//FONCTION QUI CREE UNUE GRILLE (mémoire)
		var grid; 
		function createGrid(lines, columns, car ="x"){   
			grid = [];
			for(var i = 0; i < lines; i++){
				let ligne = [];
				for(var j=0; j < columns; j++){
					ligne.push(car);	
				}
			grid.push(ligne);
			}
			console.log(grid);
			return grid; 
		}	
		createGrid(50,50, "x");


		//FONCTION QUI DESSINE UNE GRILLE  (à chaque i,j de grid(i,j) on crée une div (i,j) )
		let container = document.getElementById('container');

		function drawGrid(nombreDeColonnes,nombreDeLignes){
			
			
			for(let i = 0; i < nombreDeLignes; i++){

				let newGrille = document.createElement('div');
				newGrille.setAttribute("id","grille" + '-' + i);
				newGrille.setAttribute("class","flex m-0 p-0");
				container.append(newGrille);
				for(let j = 0; j < nombreDeColonnes; j++){
					// couleur aléatoire 
					// var color = "#" + Math.floor(Math.random() * 16777215).toString(16);//couleur aléatoire 
					var color = "blue";
					let newSquare = document.createElement('div');
					newSquare.textContent = '';
					newSquare.setAttribute("id","square"+'('+ i +','+j +')');
					newSquare.setAttribute("class", "  squareSize m-0 p-0 border border-white")
					newSquare.setAttribute("style", "background-color:"+color)
					newGrille.append(newSquare);
					//squareSize = 30x30 
				}
			}			
		}
		drawGrid(15,10);	


		var hero = document.getElementById('square(1,0)'); // (i,j) = (1,0)
		hero.setAttribute("style", "background-color:black");
		var position = [1,0];



		document.addEventListener('keydown', handleKey);

		function handleKey(e) {
			var key = e.keyCode;
			//RIGHT 
			if(key == 39){
			position[1] += 1;
			hero.setAttribute("style", "background-color:blue;");
			console.log(position);

			hero = document.getElementById('square'+"(" + position[0] + "," + position[1] +")")
			hero.setAttribute("style", "background-color:orange;");
			}

			//LEFT
			if(key == 37){
			position[1] -= 1;
			hero.setAttribute("style", "background-color:blue;");
			console.log(position);

			hero = document.getElementById('square'+"(" + position[0] + "," + position[1] +")")
			hero.setAttribute("style", "background-color:orange;");
			}

			//DOWN 
			if(key == 40){
				position[0] += 1;
				hero.setAttribute("style", "background-color:blue;");
				console.log(position);

				hero = document.getElementById('square'+"(" + position[0] + "," + position[1] +")")
				hero.setAttribute("style", "background-color:orange;background: url('./img/nico.png');");
			}

			// UP 
			if(key == 38){
				position[0] -= 1;
				hero.setAttribute("style", "background-color:blue;");
				console.log(position);

				hero = document.getElementById('square'+"(" + position[0] + "," + position[1] +")")
				hero.setAttribute("style", "background-color:orange;");

			}


			
			// hero.setAttribute("style", "background-color:red");	
  			// container.textContent += ` ${e.code}`;
		}




		// FONCTION QUI DESSINE LE HERO 
	


		

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

	canvas {
		/* CANVAS.WIDTH */
		width: 900px; 
		/* CANVAS HEIGHT */
		height: 600px;
	}
</style>

