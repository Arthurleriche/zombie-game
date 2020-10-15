<script>
  // svelte 
  import {onDestroy, onMount} from 'svelte'
  // stores
  import {tableau} from './StoreTable.js'
  import {leftAlien} from './StoreCharacters.js'
  import {topAlien} from './StoreCharacters.js'
  // onMount
  onMount(()=> {
    console.log('Mount Enemy')
  })
  // onDestroy
  onDestroy(()=> {
    console.log('Destroy Enemy')
  })
  // props
  export let alienStep; 
</script>

<div class="alien1" style="left:{$leftAlien}px; top:{$topAlien}px">
  <img
    class="right{alienStep}"
    id="alien1"
    src="./resources/alien1.png"
    alt=''
  />
</div>

<style>
  .alien1{
      width:50px; 
      height:50px; 
      overflow:hidden; 
      position: relative; 
    }
    img{
      position: absolute; 
      height: 250px;
      max-width:500px;
      /* top:-10px;   */
    }
    .right1{
      position: absolute; 
      top: -78px; 
      left: -37px; 
    }
    .right2{
      position: absolute; 
      top:-80px; 
      left:-75px;  
    }
    .right3{
      position: absolute; 
      top:-80px; 
      left:3px;  
    }
  </style>