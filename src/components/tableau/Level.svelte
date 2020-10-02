<script>
  // components
  import Tableau from './Tableau.svelte';
  import Case from './Case.svelte';

  // function svelte
  import { onMount } from 'svelte';
  // strore
  import { tableau } from '../StoreTable.js';
  import { nbrCol } from '../StoreTable.js';
  import { nbrLig } from '../StoreTable.js';

  import { ligHero } from '../StoreCharacters.js';
  import { colHero } from '../StoreCharacters.js';
  import { step } from '../StoreCharacters.js';
  import { direction } from '../StoreCharacters.js';
  import { leftSide } from '../StoreCharacters.js';
  import { bottomSide } from '../StoreCharacters.js';

  let down = false;
  let up = false;
  let right = false;
  let left = false;

  onMount(async () => {});
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
</script>

<div class="flex flex-col justify-around w-full">
  <div class="gamefield">
    <Tableau>
      {#each $tableau as lig}
        <tr class="ligne">
          {#each lig as col}
            <Case idCase={col} />
          {/each}
        </tr>
      {/each}
    </Tableau>
  </div>
</div>
