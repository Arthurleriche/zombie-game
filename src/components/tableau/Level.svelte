<script>
  import Plateau from './Tableau.svelte';
  import Case from './Case.svelte';
  import { onMount } from 'svelte';

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
  onMount(async () => {
    $tableau[$ligHero][$colHero] = 'p';
    console.log('coucou lala');
  });

  function click() {
    var fileobj = event.target.files[0];
    var fr = new FileReader();
    fr.onload = function (event) {
      index.push(fr.result);
    };
    fr.readAsText(fileobj);
  }

  const test = () => {
    console.log(l);
  };
</script>

<Plateau>
  {#each $tableau as lig}
    <tr class="ligne">
      {#each lig as col}
        <Case idCase={col} />
      {/each}
    </tr>
  {/each}
</Plateau>
<button on:click={test} />
