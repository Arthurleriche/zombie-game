<script>
  //svelte 
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  // components
  import Options from './Options.svelte';
  // stores
  import { sound } from './StoreOption.js';
  // variables
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  export let newGame;

  function activateSound() {
    $sound = !$sound;
  }
  function showHiScores(){
    console.log(this.className); 
    this.style.height = 16+'rem'
  }
  
</script>

<!-- COMPOSANT acc-MENU -->
<div class="manette m-auto w-5/6"> 
      <div class="trio flex justify-center w-3/5 space-x-16 my-8 mx-auto">
        <div class="animintro">
          <img class="img1" src='./img/ET3.png' alt='ET1' width='200px'>
          <div class="m-auto hiscores-button " on:click={showHiScores}>HI SCORES
            <div>Rouky : 232 </div>
            <div>Soso : 232</div>
            <div>Mamos : 232 </div>
            <div>Soso : 232</div>
            <div>Rouky : 232 </div>
            <div>Mamos : 232</div>
            <div>^</div>
          </div>
        </div>
        <div class="animintro">
          <img class="img2" src='./img/ET1.png' alt='ET2' width='300px'>
          <div class="newg-button" on:click|preventDefault={() => newGame=true}>NEW GAME</div>
          
        </div>
        <div class="animintro" >
          <img class="img3" src='./img/ET2.png' alt='ET3' width='200px'>
          <Options/>
          <button on:click={activateSound}>activer le son</button>
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
    animation: intro 1.5s ease-out 1;
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
   .newg-button, .hiscores-button {
    color: white;
    opacity: 0.7;
    background-color: rgb(8, 8, 8, 0.8);
    margin: auto;
    margin-top: 2rem;
    height: 5rem;
    width: 15rem;
    text-align: center;
    line-height: 4rem;
    border: 6px solid black;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 1.2rem;
    cursor: pointer;
    letter-spacing: 2px;
    transition:0.5s;
    z-index:200; 
    overflow:scroll; 
  }
  .newg-button:hover, .hiscores-button:hover {
    background-color:#21ffb5;
    color:#111; 
    box-shadow: 0 0 50px #21ffb5;
  }
  .sq-grass {
    width: 10%;
    height: 100%;
  }
</style>