<script>
  // components
  import Tableau from './Tableau.svelte';
  import Case from './Case.svelte';

  // function svelte
  import { onMount } from 'svelte';
  // stores
  import { tableau } from '../StoreTable.js';
  import { nbrCol } from '../StoreTable.js';
  import { nbrLig } from '../StoreTable.js';

  import { ligHero } from '../StoreCharacters.js';
  import { colHero } from '../StoreCharacters.js';
  import { step } from '../StoreCharacters.js';
  import { direction } from '../StoreCharacters.js';
  import { leftSide } from '../StoreCharacters.js';
  import { bottomSide } from '../StoreCharacters.js';

  import { ligAlien } from '../StoreCharacters.js';
  import { colAlien } from '../StoreCharacters.js';

<<<<<<< HEAD
  onMount(async () => {});
=======
  // onMount 
  onMount(async () => {
    console.log('didMount Level');
    // $tableau[$ligHero][$colHero] = 'p';
  });




  let gameOver = false; 
  // -------------------- ALIEN -------------------------- //
  const interval = setInterval(walkEnemy, 300)
    let stp=2;
    function walkEnemy(){
      if($colAlien === 9 && $ligAlien<6){
        $tableau[$ligAlien][$colAlien]=0; 
        $ligAlien++; 
        $tableau[$ligAlien][$colAlien]='z'; 
      } 
      else if($colAlien <= 9 && $colAlien > 4 && $ligAlien === 6){
        $tableau[$ligAlien][$colAlien]=0; 
        $colAlien--; 
        $tableau[$ligAlien][$colAlien]='z'; 
      }

      else if($colAlien >= 4 && $ligAlien === 6){
        $tableau[$ligAlien][$colAlien]=0; 
        $ligAlien--; 
        $tableau[$ligAlien][$colAlien]='z'; 
      }
      else if($colAlien === 4  && $ligAlien < 5 && $ligAlien > 1){
        $tableau[$ligAlien][$colAlien]=0; 
        $ligAlien--; 
        $tableau[$ligAlien][$colAlien]='z'; 
      }
      else if($colAlien === $colHero && $ligAlien === $ligHero ){
        gameOver=true; 
      }
      else {
          $tableau[$ligAlien][$colAlien]=0; 
          $colAlien++; 
          $tableau[$ligAlien][$colAlien]='z'; 
          if(stp===3){
            stp=2;
          }  else {
          stp++;}
      }
    }
  // -------------------- ALIEN  -------------------------- //   



>>>>>>> 39b28bb24b53f0c0b7d9e35626d8126734209bac
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



  let down = false;
  let up = false;
  let right = false;
  let left = false;
  // -------------------- HERO -------------------------- //    
  const mooveHero = e => {
    if (e.key === 'ArrowDown') {
      $direction = 'step-down';
      const interval = setInterval(stopFunction, 10);
      function stopFunction() {
        if (down === false || $ligHero >= $nbrLig - 2) {
          clearInterval(interval);
          $direction = '';
        } else {
          $bottomSide = $bottomSide - 1;
          console.log($bottomSide);
        }
        if ($bottomSide === 0) {
          $bottomSide = 49;
          $tableau[$ligHero][$colHero] = 0;
          $ligHero++;
          $tableau[$ligHero][$colHero] = 'p';
        }
      }
    }
    if (e.key === 'ArrowUp') {
      $direction = 'step-up';
      const interval = setInterval(stopFunction, 10);
      function stopFunction() {
        if (up === false || $ligHero <= 1) {
          clearInterval(interval);
          $direction = '';
        } else {
          $bottomSide = $bottomSide + 1;
          if ($bottomSide === 50) {
            $bottomSide = 1;
            $tableau[$ligHero][$colHero] = 0;
            $ligHero--;
            $tableau[$ligHero][$colHero] = 'p';
          }
        }
      }
    }
    if (e.key === 'ArrowLeft') {
      $direction = 'step-left';
      const interval = setInterval(stopFunction, 10);
      function stopFunction() {
        if (left === false || $colHero <= 1) {
          clearInterval(interval);
          $direction = '';
        } else {
          console.log($leftSide);
          $leftSide = $leftSide - 1;
          if ($leftSide === 0) {
            $leftSide = 49;
            $tableau[$ligHero][$colHero] = 0;
            $colHero--;
            $tableau[$ligHero][$colHero] = 'p';
          }
        }
      }
    }
    if (e.key === 'ArrowRight') {
      $direction = 'step-right';
      const interval = setInterval(stopFunction, 10);
      function stopFunction() {
        if (right === false || $colHero >= $nbrCol - 1) {
          clearInterval(interval);
          $direction = '';
        } else {
          console.log($leftSide);
          $leftSide = $leftSide + 1;
          if ($leftSide === 50) {
            $leftSide = 1;
            $tableau[$ligHero][$colHero] = 0;
            $colHero++;
            $tableau[$ligHero][$colHero] = 'p';
          }
        }
      }
    }
  };

  document.addEventListener(
    'keydown',
    event => {
      switch (event.key) {
        case 'ArrowDown':
          if (down) return;
          down = true;
          break;
        case 'ArrowUp':
          if (up) return;
          up = true;
          break;
        case 'ArrowLeft':
          if (left) return;
          left = true;
          break;
        case 'ArrowRight':
          if (right) return;
          right = true;
          break;
      }
      mooveHero(event);
    },
    false
  );

  document.addEventListener('keyup', event => {
    switch (event.key) {
      case 'ArrowDown':
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
</script>

<div class="flex flex-col justify-around w-full">
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
        <div class=" gameover">GAMEOVER</div>
        <button class="m-auto rounded-lg bg-black text-white retry h-16 w-40">RETRY</button>
      {/if}
    </Tableau>
  </div>
</div>


<style>
  .retry{
    border:3px solid black; 
    position: absolute;
    left:50%; 
    transform:translateX(-50%); 
    bottom:13%;
  }
  .gameover {
    width:11rem; 
    height:5rem; 
    margin-right:auto; 
    margin-left:auto; 
    margin-top:-50%; 
    font-weight:bold; 
    color:white; 
    font-size:2rem;
    animation : gameoverZoom 3s linear 1;  
  }
  @keyframes gameoverZoom {
    from {transform: scale(1);  }
    to {transform: scale(1.5); }
  }
</style>