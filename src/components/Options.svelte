<script>
    import { sound } from './StoreOption.js';

    var options = false
    let i = 3

    function showOptions(){
        if(!options){
            let optbutton = document.querySelector('#options-button')
            optbutton.style.height = 16+'rem'
            options = true 
            console.log('show')
        }
    }
    function unshowOptions(){
        if(options){
        let optbutton = document.querySelector('#options-button')
        optbutton.style.height = 5+'rem'
        options = false; 
        console.log('unshow')
        }
    }
    function handleBg(){
        console.log(this.className)
        let body = document.body
        if(this.id ==="previous"){
            if(i===1){
                return;
            } else {
                i-=1
            }
            body.style.backgroundImage = "url('./img/sky" + i +".jpg')"
        } else {
            if(i===4){
                return;
            } else {
                i += 1 
            }
            body.style.backgroundImage = "url('./img/sky" + i +".jpg')"
        }
    }
    function handleSound(){
        console.log('handlesound')
        if(this.innerHTML === 'ON'){
            $sound = !$sound
            this.innerHTML ='OFF'
        } else {
            $sound = !$sound
            this.innerHTML ='ON'
        }
        // handleAudio(); 
    }
</script>



<div id="options-button" class="opt-button" > <p on:click|preventDefault={showOptions}>OPTIONS</p>
    <div><p> Sound : <span id="soundstate" on:click={handleSound}>OFF</span> </p></div>
    <div class="flex  space-x-3 justify-center ">
        <img on:click|self={handleBg} src="./img/previous.png" alt="" id="previous"> 
        <p class="display-block align-middle">Sky {i}</p>
        <img on:click|preventDefault={handleBg} src="./img/next.png" alt="" id="next">
    </div>
    <div on:click|self={unshowOptions}>^</div>
  </div> 

  <style>
    #previous, #next{
    height:2rem; 
    width:2rem; 
    white-space:nowrap;
    transform: translateY(50%);
  }

  #previous:active, #next:active{
      filter: blur(1px);

  }


  .opt-button {
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
    transition:1s;
    overflow:hidden; 
    z-index:200; 
    overflow:scroll; 
  }
  .opt-button:hover {
    background-color:#21ffb5;
    color:#111; 
    box-shadow: 0 0 50px #21ffb5;
  }
  </style>