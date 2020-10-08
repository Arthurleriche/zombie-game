<script>
  import Tailwindcss from './Tailwindcss.svelte';
  import Accueil from './components/Accueil.svelte';
  import Level from './components/tableau/Level.svelte';
  import { newGame } from './components/Store.js'
  // store
  import { sound } from './components/StoreOption.js';

  // let newGame = false;
  
  // Player 
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

  import { ligHero } from './components/StoreCharacters.js';
  import { colHero } from './components/StoreCharacters.js';


  function initHero(){
    $ligHero = 5
    $colHero = 5
    console.log('initHero')
  }

  import {retry} from './components/Store.js'
</script>
<Tailwindcss />


<!-- COMPOSANT header -->
<div class="header  relative w-full">
  <div class="title text-6xl text-center"  ><p class='title'>ZOMBAV VI</p> <p on:click={() => $newGame = false} on:click={initHero} id = "backToMenu" class=" opacity-0 text-white border w-40 text-sm absolute top-0 right-0">BacK to Menu</p></div>
  <audio id="player"  src="./audio/laylow.mp3">
    <track kind="captions">
  </audio> 
  <img id="mute" class="h-16 w-16 absolute m-8 left-0 top-0" {src} alt="volume"  on:click={handleAudio}/>
</div>
<!-- COMPOSANT header -->

{#if !$newGame}
<Accueil bind:newGame={$newGame}/>
{:else if $retry}
    <Level/>
{:else}
    <Level/>
{/if}



<style>
  .title {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    color: white;
  }
  #mute{
    filter: drop-shadow(16px 16px 20px red) invert(75%); 
  }
</style>