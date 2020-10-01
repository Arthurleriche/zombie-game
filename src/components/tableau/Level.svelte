<script>
  import Tableau from './Tableau.svelte';
  import Case from './Case.svelte';
  import { onMount } from 'svelte';

  import { tableau } from '../Store.js';
  import { ligHero } from '../Store.js';
  import { colHero } from '../Store.js';

  let down = false;
  let up = false;
  let right = false;
  let left = false;

  let direction = 'down';
  let foot = 1;

  onMount(async () => {
    console.log('didMount Level');
    // $tableau[$ligHero][$colHero] = 'p';
  });

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
  }
  const mooveHero = e => {
    if (e.key === 'ArrowDown') {
      const interval = setInterval(stopFunction, 100);
      function stopFunction() {
        if (down === false) {
          clearInterval(interval);
        } else {
          direction = 'down';
          $tableau[$ligHero][$colHero] = 0;
          $ligHero++;
          $tableau[$ligHero][$colHero] = 'p';
          if (foot === 4) {
            foot = 1;
          } else {
            foot++;
          }
        }
      }
    }
    if (e.key === 'ArrowUp') {
      const interval = setInterval(stopFunction, 100);
      function stopFunction() {
        if (up === false) {
          clearInterval(interval);
        } else {
          direction = 'up';
          $tableau[$ligHero][$colHero] = 0;
          $ligHero--;
          $tableau[$ligHero][$colHero] = 'p';
          if (foot === 4) {
            foot = 1;
          } else {
            foot++;
          }
        }
      }
    }
    if (e.key === 'ArrowLeft') {
      const interval = setInterval(stopFunction, 100);
      function stopFunction() {
        if (left === false) {
          clearInterval(interval);
        } else {
          direction = 'left';
          $tableau[$ligHero][$colHero] = 0;
          $colHero--;
          $tableau[$ligHero][$colHero] = 'p';
          if (foot === 4) {
            foot = 1;
          } else {
            foot++;
          }
        }
      }
    }
    if (e.key === 'ArrowRight') {
      const interval = setInterval(stopFunction, 100);
      function stopFunction() {
        if (right === false) {
          clearInterval(interval);
        } else {
          direction = 'right';
          $tableau[$ligHero][$colHero] = 0;
          $colHero++;
          $tableau[$ligHero][$colHero] = 'p';
          if (foot === 4) {
            foot = 1;
          } else {
            foot++;
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
        break;
      case 'ArrowUp':
        up = false;
        break;
      case 'ArrowLeft':
        left = false;
        break;
      case 'ArrowRight':
        right = false;
        break;
    }
  });
</script>

<div class="flex flex-col justify-around w-full">
  <div class="gamefield border border-black">
    <Tableau>
      {#each $tableau as lig}
        <tr class="ligne">
          {#each lig as col}
            <Case idCase={col} feature={direction} steps={foot} />
          {/each}
        </tr>
      {/each}
    </Tableau>
    <button on:click={parseFile} />
  </div>
</div>
