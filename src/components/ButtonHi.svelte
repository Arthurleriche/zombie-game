<script>
    import ButtonsOpenDown from './ButtonsOpenDown.svelte'
    export let title 
    export let highs
    let HiButton 

    function openDown(){
        HiButton = document.querySelector('#buttons-HIGHS')
        HiButton.style.overflow = 'scroll'
        
        if(!highs){
            HiButton.style.height = 14+'rem'
            highs = true 
            console.log('show')
        } else {
            HiButton.style.height = 5+'rem'
            HiButton.style.overflow = 'hidden'
            highs = false; 
            console.log('unshow')
        }
        console.log('OPENDOWN')
    }
</script>

<ButtonsOpenDown title= {title} highs = {highs} on:buttonOpenDown={openDown} cat={'HIGHS'}  >
    <div class="m-auto  ">
            <div>Rouky : 232 </div>
            <div>Soso : 232</div>
            <div>Mamos : 232 </div>
            <div>Soso : 232</div>
            <div>Rouky : 232 </div>
            <div>Mamos : 232</div>
            <div>^</div>
          </div>
</ButtonsOpenDown>

