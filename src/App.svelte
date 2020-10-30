<script>
  // -----------------------------------------------------------
  import Tailwindcss from './Tailwindcss.svelte';
  import { isPlaying, newGame } from './stores/Store.js';
  import { enemyList } from './stores/StoreCharacters';
  import { boostOnMap, heartOnMap, coinOnMap } from './stores/StoreBonus';
  import { weaponActive, sabreY, sabreX } from './stores/StoreWeapon';
  // -----------------------------------------------------------
  import Accueil from './components/Accueil.svelte';
  import Header from './components/Header.svelte';
  import Hero from './components/Hero.svelte';
  import Sabre from './components/weapons/Sabre.svelte';
  import Enemy from './components/Enemy.svelte';
  import BoostHero from './components/boosts/BoostHero.svelte';
  import Medic from './components/boosts/Medic.svelte';
  import Coin from './components/boosts/Coin.svelte';
  import Gamefield from './components/Gamefield.svelte';
  import Debug from './components/Debug.svelte';

  let dev = process.env.isDev;
</script>

<style>
</style>

<Tailwindcss />

<Header />
{#if !$newGame}
  <Accueil bind:newGame={$newGame} />
{:else}
  <div class="flex space-x-0 justify-around">
    {#if dev}
      <Debug />
    {/if}
    <Gamefield>
      <Hero />
      {#if $boostOnMap}
        <BoostHero />
      {/if}
      {#if $heartOnMap}
        <Medic />
      {/if}
      {#if $coinOnMap}
        <Coin />
      {/if}
      {#if $weaponActive}
        <Sabre sabreX={$sabreX} sabreY={$sabreY} />
      {/if}
      {#each $enemyList as enemy}
        <Enemy {enemy} />
      {/each}
    </Gamefield>
  </div>
{/if}
