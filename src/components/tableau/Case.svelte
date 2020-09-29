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

<td class="border cel {idCase} border-none">
  {#if idCase === 'p'}
    <Hero {feature} {steps} />
  {/if}
</td>

<style>
  .cel {
    width: 25px;
    height: 25px;
  }
</style>
