<script>
  import Button from './buttons/Buttons.svelte'
  import ButtonOpt from './buttons/ButtonOpt.svelte'
  import ButtonHi from './buttons/ButtonHi.svelte'
  
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  export let newGame;
</script>


<div class="manette m-auto w-5/6"> 
  <div class="trio flex justify-center w-3/5 space-x-16 my-8 mx-auto">
    <div class="animintro">
      <img class="img1" src='./img/ET3.png' alt='ET1' width='200px'>
      <ButtonHi title = {'Hi Scores'} highs = {false} />
    </div>
    <div class="animintro">
      <img class="img2" src='./img/ET1.png' alt='ET2' width='300px'>
      <Button title = {'NEW GAME'} cat={'NewGame'} on:click={() => newGame=true}/>
    </div>
    <div class="animintro" >
      <img class="img3" src='./img/ET2.png' alt='ET3' width='200px'>
      <ButtonOpt title = {'Options'} options = {false}/>
    </div>
  </div>
</div>

<div class="flex floor">
  {#each array as square}
    <div class="sq-grass {square}">
      <img class="grass" src="./img/grass.svg" alt="grass" height="100px" width="120px" />
    </div>
  {/each}
</div>

<img src="./img/bullet.svg" alt="bullet1" class="bullet1" />
<img src="./img/bullet.svg" alt="bullet1" class="bullet2" />


<style>
  .header {
    height: 20%;
  }
  .title {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
  }
  @keyframes intro {
    from {transform: scale(0);}
    to {transform: scale(1);}
  }
  .animintro {
    animation: intro 1.5s ease-out 1;
  }
  @keyframes headMove {
    0% {transform: rotate(0deg);}
    33% {transform: rotate(-1deg);}
    66% {transform: rotate(1deg);}
    100% {transform: rotate(0deg);}
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
  .sq-grass {
    width: 10%;
    height: 100%;
  }
</style>