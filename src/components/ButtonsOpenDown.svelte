<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import Buttons from './Buttons.svelte'

    export let title 
    export let cat 

    function handleOpen(){
        dispatch("buttonOpenDown")
        console.log('HANDLED ONOFF')
    }
</script>

<Buttons title={title} on:click={handleOpen} cat={cat}>
    <slot/> 
</Buttons>