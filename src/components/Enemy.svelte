<script>
  import { Script } from 'vm';
  //////////// D R A W  E N E M Y //////////

  // var enemyLoop;

  // function createEnemies() {
  // 	enemyLoop = setInterval( drawEnemy,500, tableau);
  // }

  // function drawEnemy(newTab){
  // 	let randomLine = getRandom(1,40);
  // 	let randomCol = getRandom(1,60);
  // 	newTab[randomLine][randomCol] = 4;

  // 	let monuk = setInterval(enemyWalk, 600)

  // 	function enemyWalk(){

  // 		if(randomLine < 0){
  // 			clearInterval(monuk);
  // 			} else {
  // 			newTab[randomLine][randomCol] = 0;
  // 			randomLine--
  // 			newTab[randomLine][randomCol] = 4;
  // 			showTab(newTab)
  // 			console.log("OKKKK")
  // 		}
  // 	}
  // }

  // createEnemies();

  ////	// D R A W  E N E M Y //////////

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
  }

  //
</script>
