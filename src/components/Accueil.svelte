<script>
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  export let newGame;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  console.log(newGame);
</script>

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
  }
  .sq-grass {
    width: 10%;
    height: 100%;
  }
</style>

<!-- COMPOSANT acc-MENU -->
<div class="manette m-auto w-5/6"> 
      <div class="trio flex justify-center w-3/5 my-8 mx-auto">
        <div class="animintro">
          <img class="img1" src='./img/zombie1.svg' alt='zombie-1' width='200px'>
          <div class="m-auto button ">HI SCORES</div>
        </div>
        <div class="animintro">
          <img class="img2" src='./img/zombie3.svg' alt='zombie-3' width='300px'>
          <div class="button" on:click|preventDefault={() => newGame=true}>NEW GAME</div>
        </div>
        <div class="animintro" >
          <img class="img3" src='./img/zombie4.svg' alt='zombie-4' width='200px'>
          <div class="button">OPTIONS</div>
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
