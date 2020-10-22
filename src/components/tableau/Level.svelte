<script>
  // components
  import Tableau from './Tableau.svelte';
  import Case from './Case.svelte';
  import Debug from '../debug_mode/debug.svelte';
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
  let development = process.env.isDev;
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
        if (collision && $ligHero < $ligAlien && $colHero < $colAlien + 2) {
          $direction = 'down';
        } else {
          if ($ligHero >= $nbrLig - 2 && $bottomSide <= 5) {
            $direction = 'down';
          } else {
            $bottomSide = $bottomSide - 1;
          }
          if ($bottomSide === -25) {
            $ligHero++;
            $bottomSide = 25;
          }
        }
        break;
      case up:
        $direction = 'step-up';
        if (collision && $ligHero > $ligAlien && $colHero < $colAlien + 2) {
          $direction = 'up';
        } else {
          if ($ligHero <= 1 && $bottomSide >= 5) {
            $direction = 'up';
          } else {
            $bottomSide = $bottomSide + 1;
            if ($bottomSide === 25) {
              $ligHero--;
              $bottomSide = -25;
            }
          }
        }
        break;
      case left:
        $direction = 'step-left';
        if (
          collision &&
          $ligAlien - 2 <= $ligHero &&
          $ligHero <= $ligAlien + 2 &&
          $colHero <= $colAlien + 2 &&
          $colHero > $colAlien
        ) {
          $direction = 'left';
        } else {
          if ($colHero <= 1 && $leftSide <= 5) {
            $direction = 'left';
          } else {
            $leftSide = $leftSide - 1;
            if ($leftSide === -25) {
              $colHero--;
              $leftSide = 25;
            }
          }
        }
        break;
      case right:
        $direction = 'step-right';
        if (collision && $ligHero < $ligAlien + 2 && $colHero < $colAlien) {
          $direction = 'right';
          console.log('OUI ARSENE - ENNEMI A DROITURE ');
        } else {
          if ($colHero >= $nbrCol - 1 && $leftSide >= 5) {
            $direction = 'right';
          } else {
            $leftSide = $leftSide + 1;

            if ($leftSide === 25) {
              $colHero++;
              $leftSide = -25;
            }
          }
        }
        break;
    }
  };
  console.log(process.env.isDev);
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

  // -------------------- RETRY  -------------------------//
  function handleRetry() {
    gameOver = false;
    $retry = !$retry;
    $ligHero = $colHero = 5;
  }
  // -------------------- RETRY  -------------------------//

  // -------------------- CALCULATE POSITION -------------------------- //
  let xHero;
  let yHero;
  let xAlien;
  let yAlien;
  var rectHero;
  var rectAlien;
  let dx2;
  let dy2;
  let distHeroAlien;
  let heroDiv;
  let alienDiv;

  function elementPosition() {
    // HERO
    rectHero = heroDiv.getBoundingClientRect();
    xHero = rectHero.left;
    yHero = rectHero.top;
    // ALIEN
    rectAlien = alienDiv.getBoundingClientRect();
    xAlien = rectAlien.left;
    yAlien = rectAlien.top;
    //DISTANCE
    distance(xAlien, xHero, yAlien, yHero);
  }

  function distance(xa, xh, ya, yh) {
    distHeroAlien = Math.sqrt((xa - xh) * (xa - xh) + (ya - yh) * (ya - yh));
  }

  // -------------------- CALCULATE POSITION -------------------------- //

  // -------------------- CHECK COLLISION -------------------------- //
  function checkCollision() {
    if (distHeroAlien < 44) {
      collision = true;
    } else {
      collision = false;
    }
  }
  // -------------------- CHECK COLLISION -------------------------- //

  // -------------------- COUNT SCORE -------------------------- //
  let count = 0;
  $: realCount = Math.floor(count / 10);
  $: pv = 70 - realCount * alienDamage;
  let life;

  function Score() {
    if (collision) {
      count = count + 1;
    }

    life = document.querySelector('.life');
    life.style.width = pv + '%';

    if (pv <= 0) {
      gameOver = true;
    } else if (pv > 0 && pv < 25) {
      life.style.backgroundColor = 'red';
    } else if (pv > 24 && pv < 50) {
      life.style.backgroundColor = 'orange';
    }
  }
  // -------------------- COUNT SCORE -------------------------- //
  // -------------------- BOOST -------------------------- //
  // let compteur = 0;
  // let compteurSecond = 0;
  // const boostHero = () => {
  //   compteur++;
  //   if (compteur === 59) {
  //     compteur = 0;
  //     compteurBis++;
  //   }
  //   console.log(compteurBis);
  //   if (compteurBis === 10) {
  //   }
  // };
  // -------------------- BOOST -------------------------- //

  // -------------------- GAMELOOP -------------------------- //
  var iti = new alien(alienSpeed); //ajouter les coordonnées x et y en argument !

  const update = () => {
    // boostHero();
    // console.log(process.env.NODE_ENV);
    updateMoveHero();
    if (!collision) {
      iti.advance();
    }
  };

  const draw = () => {
    drawMoveHero();
    if (!collision) {
      drawMoveAlien();
    }
    //We put those assignments here
    //because heroDiv & alienDiv are MOUNTED juste after drawMove functions which changes value in $tableau by 'p' or 'z'
    heroDiv = document.getElementById('heroDiv');
    alienDiv = document.getElementById('alienDiv');
  };
  // if (process.env.NODE_ENV === 'production') {
  //   console.log('je suis en prod');
  // } else {
  //   console.log('je suis sur le serve');
  // }

  var MyRequest;
  const gameLoop = () => {
    if (!gameOver) {
      update();
      draw();
      elementPosition();
      checkCollision();
      // Score();
      MyRequest = requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(MyRequest);
    }
  };
  MyRequest = window.requestAnimationFrame(gameLoop);
  // -------------------- GAMELOOP -------------------------- //
</script>

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
  .life {
    width: 50%;
    height: 100%;
    transition: 0.5s;
  }

  .level {
    position: relative;
  }
  .debug-mode {
    position: absolute;
    top: 125px;
    left: 30px;
  }
</style>

<div class="level">
  {#if development}
    <div class="debug-mode">
      <Debug>
        <div class="flex">
          <div class="HeroPos h-auto w-40 border border-black bg-red-400">
            <span class="bg-red-600">Hero</span>
            <br />
            x:
            {xHero}
            <br />
            y:
            {yHero}
          </div>
          <div class="AlienPos h-auto w-40 border border-black bg-orange-400">
            <span class="bg-orange-600">Alien</span>
            <br />
            x:
            {xAlien}
            <br />
            y:
            {yAlien}
          </div>
        </div>
        <div class="distance w-full ">Distance :{distHeroAlien}</div>
      </Debug>
    </div>
  {/if}
  <div class="energybar flex justify-center">
    <div class="bar rounded-lg h-12 w-1/5 bg-transparent border border-white">
      <div class="life rounded-l-lg bg-green-300 " />
    </div>
  </div>
  <div class="flex flex-col justify-around h-auto w-full">
    <div class="gamefield">
      <Tableau>
        {#each $tableau as lig}
          <tr class="ligne">
            {#each lig as col}
              <Case idCase={col} />
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
</div>
