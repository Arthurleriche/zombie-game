<script>
  // -----------------------------------------------------------
  import Tailwindcss from './Tailwindcss.svelte';
  import Accueil from './components/Accueil.svelte';
  import { newGame } from './stores/Store.js';
  import { enemyList } from './stores/StoreCharacters';
  // -----------------------------------------------------------
  import Header from './components/Header.svelte';
  import Hero from './components/Hero.svelte';
  import Enemy from './components/Enemy.svelte';
  import { startGame } from './game/gameloop.js';
  import Gamefield from './components/Gamefield.svelte';

  startGame();
</script>

<style>
</style>

<Tailwindcss />

<Header />
{#if !$newGame}
  <Accueil bind:newGame={$newGame} />
{:else}
  <Gamefield>
    <Hero />
    {#each $enemyList as enemy}
      <Enemy {enemy} />
    {/each}
  </Gamefield>
{/if}
