<script>
  import { tableau } from '../Store.js';
  import { nbrLig } from '../Store.js';
  import { nbrCol } from '../Store.js';
  import { ligHero } from '../Store.js';
  import { colHero } from '../Store.js';

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

  $tableau = createTab($nbrLig, $nbrCol);
  $tableau[$ligHero][$colHero] = 'p';
</script>

<p>Utlisez les touches directionnelles</p>
<div>
  <slot />
</div>
