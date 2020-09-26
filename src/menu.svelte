<Tailwindcss />
<script>
    import Tailwindcss from './Tailwindcss.svelte';
   let newGame = false; 

    let current = 'newgame'

    function startGame(){
        newGame = true; 
    }
</script>

<style>
                    /*  M E N U - STYLE  */
    @font-face {
	    font-family: "Romance";
	    src: url('romance.ttf');
    }
    .menu {
        /* width: 20%; 
        height:40%;  */
        top:35%; 
        left: 40%; 
        background-color:rgba(22, 22, 22, 0.5)
    }

    .button{
        width: 100%;
        height:7vh;
        border-radius:1em;
        background-color:rgb(31, 29, 29);
        margin: 10px 0 10px 0 ;
        font-weight: bold; 
        border-width: 2px;
    }
    .button:hover{
        background-color: rgb(77, 24, 24); 
    }
    .button:active{
        background-color:green; 
    }

    .BG {
        width: 100vw; 
        height: 100vh; 
    }
    .logo{
        width:60%;
        height:45%;
        left:20%;
        top:-30px;
    }
                        /*  M E N U - STYLE  */
</style>


<!-- {#if newGame}
    <div> LETS GO </div>
{:else}
    <div class=" border border-black container2 m-0 p-0 w-full h-auto">
        <!-- <img class="BG relative" src=" https://images7.alphacoders.com/812/812638.jpg" alt=""/>
        <img class =" logo z-20 absolute" src="./img/zlogo.png" alt=""/> -->
    <!-- </div>
{/if} --> 



