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
  import { direction } from '../StoreCharacters.js';
  import { leftSide } from '../StoreCharacters.js';
  import { bottomSide } from '../StoreCharacters.js';
  import { ligAlien } from '../StoreCharacters.js';
  import { colAlien } from '../StoreCharacters.js';
  import { previousLigAlien } from '../StoreCharacters.js';
  import { previousColAlien } from '../StoreCharacters.js';
  import { leftAlien } from '../StoreCharacters.js';
  import { topAlien } from '../StoreCharacters.js';
  import { retry } from '../Store.js';
  import { directionAlien } from '../StoreCharacters.js';
  // onMount
  onMount(async () => {
    document.getElementById('backToMenu').style.opacity = 1;
  });
  // onDestroy
  onDestroy(() => {
    document.getElementById('backToMenu').style.opacity = 0;
    $ligAlien = 1;
    $colAlien = 1;
    $bottomSide = 1;
    $leftSide = 1;
    document.removeEventListener('keydown', event, false);
    window.cancelAnimationFrame(MyRequest);
  });
  // variables
  let gameOver = false;
  let down = false;
  let up = false;
  let right = false;
  let left = false;
  let collision;
  let alienSpeed = 2.5; 
  let alienDamage = 10; 

  // -------------------- ALIEN  -------------------------- //
  function alien(speed) {
    this.speed = speed;
    this.advance = function () {
      $previousLigAlien = $ligAlien;
      $previousColAlien = $colAlien;
      if ($colAlien < 9 && $ligAlien === 1) {
        if ($leftAlien === 50) {
          $leftAlien = 0;

          $colAlien++;
        } else {
          $directionAlien = 'step-right';
          $leftAlien += this.speed;
        }
      } else if ($colAlien === 9 && $ligAlien < 5) {
        $leftAlien = 0;
        if ($topAlien === 50) {
          $topAlien = 0;

          $ligAlien++;
        } else {
          $directionAlien = 'step-down';
          $topAlien += this.speed;
        }
      } else if ($ligAlien === 5 && $colAlien > 1) {
        $topAlien = 0;
        if ($leftAlien === -50) {
          $leftAlien = 0;

          $colAlien--;
        } else {
          $directionAlien = 'step-left';
          $leftAlien -= this.speed;
        }
      } else if ($colAlien === 1 && $ligAlien > 1) {
        $leftAlien = 0;
        if ($topAlien === -50) {
          $topAlien = 0;

          $ligAlien--;
        } else {
          $directionAlien = 'step-up';
          $topAlien -= this.speed;
        }
      }
    };
  }
  const drawMoveAlien = () => {
    $tableau[$previousLigAlien][$previousColAlien] = 0;
    $tableau[$ligAlien][$colAlien] = 'z';
  };
  // -------------------- ALIEN  -------------------------- //



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
  }

  document.addEventListener('keydown', event, false);
  document.addEventListener('keyup', event => {
    switch (event.key) {
      case 'ArrowDown':
        down = false;
        $direction = 'down';
        break;
      case 'ArrowUp':
        up = false;
        $direction = 'up';
        break;
      case 'ArrowLeft':
        left = false;
        $direction = 'left';
        break;
      case 'ArrowRight':
        right = false;
        $direction = 'right';
        break;
    }
  });
  // -------------------- HERO -------------------------- //

  

  // -------------------- CHECK COLLISION -------------------------- //
  function checkCollision() {
    if ($ligAlien === $ligHero && $colAlien === $colHero - 1){
      collision = true;
    } else if($ligAlien + 1 === $ligHero && $colAlien === $colHero && $bottomSide > 3){
      collision = true;
    } else if($colAlien=== $colHero +1 && $ligAlien === $ligHero && $leftSide > 3 )
    {
      collision = true;
    } else {
      collision = false; 
    }
  }
  // -------------------- CHECK COLLISION -------------------------- //



  // -------------------- COUNT SCORE -------------------------- //
  let count=0
  $: realCount = Math.floor(count/10)
  $: pv = 70 - realCount*alienDamage
  let life 

    function Score(){
      if(collision){
      count = (count + 1); 
      }

      life = document.querySelector('.life')
      life.style.width = pv + '%'

      if(pv <= 0){
        gameOver=true; 
      } else if(pv > 0 && pv < 25){
        life.style.backgroundColor='red'; 
      } else if(pv > 24 && pv < 50){
        life.style.backgroundColor='orange'; 
      }
    }
  // -------------------- COUNT SCORE -------------------------- //




  // -------------------- GAMELOOP -------------------------- //
  var iti = new alien(alienSpeed); //ajouter les coordonnées x et y en argument !

  const update = () => {
    updateMoveHero();
    iti.advance(); 
  };

  const draw = () => {
    drawMoveHero();
    drawMoveAlien();
  };

  var MyRequest;
  const gameLoop = () => {
    if(!gameOver){
      update();
      draw();
      checkCollision();
      Score(); 
      MyRequest = requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(MyRequest)
    }
  };
  MyRequest = window.requestAnimationFrame(gameLoop);
  // -------------------- GAMELOOP -------------------------- //

  function handleRetry() {
    gameOver = false;
    $retry = !$retry;
    $ligHero = $colHero = 5; 
  }

</script>

<div class="energybar flex justify-center">
  <div class="bar rounded-lg h-12 w-1/5 bg-transparent border border-white">
    <div class="life rounded-l-lg bg-green-300 "></div>
  </div>
</div>
<div class="flex flex-col justify-around h-auto w-full">
  <div class="gamefield">
    <Tableau>
      {#each $tableau as lig}
        <tr class="ligne">
          {#each lig as col}
            <Case idCase={col}/>
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
  .life{
    width : 50%;
    height:100%; 
    transition:0.5s; 
  }
</style>
