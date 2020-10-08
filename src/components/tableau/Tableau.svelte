<script>
  import { tableau } from '../StoreTable.js';
  import { nbrLig } from '../StoreTable.js';
  import { nbrCol } from '../StoreTable.js';
  import { ligHero } from '../StoreCharacters.js';
  import { colHero } from '../StoreCharacters.js';

  import { ligAlien } from '../StoreCharacters.js';
  import { colAlien } from '../StoreCharacters.js';

  import {onDestroy, onMount} from 'svelte'



  onMount(()=> {
    //onMount 
    console.log('Mount Tableau')
  

  })

  onDestroy(()=> {
    //onDestroy 
    $tableau= []
    console.log('Destroy Tableau')
  })
  


  const createTab = (lig, col, car = 0) => {
    let tab = [];
    let index = 0;
    for (let i = 0; i <= lig; i++) {
      const ligne = [];
      for (let y = 0; y <= col; y++) {
        ligne.push(car);
        console.log(index);
        index++;
      }
      tab.push(ligne);
    }
    return tab;
  };

  
    $tableau = createTab($nbrLig, $nbrCol);
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

    function createShip() {
    for (let i = 0; i < 1; i++) {
      for (let y = 1; y <= 9; y++) {
        $tableau[0][y] = 'ship';
        $tableau[9][y] = 'ship';
        $tableau[y][0] = 'ship';
        $tableau[y][10] = 'ship';
      }
    }
  }
  createShip();

  function createFloor() {
    for (let i = 1; i <= 8; i++) {
      for (let y = 1; y <= 9; y++) {
        $tableau[i][y] = 'floor';
        console.log(i, y);
      }
    }
  }
  // createShip();
</script>

<p class="text-center text-green-300">Utlisez les touches directionnelles</p>
<div class="tableau ">
  <div id="tableau">
    <slot />
  </div>
</div>
