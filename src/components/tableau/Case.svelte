<script>
  import { onMount } from 'svelte';
  import Hero from '../Hero.svelte';
  import Fire from '../textures/Fire.svelte';
  import Ship from '../textures/Ship.svelte';
  import Empty from '../textures/Empty.svelte';

  export let idCase;

  onMount(async () => {
    console.log('dirMount case');
  });
</script>

<style>
  .cel {
<<<<<<< HEAD
    max-width: 50px;
    max-height: 50px;

    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
=======
    width: 10px;
    height: 10px;
    border: 1px solid rgb(63, 61, 61);

>>>>>>> 62ab9dbe1becf7b14a1cd5ea4eb5c974156bc43a
  }
</style>

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
</td>
