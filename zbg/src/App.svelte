

<script>
import Tailwindcss from './Tailwindcss.svelte'
import Accueil from './components/Accueil.svelte'
import Level from './components/Level.svelte'
let newGame=false; 
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


<!-- {#if newGame}
<div>BONJOUR</div>
{/if} -->


{#if !newGame}
<Accueil bind:newGame={newGame}/>
{:else}
<div class="header flex flex-col justify-around w-full">
  <div class="title text-6xl text-center">ZOMBAV</div>
  <div class="gamefield border border-black">
    <Level/>
  </div>
</div>
{/if}


















