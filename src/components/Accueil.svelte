<script>
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  export let newGame;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  console.log(newGame);

  import { sound } from './StoreOption.js';

  function activateSound() {
    $sound = !$sound;
  }
  let options = false; 


</script>



<!-- COMPOSANT acc-MENU -->
<div class="manette m-auto w-5/6"> 
      <div class="trio flex justify-center w-3/5 my-8 mx-auto">
        <div class="animintro">
          <img class="img1" src='./img/zombie1.svg' alt='zombie-1' width='200px'>
          <div class="m-auto button ">HI SCORES</div>
        </div>
        <div class="animintro">
          <img class="img2" src='./img/ET1.png' alt='zombie-3' width='300px'>
          <div class="button" on:click|preventDefault={() => newGame=true}>NEW GAME</div>
          
        </div>
        <div class="animintro" >
          <img class="img3" src='./img/ET2.png' alt='zombie-4' width='200px'>
          <div class="button" on:click={() => options=true}>OPTIONS</div>
          <button on:click={activateSound}>activer le son</button>
          {#if options}
            <div  class=" options rounded-lg h-64 w-40  bg-black opacity-90 border border-white absolute">
              <div class=" flex flex-col">
                <p class="text-white">change background</p>
                <div class="w-full  text-white flex"> 
                  
                  <div  class=" h-12 w-12 slotBg1 border border-white">
                    <img  src="./img/sky.jpg" alt="sky1" class="">
                  </div>
                  <div class=" h-12 w-12 slotBg2 border border-white">
                    <img src="./img/sky2.jpg" alt="sky2" class="">
                  </div>
                  <div class=" h-12 w-12 slotBg3 border border-white">
                    <img src="./img/nasa.jpg" alt="nasa" class="">
                  </div>
                </div>
              </div>
              <button on:click={() => options = false} class="close-options h-8 w-8 text-white absolute bottom-0 left-0">X</button>
            </div>
          {/if}
        </div>
      </div>
    </div>
<!-- COMPOSANT acc-MENU -->

<!-- COMPOSANT acc-FLOOR -->
<div class="flex floor">
  {#each array as square}
    <div class="sq-grass {square}">
      <img
        class="grass"
        src="./img/grass.svg"
        alt="grass"
        height="100px"
        width="120px" />
    </div>
  {/each}
</div>
<!-- COMPOSANT FLOOR -->

<!-- COMPOSANT acc-ANIM -->
<img src="./img/deadtree.svg" alt="deadtree" class="deadtree" />
<img src="./img/soucoupe.svg" alt="bullet2" class="soucoupe" />
<img src="./img/ufo.svg" alt="ufo" class="ufo" />
<img src="./img/bullet.svg" alt="bullet1" class="bullet1" />
<img src="./img/bullet.svg" alt="bullet1" class="bullet2" />



<!-- COMPOSANT acc-ANIM -->
<style>
  .header {
    height: 20%;
  }
  .title {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
  }
  @keyframes intro {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
  .animintro {
    animation: intro 4s ease-out 1;
  }
  @keyframes headMove {
    0% {
      transform: rotate(0deg);
    }
    33% {
      transform: rotate(-1deg);
    }
    66% {
      transform: rotate(1deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  .trio {
    height: 60%;
  }
  .img1,
  .img2,
  .img3 {
    animation-name: headMove;
    animation-duration: 2s;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
    animation-delay: 0.5s;
  }
  .button {
    color: white;
    opacity: 0.7;
    background-color: rgb(8, 8, 8, 0.8);
    margin: auto;
    margin-top: 2rem;
    height: 5rem;
    width: 80%;
    text-align: center;
    line-height: 4rem;
    border: 6px solid black;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .button:hover {
    transform: scale(1.2);
    background-color: rgb(147, 190, 233);
    color:black; 
    opacity:0.5; 
  }
  .sq-grass {
    width: 10%;
    height: 100%;
  }

  .options{
    z-index:10;
    bottom:30%; 
    
  }
</style>