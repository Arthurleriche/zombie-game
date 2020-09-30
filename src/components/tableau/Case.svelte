<script>
  import { onMount } from 'svelte';
  import Hero from '../Hero.svelte';

  export let idCase;
  export let feature;
  export let steps;

  onMount(async () => {
    console.log('dirMount case');
  });
</script>

<style>
  .cel {
    width: 10px;
    height: 10px;
  }
</style>

<td class="border cel {idCase} border-none">
  {#if idCase === 'p'}
    <Hero {feature} {steps} />
  {/if}
</td>
