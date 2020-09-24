<script>
  import { tableau } from '../Store';
  import { ligHero } from '../Store';
  import { colHero } from '../Store';

  let down = false;
  let up = false;
  let right = false;
  let left = false;
  let lig = $ligHero;
  let col = $colHero;

  const mooveHero = e => {
    if (e.key === 'ArrowDown') {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (down === false) {
          clearInterval(interval);
        } else {
          $tableau[lig - 1][col] = 0;
          lig++;
          $tableau[lig][col] = 'p';
          ligHero.set(lig);
        }
      }
    }
    if (e.key === 'ArrowUp') {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (up === false) {
          clearInterval(interval);
        } else {
          $tableau[lig][col] = 0;
          lig--;
          $tableau[lig][col] = 'p';
          ligHero.set(lig);
        }
      }
    }
    if (e.key === 'ArrowLeft') {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (left === false) {
          clearInterval(interval);
        } else {
          $tableau[lig][col] = 0;
          col--;
          $tableau[lig][col] = 'p';
          colHero.set(col);
        }
      }
    }
    if (e.key === 'ArrowRight') {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (right === false) {
          clearInterval(interval);
        } else {
          $tableau[lig][col] = 0;
          col++;
          $tableau[lig][col] = 'p';
          colHero.set(col);
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

<div class="hero"><img id="hero" src="./img/Heroe.png" alt="character" /></div>
