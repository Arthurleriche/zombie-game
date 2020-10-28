<script>

import { get } from 'svelte/store';
import {enemyList} from '../stores/StoreCharacters.js'
import {x,y} from '../stores/StoreCharacters.js'

import { distance } from '../game/collision.js'

// const getInfos = () => {
//     return get(enemyList)
// }

// const renderDebug=() => {

// }
const debug = () => {
   console.log($enemyList);
//    newList = $enemyList
    
}
debug(); 





</script>


<div class="flex flex-col">
    <div class="debugEnemy flex flex-wrap  bg-transparent ">
        {#each $enemyList as enemy} 
            {#if enemy.collision}
            <div class=" ID text-white text-sm">
                enemy:{enemy.id} <br>
                <div class="coord bg-red-800 border border-white"> X: {enemy.left} </div> 
                <div class="coord bg-red-800 border border-white"> Y:{enemy.top}  </div> 
                <div class="coord bg-red-800 border border-white"> Distance:{distance(enemy.left,enemy.top, $x, $y)}  </div> 
                <div class="coord bg-red-800 border border-white"> Collision: {enemy.collision} </div> 
            </div>
            {:else}
            <div class=" ID text-white text-sm">
                enemy:{enemy.id} <br>
                <div class="coord border border-white"> X: {enemy.left} </div> 
                <div class="coord border border-white"> Y:{enemy.top}  </div> 
                <div class="coord border border-white"> Distance:{distance(enemy.left,enemy.top, $x, $y)}  </div> 
                <div class="coord border border-white"> Collision: {enemy.collision} </div> 
            </div>

            {/if}
        {/each}
    </div>

    <div class="text-white debugHero border border-green-300 p-4 m-auto">
        HERO: <br>
        <div class="coord border border-white"> X: {$x}</div>
        <div class="coord border border-white"> Y: {$y}</div>

        



    </div>
</div>






<style>

    .ID{
        height: 100px; 
        margin:2px; 
    }
    .coord{
        width:100px;
        height: 25px; 
    }
    .debugEnemy{
        width:500px; 
        height: 400px; 
        margin-left:70px; 
        margin-top:30px; 
        margin-right:15px; 
        border: 2px solid red ;
    }

    /* .debugHero{
        
        border: 2px solid red ;
        margin-left:70px; 
        margin-top:30px; 
        margin-right:15px; 

    } */

</style>