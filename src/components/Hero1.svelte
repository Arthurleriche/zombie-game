<style>
    #svelte {
      position: absolute; 
      top:0px;
      left:0px;
      /* background-color: transparent;  */
      transition-property: left, top;
      transition-duration: 0.07s;
      transition-timing-function: linear; 
      border-radius:10rem;
      z-index:10;
    }
</style>

<script>
    let key; 
    let keycode;
    let top = 0; // y héro 
    let left = 0; // x héro 
    let step = 20; 
    let radius1 = 50 // héro 
    let radius2 = 110 // zombie 


    let cx = 50; 
    $: cx = left + 50
    let cy =50; 
    $: cy = top + 50
    let c2x = 200 + 110  // largeur + rayon en pixel 
    let c2y = 200 + 110

    let dx = 0; 
    $: dx = c2x - cx
    console.log('zombie X: ' + c2x + '  zombie Y: ' + c2y)

    let dy = 0; 
    $: dy = c2y -cy 

    let distance = 430; 
    $: distance = Math.sqrt(dx*dx + dy*dy)


    
    function handleKeyup(event){
      key = event.key
      keycode = event.keyCode

        switch (keycode){
            case 38 :
            // alert('WESH')
      }
    }


    function handleKeydown(event){
        key = event.key
        keycode = event.keyCode
    
        switch (keycode){
            case 90 : // HAUT 
            top -= step
            svelte.style.top = top + 'px'
            svelte.style.transform = 'rotate(' + 180 +'deg)'
            checkCollision(); 


            break; 

            case 68: // DROITE
            left += step 
            svelte.style.left = left + 'px'
            svelte.style.transform = 'rotate(' + -90 +'deg)'
            checkCollision(); 
            break;    
            
            case 83: // BAS 
            top += step
            svelte.style.top = top + 'px'
            svelte.style.transform = 'rotate(' + 0 +'deg)'
            checkCollision(); 
            break;

            case 81: // GAUCHE 
            left -= step 
            svelte.style.left = left + 'px'
            svelte.style.transform = 'rotate(' + 90 +'deg)'
            checkCollision(); 
            break;
        }
    }

    let collision = false; 
    function checkCollision(){
      if(distance <= 165){
          svelte.style.left = left - 100 + 'px' 
          // svelte.style.animation = 'hurted 2s'
          left -= 100
          collision=true; 
          console.log('collision '+ collision )
          console.log('YOU LOSE')
        } else {
          collision = false  
        }
    }
</script>

<svelte:window on:keydown|preventDefault={handleKeydown} on:keyup|preventDefault = {handleKeyup}/>
<img id = "svelte" src="./img/zombie.svg" class="border border-black " alt="un triangle aux trois côtés égaux" width="100px" />