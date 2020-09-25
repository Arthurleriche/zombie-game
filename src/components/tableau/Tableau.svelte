<script>
  import { tableau } from '../Store';
  import { nbrLig } from '../Store';
  import { nbrCol } from '../Store';
  import { ligHero } from '../Store';
  import { colHero } from '../Store';

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

<div>
  <slot />
</div>
