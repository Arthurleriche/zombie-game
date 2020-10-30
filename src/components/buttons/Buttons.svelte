<script>
    //props
    export let title; 
    export let cat; 
    
    // function handleSound(){
    //     console.log('handlesound')
    //     if(this.innerHTML === 'ON'){
    //         $sound = !$sound
    //         this.innerHTML ='OFF'
    //     } else {
    //         $sound = !$sound
    //         this.innerHTML ='ON'
    //     }
    // }
</script>

    <div id ="buttons-{cat}" class="buttons" > <p on:click >{title}</p>
        <slot/>
    </div> 

  <style>
    .buttons {
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
        
    }
    .buttons:hover {
        background-color:#21ffb5;
        color:#111; 
        box-shadow: 0 0 50px #21ffb5;
    }
  </style>