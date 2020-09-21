<script>
  import Tailwindcss from './Tailwindcss.svelte';
  let newGame = false;

  const jeu = document.querySelector('#tab');
  const nbLigne = 50;
  const nbCol = 50;
  let tableau = [];
  let l = 1;
  let c = 1;
  let lastEvent = '';
  let position = ' ';
  let foot = 1;
  let down = false;
  let up = false;
  let right = false;
  let left = false;
  let array = [];
  const arrayFire = [
    {
      lig: 0,
      col: 0,
    },
    {
      lig: 0,
      col: 2,
    },
    {
      lig: 0,
      col: 4,
    },
    {
      lig: 0,
      col: 6,
    },
    {
      lig: 0,
      col: 0,
    },
    {
      lig: 0,
      col: 8,
    },
    {
      lig: 0,
      col: 10,
    },
    {
      lig: 0,
      col: 12,
    },
    {
      lig: 0,
      col: 14,
    },
    {
      lig: 0,
      col: 16,
    },
    {
      lig: 0,
      col: 2,
    },
    {
      lig: 0,
      col: 18,
    },
    {
      lig: 0,
      col: 20,
    },
    {
      lig: 0,
      col: 22,
    },
    {
      lig: 0,
      col: 24,
    },
    {
      lig: 0,
      col: 26,
    },
    {
      lig: 0,
      col: 28,
    },
    {
      lig: 0,
      col: 30,
    },
    {
      lig: 0,
      col: 32,
    },
    {
      lig: 0,
      col: 34,
    },
    {
      lig: 0,
      col: 36,
    },
    {
      lig: 0,
      col: 38,
    },
    {
      lig: 0,
      col: 40,
    },
    {
      lig: 0,
      col: 42,
    },
    {
      lig: 0,
      col: 44,
    },
    {
      lig: 0,
      col: 46,
    },
    {
      lig: 0,
      col: 48,
    },
    {
      lig: 0,
      col: 50,
    },
    {
      lig: 48,
      col: 2,
    },
    {
      lig: 48,
      col: 2,
    },
    {
      lig: 48,
      col: 4,
    },
    {
      lig: 48,
      col: 6,
    },
    {
      lig: 48,
      col: 8,
    },
    {
      lig: 48,
      col: 10,
    },
    {
      lig: 48,
      col: 10,
    },
    {
      lig: 48,
      col: 12,
    },
    {
      lig: 48,
      col: 14,
    },
    {
      lig: 48,
      col: 16,
    },
    {
      lig: 48,
      col: 2,
    },
    {
      lig: 48,
      col: 18,
    },
    {
      lig: 48,
      col: 20,
    },
    {
      lig: 48,
      col: 22,
    },
    {
      lig: 48,
      col: 24,
    },
    {
      lig: 48,
      col: 26,
    },
    {
      lig: 48,
      col: 28,
    },
    {
      lig: 48,
      col: 30,
    },
    {
      lig: 48,
      col: 32,
    },
    {
      lig: 48,
      col: 34,
    },
    {
      lig: 48,
      col: 36,
    },
    {
      lig: 48,
      col: 38,
    },
    {
      lig: 48,
      col: 40,
    },
    {
      lig: 48,
      col: 42,
    },
    {
      lig: 48,
      col: 44,
    },
    {
      lig: 48,
      col: 46,
    },
    {
      lig: 48,
      col: 48,
    },
    {
      col: 0,
      lig: 0,
    },
    {
      col: 0,
      lig: 2,
    },
    {
      col: 0,
      lig: 4,
    },
    {
      col: 0,
      lig: 6,
    },
    {
      col: 0,
      lig: 0,
    },
    {
      col: 0,
      lig: 8,
    },
    {
      col: 0,
      lig: 10,
    },
    {
      col: 0,
      lig: 12,
    },
    {
      col: 0,
      lig: 14,
    },
    {
      col: 0,
      lig: 16,
    },
    {
      col: 0,
      lig: 2,
    },
    {
      col: 0,
      lig: 18,
    },
    {
      col: 0,
      lig: 20,
    },
    {
      col: 0,
      lig: 22,
    },
    {
      col: 0,
      lig: 24,
    },
    {
      col: 0,
      lig: 26,
    },
    {
      col: 0,
      lig: 28,
    },
    {
      col: 0,
      lig: 30,
    },
    {
      col: 0,
      lig: 32,
    },
    {
      col: 0,
      lig: 34,
    },
    {
      col: 0,
      lig: 36,
    },
    {
      col: 0,
      lig: 38,
    },
    {
      col: 0,
      lig: 40,
    },
    {
      col: 0,
      lig: 42,
    },
    {
      col: 0,
      lig: 44,
    },
    {
      col: 0,
      lig: 46,
    },
    {
      col: 0,
      lig: 48,
    },
    {
      col: 0,
      lig: 50,
    },
    {
      col: 48,
      lig: 2,
    },
    {
      col: 48,
      lig: 2,
    },
    {
      col: 48,
      lig: 4,
    },
    {
      col: 48,
      lig: 6,
    },
    {
      col: 48,
      lig: 8,
    },
    {
      col: 48,
      lig: 10,
    },
    {
      col: 48,
      lig: 10,
    },
    {
      col: 48,
      lig: 12,
    },
    {
      col: 48,
      lig: 14,
    },
    {
      col: 48,
      lig: 16,
    },
    {
      col: 48,
      lig: 2,
    },
    {
      col: 48,
      lig: 18,
    },
    {
      col: 48,
      lig: 20,
    },
    {
      col: 48,
      lig: 22,
    },
    {
      col: 48,
      lig: 24,
    },
    {
      col: 48,
      lig: 26,
    },
    {
      col: 48,
      lig: 28,
    },
    {
      col: 48,
      lig: 30,
    },
    {
      col: 48,
      lig: 32,
    },
    {
      col: 48,
      lig: 34,
    },
    {
      col: 48,
      lig: 36,
    },
    {
      col: 48,
      lig: 38,
    },
    {
      col: 48,
      lig: 40,
    },
    {
      col: 48,
      lig: 42,
    },
    {
      col: 48,
      lig: 44,
    },
    {
      col: 48,
      lig: 46,
    },
    {
      col: 48,
      lig: 48,
    },
  ];
  const persoUp = document.querySelector(`.tr${l - 1} .td${c - 1}`);
  const perso = document.querySelector(`.tr${l} .td${c}`);
  const supPerso = document.querySelector(`.tr${l} .td${c}`);
  const persoDown = document.querySelector(`.tr${l + 1} .td${c - 1}`);

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
  console.log(tableau);

  const initGame = newTab => {
    newTab[3][3] = 1;
    arrayFire.forEach(fire => {
      console.log(c);
      newTab[fire.lig][fire.col] = 2;
    });
    if (newGame == true) {
      showTab(newTab);
    } else {
      console.log('WESH');
      let contenu = '<table>';
      contenu +=
        '<img style="position:absolute; top:0px; left:0px; width: 100vw; height: 100vh; " src=" https://images7.alphacoders.com/812/812638.jpg" alt=""/>  <img id="logo" style="position:absolute; z-index:7; width:40%; height:40%; top:10%; left:30%; "  src="./img/zlogo.png" alt=""/> <div style="position:absolute; background-color:transparent; top: 50%;left:40%"> <div style=" display:flex; flex-direction:column;  width:200px;"> <button id= "a" style="color:white; background-color:black;margin-bottom:5px;" > NEW GAME</button><button> HI SCORES</button><button > OPTIONS</button</div>';
      // contenu += ' <div class=" border border-black container2 m-0 p-0 w-full h-auto"><img class="BG relative" src=" https://images7.alphacoders.com/812/812638.jpg" alt=""/><img class =" logo z-20 absolute" src="./img/zlogo.png" alt=""/> <div class=" menu absolute  bg-transparent  mt-20"> <div class="items flew flex-col"><button class="button hover:bg-gray-800 bg-white text-white">  NEW GAME</button><button class="button hover:bg-gray-800 bg-white text-white">  HI SCORES</button><button class="button hover:bg-gray-800 bg-white text-white"> OPTIONS</button</div></div></div>'
      jeu.innerHTML = contenu;
    }
  };

  // CLICK NEWGAME //
  window.onload = function () {
    const bouton = document.querySelector('#a');
    const fond = document.querySelector('body');
    bouton.onclick = function () {
      newGame = true;
      showTab(tableau);
      fond.style.background = 'green';
    };
  };

  // fin init du tableau

  // afficher le tableau
  const showTab = tab => {
    let content = '<table>';
    for (let i = 0; i < nbLigne; i++) {
      content += `<tr class='ligne tr${i}'>`;
      for (let j = 0; j < nbCol; j++) {
        content += `<td class="border td${j} cel">`;
        if (tab[i][j] === 0) {
        }
        if (tab[i][j] === 1) {
          content += `<div class="personnage"> <div class="Characters"><img class="Character ${position}${foot}" src="./img/Heroe.png" alt="Character"> </div></div>`;
        }
        if (tab[i][j] === 2) {
          content +=
            '<div class="fire"><img id="fire" src="./img/fire.png" alt="fire"></div>';
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

  const showCharacter = () => {
    const persoUp = document.querySelector(`.tr${l - 1} .td${c - 1}`);
    const perso = document.querySelector(`.tr${l} .td${c}`);
    const supPerso = document.querySelector(`.tr${l} .td${c}`);
    const persoDown = document.querySelector(`.tr${l + 1} .td${c - 1}`);
    if (down) {
      supPerso.innerHTML = '';
      persoDown.nextElementSibling.innerHTML = `<div class="personnage"> <div class="Characters"><img class="Character ${position}${foot}" src="./img/Heroe.png" alt="Character"> </div></div>`;
    }

    if (up) {
      supPerso.innerHTML = '';
      persoUp.nextElementSibling.innerHTML = `<div class="personnage"> <div class="Characters"><img class="Character ${position}${foot}" src="./img/Heroe.png" alt="Character"> </div></div>`;
    }

    if (left) {
      supPerso.innerHTML = '';
      perso.previousElementSibling.innerHTML = `<div class="personnage"> <div class="Characters"><img class="Character ${position}${foot}" src="./img/Heroe.png" alt="Character"> </div></div>`;
    }
    if (right) {
      perso.nextElementSibling.innerHTML = `<div class="personnage"> <div class="Characters"><img class="Character ${position}${foot}" src="./img/Heroe.png" alt="Character"> </div></div>`;
      supPerso.innerHTML = '';
    }
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
    if (event.key === 'ArrowDown' && l < 47) {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (down === false) {
          clearInterval(interval);
          foot = 1;
          position = 'down';
          // showTab(newTab);
        } else {
          if (l > 47) {
            clearInterval(interval);
          }
          showCharacter();
          newTab[l][c] = 0;
          l++;
          newTab[l][c] = 1;
          position = 'down';
          if (foot === 4) {
            foot = 1;
            position = '';
          }
          foot++;
          // showTab(newTab);
        }
      }
    }

    if (event.key === 'ArrowUp' && l >= 3) {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (up === false) {
          clearInterval(interval);
          foot = 1;
          // showTab(newTab);
        } else {
          if (l <= 3) {
            clearInterval(interval);
          }
          showCharacter();
          tableau[l][c] = 0;
          l--;
          newTab[l][c] = 1;
          position = 'up';
          if (foot === 4) {
            foot = 1;
            position = 'up';
          }
          foot++;
          // showTab(newTab);
        }
      }
    }

    if (event.key === 'ArrowRight' && c < 47) {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (right === false) {
          clearInterval(interval);
          foot = 1;
        } else {
          if (c > 47) {
            clearInterval(interval);
          }
          showCharacter();
          tableau[l][c] = 0;
          c++;
          newTab[l][c] = 1;
          position = 'right';
          if (foot === 4) {
            foot = 1;
          }
          foot++;
        }
      }
    }

    if (event.key === 'ArrowLeft' && c >= +3) {
      const interval = setInterval(stopFunction, 90);
      function stopFunction() {
        if (left === false) {
          clearInterval(interval);
          foot = 1;
        } else {
          if (c < 3) {
            clearInterval(interval);
          }
          showCharacter();
          newTab[l][c] = 0;
          c--;
          newTab[l][c] = 1;
          position = 'left';
          if (foot === 4) {
            foot = 1;
          }
          foot++;
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
          // supCharacter();
          break;
        case 'ArrowUp':
          if (up) return;
          // supCharacter();
          up = true;
          break;
        case 'ArrowLeft':
          if (left) return;
          // supCharacter();
          left = true;
          console.log(left);
          break;
        case 'ArrowRight':
          if (right) return;
          // supCharacter();
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
