<script>
  // tailwindcss
  import Tailwindcss from './Tailwindcss.svelte';
  // components
  import Accueil from './components/Accueil.svelte';
  import Level from './components/tableau/Level.svelte';
  // stores
  import { newGame } from './components/Store.js';
  import { sound } from './components/StoreOption.js';
  import { ligHero } from './components/StoreCharacters.js';
  import { colHero } from './components/StoreCharacters.js';
  import { retry } from './components/Store.js';

  // variables
  let src = './img/mute.svg';

  function handleAudio() {
    var Player = document.getElementById('player');
    if ($sound == true) {
      Player.play();
      src = './img/volume.svg';
    } else {
      Player.pause();
      src = './img/mute.svg';
    }
    $sound = !$sound;
  }
  function initHero() {
    $ligHero = 5;
    $colHero = 5;
    console.log('initHero');
  }
</script>

<style>
  .title {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    color: white;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: rgb(64, 131, 78);
  }
  #mute {
    filter: drop-shadow(16px 16px 20px red) invert(75%);
  }
  #backToMenu {
    line-height: 2.5rem;
    margin: 15px;
    -webkit-text-stroke-width: 0.5px;
    -webkit-text-stroke-color: rgb(64, 131, 78);
  }
</style>

<Tailwindcss />

<!-- COMPOSANT header -->
<div class="header  relative w-full">
  <div class="title text-6xl text-center">
    <p class="title">ALIENUX I.O</p>
  </div>
  <p
    on:click={() => ($newGame = false)}
    on:click={initHero}
    id="backToMenu"
    class=" text-center opacity-0 text-white border w-1/10 pl-2 pr-2 h-12 text-base absolute top-0 right-0">
    BacK to Menu
  </p>
  <audio id="player" src="./audio/laylow.mp3">
    <track kind="captions" />
  </audio>
  <img
    id="mute"
    class="h-16 w-16 absolute m-8 left-0 top-0"
    {src}
    alt="volume"
    on:click={handleAudio} />
</div>
<!-- COMPOSANT header -->

{#if !$newGame}
  <Accueil bind:newGame={$newGame} />
{:else if $retry}
  <Level />
{:else}
  <Level />
{/if}
