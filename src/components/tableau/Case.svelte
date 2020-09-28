<script>
  import { onMount } from 'svelte';
  import Hero2 from '../Hero2.svelte';

  export let idCase;
  export let feature;
  export let steps;

  onMount(async () => {
    console.log('dirMount case');
  });
</script>

<style>
  .cel {
    width: 25px;
    height: 25px;
  }
</style>

<td class="border cel {idCase} border-none">
  {#if idCase === 'p'}
    <Hero2 {feature} {steps} />
  {/if}
</td>
