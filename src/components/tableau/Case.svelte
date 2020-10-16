<script>
  // components
  import Hero from '../Hero.svelte';
  import Fire from '../textures/Fire.svelte';
  import Ship from '../textures/Ship.svelte';
  import Enemies from '../Enemies.svelte';
  // props 
  export let idCase;
</script>

<td class="cel {idCase} ">
  {#if idCase === 'p'}
    <Hero />
  {/if}
  {#if idCase === 'fire'}
    <Fire />
  {/if}
  {#if idCase === 'ship'}
    <Ship />
  {/if}
  {#if idCase === 'z'}
  <Enemies/> 
  {/if}
</td>

<style>
  .cel {
    max-width: 50px;
    max-height: 50px;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
  }
</style>
