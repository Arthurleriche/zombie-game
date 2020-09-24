<script>
  import { onMount } from 'svelte';
  import Hero from '../characters/Hero.svelte';
  export let idCase;

  onMount(async () => {
    console.log('didmount Case.svelte');
  });
</script>

<td class="border cel {idCase}">
  {#if idCase === 'p'}
    <Hero />
  {/if}
</td>
