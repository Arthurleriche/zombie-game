


<style>
    .cel{
      width:25px; 
      height:25px; 
      background-color:rgb(37, 36, 36);
    }
</style>

<script>
  import { onMount } from 'svelte';
  import Hero2 from '../components/Hero2.svelte';
  export let idCase;

  onMount(async () => {
    console.log('didmount Case.svelte');
  });
</script>

<td class="border cel {idCase}">
  {#if idCase === 'p'}
    <Hero2 />
  {/if}
</td>




