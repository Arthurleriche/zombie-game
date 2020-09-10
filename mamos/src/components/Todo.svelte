<script>
export let task={}
export let color; 

import {createEventDispatcher} from 'svelte'

const dispatch = createEventDispatcher();

function onCheck(){
    dispatch('change', {completed: !task.completed})
}

</script>


<li class=" h-10 text-white shadow-md mt-2 opacity-100 hover:opacity-75" style="border-bottom: 1px solid {color}">

    <input class="float-left mt-1 ml-8"  type="checkbox" checked={task.completed} on:change={onCheck}>

    <div class="truncate">{task.name}</div>
</li>

