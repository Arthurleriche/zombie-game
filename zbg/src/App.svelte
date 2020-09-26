

<script>
import Tailwindcss from './Tailwindcss.svelte'
import Accueil from './components/Accueil.svelte'
import Level from './components/Level.svelte'
let newGame=false; 

let src = './img/mute.svg'
let muted = true ; 


function handleAudio(){
  var Player = document.getElementById('player')
  
  if (muted == true ){
    Player.play();
    src = './img/volume.svg'
  } else {
    Player.pause();
    src = './img/mute.svg'
  }
  muted = !muted; 
}


</script>
<Tailwindcss/>



<style>
  .title{
    font-family:'Courier New', Courier, monospace;
    font-weight: bold;
  }

  .gamefield{
    width:1000px;
    height:600px;
    margin:auto;
  }

</style>


<div class="header  relative w-full">
  <div class="title text-6xl text-center">ZOMBAV</div>
  <audio id="player"  src="./audio/laylow.mp3">
    <track kind="captions">
  </audio> 
  <img id="mute" class="h-16 w-16 absolute m-8 left-0 top-0" {src} alt="volume"  on:click={handleAudio}/>
</div>
    

{#if !newGame}
<Accueil bind:newGame={newGame}/>
{:else}
<div class="header flex flex-col justify-around w-full">
  <div class="gamefield border border-black">
    <Level/>
  </div>
</div>
{/if}


















