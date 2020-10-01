<script>
  import Tailwindcss from './Tailwindcss.svelte';
  import Accueil from './components/Accueil.svelte';
  import Level from './components/tableau/Level.svelte';

  // store
  import { sound } from './components/StoreOption.js';

  let newGame = false;
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
</script>

<style>
  .title {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    color: white;
  }
</style>

<Tailwindcss />

<!-- COMPOSANT header -->
<div class="header  relative w-full">
  <div class="title text-6xl text-center"  on:click={() => newGame = false}><p class='title'>ZOMBAV</p></div>
  <audio id="player"  src="./audio/laylow.mp3">
    <track kind="captions">
  </audio> 
  <img id="mute" class="h-16 w-16 absolute m-8 left-0 top-0" {src} alt="volume"  on:click={handleAudio}/>
</div>
<!-- COMPOSANT header -->

{#if !newGame}
<Accueil bind:newGame={newGame}/>
{:else}
    <Level/>
{/if}
