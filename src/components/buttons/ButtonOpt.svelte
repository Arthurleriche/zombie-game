<script>
    import ButtonOpenDown from './ButtonsOpenDown.svelte'
    export let title 
    export let options 
    let i = 3
    let optbutton

    function openDown(){
        optbutton = document.querySelector('#buttons-OPT')
        if(!options){
            
            optbutton.style.height = 14+'rem'
            options = true 
            console.log('show')
        } else {
            optbutton.style.height = 5+'rem'
            options = false; 
            console.log('unshow')
        }
        console.log('OPENDOWN')
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
</script>


<ButtonOpenDown title = {title} on:buttonOpenDown={openDown} cat={'OPT'}>
    <div><p> Sound : <span id="soundstate"  class=" hover:text-gray-400">OFF</span> </p></div>
    <div class="flex  space-x-3 justify-center ">
        <img on:click|self={handleBg} src="./img/previous.png" alt="" id="previous"> 
        <p class="display-block align-middle">Sky {i}</p>
        <img on:click|preventDefault={handleBg} src="./img/next.png" alt="" id="next">
    </div>
</ButtonOpenDown>


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
</style>