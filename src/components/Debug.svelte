<script>

import { get } from 'svelte/store';
import {enemyList} from '../stores/StoreCharacters.js'


</script>



<div class="debug bg-transparent ">

    <!-- <div class="text-white">{get(enemyList)[0]}</div> -->
    {#each get(enemyList) as enemy}
        <div class="text-white"> {enemy}</div>
    {/each}
</div>






<style>
    .debug{
        width:200px; 
        height: 400px; 
        margin-left:70px; 
        margin-top:30px; 
        margin-right:15px; 
        border: 2px solid red ;
    }

</style>