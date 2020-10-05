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
  let myDiv;

  function changeBg(){
    var y = document.body; 
    console.log(this.id); 
    switch(this.id){
      case 'sky':
        y.style.backgroundImage = "url('./img/sky.jpg')";
        break; 

      case 'sky2':
        y.style.backgroundImage = "url('./img/sky2.jpg')";
        break; 

      case 'sky3':
        y.style.backgroundImage = "url('./img/sky3.jpg')";
        break; 

      case 'sky4':
        y.style.backgroundImage = "url('./img/sky4.jpg')";
        break; 
    }
  }


  function showOptions(){
    console.log(this.className); 
    this.style.height = 16+'rem'
    

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
            <p>OPTIONS </p>
            <p>OPTIONS </p>
            <p class="w-12">  ^  </p>
          </div>
        </div>
        <div class="animintro">
          <img class="img2" src='./img/ET1.png' alt='ET2' width='300px'>
          <div class="newg-button" on:click|preventDefault={() => newGame=true}>NEW GAME</div>
          
        </div>
        <div class="animintro" >
          <img class="img3" src='./img/ET2.png' alt='ET3' width='200px'>
          <div  class="opt-button" on:click={() => options=false} on:click={showOptions}>OPTIONS
            <p>OPTIONS </p>
            <p>OPTIONS </p>
            <p class="w-12">   wsh    </p>

          </div> 
          <!-- changer "options" en TRUE  -->
          <button on:click={activateSound}>activer le son</button>

          <!-- {#if options}
            <div  class=" options rounded-lg h-64 w-40  bg-gray-400 opacity-90 border border-white absolute">
              <div class=" flex flex-col">
                <p class="text-gray-900 text-center">Choose background</p>
                <div class="w-full  text-white flex space-x-2 p-2"> 
                  <div  class=" h-8 w-8 slot-bg ">
                    <img id="sky" src="./img/sky-thumbnail.jpg" alt="sky" class="" on:click={changeBg}/>
                  </div>
                  <div  class=" h-8 w-8 slot-bg ">
                    <img id="sky2" src="./img/sky2-thumbnail.jpg" alt="sky2" class="" on:click={changeBg}/>
                  </div>
                  <div class=" h-8 w-8 slot-bg ">
                    <img id="sky4" src="./img/sky4-thumbnail.jpg" alt="sky4" class="" on:click={changeBg}/>
                  </div>
                  <div class=" h-8 w-8 slot-bg ">
                    <img id="sky3" src="./img/sky3-thumbnail.jpg" alt="sky3" class="" on:click={changeBg}/>
                  </div>
                </div>
              </div>
              <button on:click={() => options = false} class="close-options h-8 w-8 text-white absolute bottom-0 left-0">X</button>
            </div>
          {/if} -->


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
  .opt-button, .newg-button, .hiscores-button {
    color: white;
    opacity: 0.7;
    background-color: rgb(8, 8, 8, 0.8);
    margin: auto;
    margin-top: 2rem;
    height: 5rem;
    width: 12rem;
    text-align: center;
    line-height: 4rem;
    border: 6px solid black;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 1.2rem;
    cursor: pointer;
    letter-spacing: 2px;
    transition:1s;
    overflow:hidden; 
  }
  .opt-button:hover, .newg-button:hover, .hiscores-button:hover {
    /* accueil */
    /* background-color: rgb(147, 190, 233);
    color:black; 
    opacity:0.5;  */

    /* accueil2 */
    background-color:#21ffb5;
    color:#111; 
    box-shadow: 0 0 50px #21ffb5;
  }

  .button:nth-child(3){
        filter:hue-rotate(125deg);
    }


  
  .sq-grass {
    width: 10%;
    height: 100%;
  }

  .options{
    opacity:0.5; 
    z-index:10;
    /*
    bottom:30%; 
    right:5%; 
    transition-duration:2s;  */
    
  }

  .slot-bg:hover{
    transform:scale(1.2); 
    border:1px solid rgb(71, 69, 69);
    box-shadow:hotpink;
  }
</style>