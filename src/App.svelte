<script>
  // -----------------------------------------------------------
  import Tailwindcss from './Tailwindcss.svelte';
  import { newGame } from './stores/Store.js';
  import { enemyList } from './stores/StoreCharacters';
  import {
    boostOnMap,
    heartOnMap,
    coinOnMap,
    gunOnMap,
  } from './stores/StoreBonus';
  import {
    sabreActive,
    sabreY,
    sabreX,
    gunActive,
    gunX,
    gunY,
    chooseWeapon,
    bullets,
    machineGunActive,
  } from './stores/StoreWeapon';
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
  import Gun from './components/boosts/Gun.svelte';
  import GunShot from './components/weapons/GunShot.svelte';
  import MachineGun from './components/weapons/MachineGun.svelte';
  import Bullets from './components/weapons/Bullets.svelte';

  let dev = process.env.isDev;
</script>

<style>
</style>

<Tailwindcss />

<Header />
{#if $newGame === false || $newGame === null}
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
      {#if $gunOnMap}
        <Gun />
      {/if}
      {#if $sabreActive}
        <Sabre sabreX={$sabreX} sabreY={$sabreY} />
        <!-- <Gun gunX={$gunX} gunY={$gunY} /> -->
      {/if}
      {#if $gunActive}
        <GunShot gunX={$gunX} gunY={$gunY} />
      {/if}
      {#if $machineGunActive}
        <MachineGun gunX={$gunX} gunY={$gunY} />
      {/if}
      {#each $bullets as bullet}
        <Bullets {bullet} />
      {/each}
      {#each $enemyList as enemy}
        <Enemy {enemy} />
      {/each}
    </Gamefield>
  </div>
{/if}
