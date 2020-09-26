<style>
    @font-face {
        font-family: 'zbg';
        src: url('Deanna.ttf');
    
    }
    
    .zbt{
      font-family: 'zbg';
    }
    
    @keyframes spin{
      from{transform: rotate(0deg)}
      to {transform: rotate(1440deg)}
    }
    
    @keyframes zoom{
      from{transform: scale(1)}
      to{transform: scale(3)}
    }
    
    .zombieimg{
      animation-name: spin; 
      animation-duration:3s; 
      animation-iteration-count:1 ;
      animation-timing-function: cubic-bezier(.17,.91,.54,.72);
      margin-top:20%;
      
    }
    
    .wrap-img{
      animation-name: zoom; 
      animation-duration:3s; 
      animation-iteration-count:1 ;
      animation-timing-function: cubic-bezier(.17,.91,.54,.72);
    
    }
    
  
    .header{
      height:20%; 
    }
    
    
    @keyframes headMove{
      0% {transform: rotate(0deg);}
      33% {transform: rotate(-1deg);}
      66% {transform:rotate(1deg);}
      100%{transform: rotate(0deg);}
      }
    
      /* .main{
        height:95%; 
      } */
    
      .img1, .img2, .img3{
        animation-name: headMove; 
        animation-duration: 2s;
        animation-timing-function: ease-in;
        animation-iteration-count: infinite;
        animation-delay: 0.5s;
      }
    
      .button{
        margin:auto; 
        margin-top:10px; 
        height: 5rem;
        width:10rem; 
        background-color:white;     
        /* rgb(100, 149, 196) */
        text-align:center; 
        line-height:4rem;
        border: 6px solid black; 
        font-family:'Courier New', Courier, monospace;
        font-weight: bold;
        font-size: 1.5rem;
        cursor:pointer;
      }
    
      .title{
        font-family:'Courier New', Courier, monospace;
        font-weight: bold;
      }
    
      .sq{
        width:10%;
        height:100%; 
        
      }
    
      .trio{
        height:60%;
      }
    
      /* .grass2{
        margin-left:12px;
        margin-bottom:20px;
        color:rgb(53, 50, 50);
      } */
    
      @keyframes grow{
        0% {transform:scale(1); transform:translate(200)}
        50%{transform:scale(1.5)}
        100% {transform:scale(1)}
    
      }

      .grass{
        position : absolute;
        bottom:-20px; 
      }
      /* .hand2{
    
        bottom:50%;
        left:44%;
    
        animation-name: grow; 
        animation-duration:2s;
        animation-iteration-count: infinite;
         
      } */
    </style>
    
    
    <script>
    let array = [1,2,3,4,5,6,7,8,9,10]; 
    export let newGame;  
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    console.log(newGame)
      
    </script>
    
    
    
    <div class="main  w-full"> 
      <div class="trio flex justify-center space-x-20 mt-12">
        <div >
          <img class="img1" src='./img/zombie1.svg' alt='zombie-1' width='200px'>
          <div class="m-auto button">HI SCORES</div>
        </div>
        <div >
          <img class="img2" src='./img/zombie3.svg' alt='zombie-3' width='300px'>
          <div class="button" on:click|preventDefault={() => newGame=true}>NEW GAME</div>
        </div>
        <div >
          <img class="img3" src='./img/zombie4.svg' alt='zombie-4' width='200px'>
          <div class="button">OPTIONS</div>
        </div>
      </div>
    

      <div class="flex">
        {#each array as square}
          <div class="sq {square}">
            <img class = "grass" src = "./img/grass.svg"  alt =  "grass"  height = "100px" width = "120px" />
          </div>
        {/each}
        <!-- <img class = "hand2 absolute" src = "./img/living-dead2.svg"  alt =  "zombie hand"  height = "100px" width = "120px" /> -->
      </div>
    
      
    </div>