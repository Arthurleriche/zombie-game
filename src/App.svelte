<script>
// -----------------------------------------------------------
  import Tailwindcss from './Tailwindcss.svelte';
  import Accueil from './components/Accueil.svelte';
  import { newGame } from './stores/Store.js';
// -----------------------------------------------------------
import Header from './components/Header.svelte'
import Hero from './components/Hero.svelte'
import {startGame} from './game/gameloop.js'
import Gamefield from './components/Gamefield.svelte';
startGame()

</script>
<Tailwindcss />

<Header/>
{#if !$newGame}
  <Accueil bind:newGame={$newGame} />
{:else}
  <Gamefield>
      <Hero  />
  </Gamefield>
{/if}


<style>
  
</style>