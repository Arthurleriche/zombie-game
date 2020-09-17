<script>
  import Tailwindcss from './Tailwindcss.svelte';

  const jeu = document.querySelector('#tab');
  const nbLigne = 50;
  const nbCol = 50;
  let tableau = [];
  let l = 0;
  let c = 0;
  let lastEvent = '';
  let position = ' ';
  let foot = 1;
  let down = false;
  let up = false;
  let right = false;
  let left = false;
  let array = [];

  // init du tableau
  const createTab = (lig, col, car = 0) => {
    let tab = [];
    for (let i = 0; i <= lig; i++) {
      const ligne = [];
      for (let y = 0; y <= col; y++) {
        ligne.push(car);
      }
      tab.push(ligne);
    }
    return tab;
  };

  tableau = createTab(nbLigne, nbCol);

  const initGame = newTab => {
    newTab[0][0] = 1;
    showTab(newTab);
  };
  // fin init du tableau

  // afficher le tableau
  const showTab = tab => {
    let content = '<table>';
    for (let i = 0; i < nbLigne; i++) {
      content += "<tr class='ligne'>";
      for (let j = 0; j < nbCol; j++) {
        content += "<td class='border cel'>";
        if (tab[i][j] === 0) {
        }
        if (tab[i][j] === 1) {
          content += `<div class="personnage"> <div class="Characters"><img class="Character ${position}${foot}" src="./img/Heroe.png" alt="Character"> </div></div>`;
        }
        if (tab[i][j] === 2) {
          content += '';
        }
        if (tab[i][j] === 3) {
          content +=
            "<img src='https://media.giphy.com/media/Qvp6Z2fidQR34IcwQ5/source.gif'>";
        }
        content += '</td>';
      }
      content += ' </tr>';
    }
    content += '</table>';
    jeu.innerHTML = content;
  };
  // fin afficher tableau

  const updateGame = newTab => {
    showTab(newTab);
  };

  // création du tableau
  tableau = createTab(nbLigne, nbCol);
  initGame(tableau);
  // fin création du tableau

  // direction character
  const switchDirection = (event, newTab) => {
    if (event.key === 'ArrowDown' && l <= 47) {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (down === false) {
          clearInterval(interval);
          foot = 1;
          showTab(newTab);
        } else {
          if (l >= 47) {
            clearInterval(interval);
          }
          newTab[l][c] = 2;
          l++;
          newTab[l][c] = 1;
          position = 'down';
          if (foot === 4) {
            foot = 1;
            position = '';
          }
          foot++;
          showTab(newTab);
        }
      }
    }

    if (event.key === 'ArrowUp' && l >= 2) {
      const interval = setInterval(stopFunction, 110);
      function stopFunction() {
        if (up === false) {
          clearInterval(interval);
          foot = 1;
          showTab(newTab);
        } else {
          if (l <= 2) {
            clearInterval(interval);
          }
          tableau[l][c] = 2;
          l--;
          newTab[l][c] = 1;
          position = 'up';
          if (foot === 4) {
            foot = 1;
            position = 'up';
          }
          foot++;
          showTab(newTab);
        }
      }
    }
    if (event.key === 'ArrowRight' && c <= 49) {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (right === false) {
          clearInterval(interval);
          foot = 1;
          showTab(newTab);
        } else {
          if (c >= 49) {
            clearInterval(interval);
          } else {
            tableau[l][c] = 2;
            c++;
            newTab[l][c] = 1;
            position = 'right';
            if (foot === 4) {
              foot = 1;
            }
            foot++;
            showTab(newTab);
          }
        }
      }
    }

    if (event.key === 'ArrowLeft') {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (left === false) {
          clearInterval(interval);
          foot = 1;
          showTab(newTab);
        } else {
          if (c < 2) {
            clearInterval(interval);
          } else {
            tableau[l][c] = 2;
            c--;
            newTab[l][c] = 1;
            position = 'left';
            if (foot === 4) {
              foot = 1;
            }
            foot++;
            showTab(newTab);
          }
        }
      }
    }
  };
  // fin direction character

  // event Player
  document.addEventListener(
    'keydown',
    event => {
      array = [event.key, ...array];
      array.splice(2);
      switch (event.key) {
        case 'ArrowDown':
          if (down) return;
          down = true;
          position = 'down';
          break;
        case 'ArrowUp':
          if (up) return;
          up = true;
          break;
        case 'ArrowLeft':
          if (left) return;
          left = true;
          console.log(left);
          break;
        case 'ArrowRight':
          if (right) return;
          right = true;
          console.log('je suis right');
          break;
      }
      switchDirection(event, tableau);
    },
    false
  );

  document.addEventListener('keyup', () => {
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
  // fin  player
</script>
