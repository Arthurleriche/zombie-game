<script>
  import Plateau from './components/tableau/Tableau.svelte';
  import Case from './components/tableau/Case.svelte';

  let tableau = [];
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

  tableau = createTab(10, 10);
  console.log(tableau);
</script>

<Plateau>
  {#each tableau as lig}
    <tr class="ligne">
      {#each lig as col}
        <Case />
      {/each}
    </tr>
  {/each}
</Plateau>
