<script>
  //stores
  import { tableau } from '../StoreTable.js';
  import { nbrLig } from '../StoreTable.js';
  import { nbrCol } from '../StoreTable.js';
  import { ligHero } from '../StoreCharacters.js';
  import { colHero } from '../StoreCharacters.js';
  import { ligAlien } from '../StoreCharacters.js';
  import { colAlien } from '../StoreCharacters.js';

  import { colObject } from '../StoreObjects.js';
  import { ligObject } from '../StoreObjects.js';

  import { leftAlien } from '../StoreCharacters.js';
  import { topAlien } from '../StoreCharacters.js';

  //svelte
  import { onDestroy, onMount } from 'svelte';
  //onMount
  onMount(() => {
    console.log('Mount Tableau');
  });
  //onDestroy
  onDestroy(() => {
    console.log('Destroy Tableau');
    // clearInterval(interval4);
  });

  let level = '';

  const parseFile = () => {
    let fr = new FileReader();
    fetch('./resources/level1.txt')
      .then(data => data.text())
      .then(response => (level = response));
  };

  // INITIALISATION DU JEU
  function init() {
    parseFile();
    // CREATE TAB
    const createTab = (lig, col, car = 0) => {
      let tab = [];
      let index = 0;
      for (let i = 0; i <= lig; i++) {
        const ligne = [];
        for (let y = 0; y <= col; y++) {
          ligne.push(car);

          index++;
        }
        tab.push(ligne);
      }
      return tab;
    };
    $tableau = createTab($nbrLig, $nbrCol);
    // ASSIGN VALUES TO TAB CELLS : 'p' for Hero, 'z' for Enemies
    $tableau[$ligHero][$colHero] = 'p';
    $tableau[$ligAlien][$colAlien] = 'z';
    $tableau[10][1] = 'fire';
    $tableau[10][2] = 'fire';
    $tableau[10][3] = 'fire';
    $tableau[10][9] = 'fire';
    $tableau[10][8] = 'fire';
    $tableau[10][7] = 'fire';
    $tableau[10][4] = 'empty';
    $tableau[10][5] = 'empty';
    $tableau[10][6] = 'empty';
    $tableau[0][0] = 'empty';
    $tableau[10][0] = 'empty';
    $tableau[10][10] = 'empty';
    $tableau[0][10] = 'empty';
    // CREATE SHIP
    for (let i = 0; i < 1; i++) {
      for (let y = 1; y <= 9; y++) {
        $tableau[0][y] = 'ship';
        $tableau[9][y] = 'ship';
        $tableau[y][0] = 'ship';
        $tableau[y][10] = 'ship';
      }
    }
    $tableau[$ligObject][$colObject] = 'b';
  }
  init();
</script>

<p class="text-center text-green-300">Utlisez les touches directionnelles</p>
<div class="tableau ">
  <div id="tableau">
    <slot />
  </div>
</div>
