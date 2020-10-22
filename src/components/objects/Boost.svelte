<script>
  import { colObject } from '../StoreObjects.js';
  import { ligObject } from '../StoreObjects.js';
  import { tableau } from '../StoreTable.js';

  let compteur = 0;
  let compteurBis = 0;
  const boostHero = () => {
    compteur++;
    if (compteur === 59) {
      compteur = 0;
      compteurBis++;
    }
    console.log(compteurBis);
    if (compteurBis === 10) {
      $tableau[$ligObject][$colObject] = 'b';
    }
    console.log('coucou');
  };
  window.requestAnimationFrame(boostHero);
</script>

<style>
  #boost {
    width: 30px;
    height: 30px;
  }
</style>

<div class="boost"><img id="boost" src="./resources/boost1.png" alt="" /></div>
