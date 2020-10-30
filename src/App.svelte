<script>
  // -----------------------------------------------------------
  import Tailwindcss from './Tailwindcss.svelte';
  import { newGame } from './stores/Store.js';
  import { enemyList } from './stores/StoreCharacters';
  import { weaponActive, sabreY, sabreX } from './stores/StoreWeapon';
  // -----------------------------------------------------------
  import Accueil from './components/Accueil.svelte';
  import Header from './components/Header.svelte';
  import Hero from './components/Hero.svelte';
  import Sabre from './components/weapons/Sabre.svelte';
  import Enemy from './components/Enemy.svelte';
  import Gamefield from './components/Gamefield.svelte';
  import Debug from './components/Debug.svelte';
</script>

<style>
</style>

<Tailwindcss />

<Header />
{#if !$newGame}
  <Accueil bind:newGame={$newGame} />
{:else}
  <div class="flex space-x-0 justify-around">
    <Debug />
    <Gamefield>
      <Hero />
      {#if $weaponActive}
        <Sabre sabreX={$sabreX} sabreY={$sabreY} />
      {/if}
      {#each $enemyList as enemy}
        <Enemy {enemy} />
      {/each}
    </Gamefield>
  </div>
{/if}
