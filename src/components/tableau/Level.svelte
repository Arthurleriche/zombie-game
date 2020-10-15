<script>
  // components
  import Tableau from './Tableau.svelte';
  import Case from './Case.svelte';
  // svelte
  import { onDestroy, onMount } from 'svelte';
  // stores
  import { tableau } from '../StoreTable.js';
  import { nbrCol } from '../StoreTable.js';
  import { nbrLig } from '../StoreTable.js';
  import { ligHero } from '../StoreCharacters.js';
  import { colHero } from '../StoreCharacters.js';
  import { previousLigHero } from '../StoreCharacters.js';
  import { previousColHero } from '../StoreCharacters.js';
  import { step } from '../StoreCharacters.js';
  import { direction } from '../StoreCharacters.js';
  import { leftSide } from '../StoreCharacters.js';
  import { bottomSide } from '../StoreCharacters.js';
  import { ligAlien } from '../StoreCharacters.js';
  import { colAlien } from '../StoreCharacters.js';
  import {leftAlien} from '../StoreCharacters.js'; 
  import {topAlien} from '../StoreCharacters.js'; 
  import { retry } from '../Store.js';
  // onMount
  onMount(async () => {
    console.log('Mount Level');
    document.getElementById('backToMenu').style.opacity = 1;
  });
  // onDestroy
  // onDestroy(() => clearInterval(interval2));
  onDestroy(() => {
    document.getElementById('backToMenu').style.opacity = 0;
    console.log('Destroy Level');
    $ligAlien = 1;
    $colAlien = 1;
    $bottomSide = 1;
    $leftSide = 1;
    document.removeEventListener('keydown', event, false);
    window.cancelAnimationFrame(MyRequest); 
  });
  // variables
  let gameOver = false;
  let stp = 2;
  let down = false;
  let up = false;
  let right = false;
  let left = false;

  // -------------------- ALIEN  -------------------------- //
  function alien(speed){

    this.speed = speed ;

    this.advance = function(){
      if($colAlien < 9 && $ligAlien ===1){
      if($leftAlien === 50){
        $leftAlien = 0
        $tableau[$ligAlien][$colAlien]=0
        $colAlien++
        $tableau[$ligAlien][$colAlien]='z'
        console.log($colAlien)
      } else {
        $leftAlien += this.speed; 
      }
      console.log('DROITE'+ $ligAlien + $colAlien)
    } else if ($colAlien ===9 && $ligAlien < 5) {
      $leftAlien = 0
      if($topAlien===50){
        $topAlien = 0
        $tableau[$ligAlien][$colAlien]=0
        $ligAlien++
        $tableau[$ligAlien][$colAlien]='z'
      } else {
        $topAlien += this.speed; 
      }
      console.log('DESCEND'+ $ligAlien + $colAlien)

    } else if ($ligAlien === 5 && $colAlien >1){
      $topAlien = 0
      if($leftAlien===-50){
        $leftAlien = 0
        $tableau[$ligAlien][$colAlien]=0
        $colAlien--
        $tableau[$ligAlien][$colAlien]='z'
      } else {
        $leftAlien -= this.speed; 
      }
      console.log('GAUCHE'+ $ligAlien + $colAlien)

    } else if ($colAlien === 1 && $ligAlien > 1  ) {
      console.log('HAUT'+ $ligAlien + $colAlien)
        $leftAlien = 0
        if($topAlien===-50){
          $topAlien = 0
          $tableau[$ligAlien][$colAlien]=0
          $ligAlien--
          $tableau[$ligAlien][$colAlien]='z'
        } else {
          $topAlien -= this.speed; 
        }
        console.log('HAUT'+ $ligAlien + $colAlien)
    }
  }; 
}
    
  // -------------------- ALIEN  -------------------------- //

  let level = [];
  function parseFile() {
    // let fileobj = event.target.files[0];
    let file = new File(['level1.text'], './level1.txt');
    console.log(file);
    let fr = new FileReader();
    fr.onload = function (event) {
      level.push(fr.result);
    };
    fr.readAsText(file);
    console.log(index);
    console.log(hero);
  }

  // -------------------- HERO -------------------------- //
  const updateMoveHero = () => {
    $previousLigHero = $ligHero;
    $previousColHero = $colHero;
    switch (true) {
      case down:
        $direction = 'step-down';
        if ($ligHero >= $nbrLig - 2 && $bottomSide <= 5) {
          $direction = 'down';
        } else {
          $bottomSide = $bottomSide - 1;
        }
        if ($bottomSide === 0) {
          $ligHero++;
          $bottomSide = 49;
        }
        break;
      case up:
        $direction = 'step-up';
        if ($ligHero <= 1) {
          $direction = 'up';
        } else {
          $bottomSide = $bottomSide + 1;
          if ($bottomSide === 50) {
            $ligHero--;
            $bottomSide = 1;
          }
        }
        break;
      case left:
        $direction = 'step-left';
        if ($colHero <= 1 && $leftSide <= 5) {
          $direction = 'left';
        } else {
          $leftSide = $leftSide - 1;
          if ($leftSide === 0) {
            $colHero--;
            $leftSide = 49;
          }
        }
        break;
      case right:
        $direction = 'step-right';
        if ($colHero >= $nbrCol - 1) {
          $direction = 'right';
        } else {
          $leftSide = $leftSide + 1;
          if ($leftSide === 50) {
            $colHero++;
            $leftSide = 1;
          }
        }
        break;
    }
    if (!down && !up && !left && !right) {
      $direction = 'down';
    }
  };

  const drawMoveHero = () => {
    $tableau[$previousLigHero][$previousColHero] = 0;
    $tableau[$ligHero][$colHero] = 'p';
  };

  function event(event) {
    switch (event.key) {
      case 'ArrowDown':
        if (down) return;
        down = true;
        left = false;
        up = false;
        right = false;
        break;
      case 'ArrowUp':
        if (up) return;
        down = false;
        left = false;
        up = true;
        right = false;
        break;
      case 'ArrowLeft':
        if (left) return;
        down = false;
        left = true;
        up = false;
        right = false;
        break;
      case 'ArrowRight':
        if (right) return;
        down = false;
        left = false;
        up = false;
        right = true;
        break;
    }
    // mooveHero(event);
  }

  document.addEventListener('keydown', event, false);
  document.addEventListener('keyup', event => {
    switch (event.key) {
      case 'ArrowDown':
        console.log('DEDEDEWN')
        down = false;
        $step = 1;
        break;
      case 'ArrowUp':
        up = false;
        $step = 1;
        break;
      case 'ArrowLeft':
        left = false;
        $step = 1;
        break;
      case 'ArrowRight':
        right = false;
        $step = 1;
        break;
    }
  });
  // -------------------- HERO -------------------------- //
  // -------------------- GAMELOOP -------------------------- //

  var iti = new alien(5); //ajouter les coordonnées x et y en argument ! 
  const update = () => {
    updateMoveHero();

    if(collision===true){
      collision=false; 
    } else {
      iti.advance(); 
    }
    checkCollision(); 
  };

  const draw = () => {
    drawMoveHero();
  };

  var MyRequest; 
  const gameLoop = () => {
    update();
    draw();
    console.log('RAFFFFF')
    MyRequest = requestAnimationFrame(gameLoop);
  };
  MyRequest = window.requestAnimationFrame(gameLoop);
  // -------------------- GAMELOOP -------------------------- //

  function handleRetry() {
    gameOver = false;
    console.log('Retry');
    console.log('retry' + $retry);
    $retry = !$retry;
    console.log($retry);
  }

  // -------------------- CHECK COLLISION -------------------------- //
  var collision = false; 
  function checkCollision(){
    if($ligAlien === $ligHero && $colAlien === $colHero){
      console.log('COLLISION')
      collision = true; 

    }
  }



  // -------------------- CHECK COLLISION -------------------------- //
</script>


<div class="flex flex-col justify-around h-auto w-full">
  <div class="gamefield">
    <Tableau>
      {#each $tableau as lig}
        <tr class="ligne">
          {#each lig as col}
            <Case idCase={col} alienStep={stp} />
          {/each}
        </tr>
      {/each}
      {#if gameOver}
        <div class=" gameover">
          <p>GAMEOVER</p>
          <button
            on:click={handleRetry}
            class="m-auto rounded-lg bg-black text-white retry h-16 w-40">RETRY</button>
        </div>
      {/if}
    </Tableau>
  </div>
</div>


<style>
  .retry {
    border: 3px solid black;
  }
  .gameover {
    width: 11rem;
    height: 5rem;
    margin-right: auto;
    margin-left: auto;
    margin-top: -50%;
    font-weight: bold;
    color: white;
    font-size: 2rem;
    animation: gameoverZoom 3s linear 1;
  }
  @keyframes gameoverZoom {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.5);
    }
  }
</style>