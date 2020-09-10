<script>
    
    export let todo = {}
    import { createEventDispatcher } from 'svelte'

     const dispatch = createEventDispatcher();



    function onCheck() {
        dispatch('change', {completed: !todo.completed})
    }

    function sayHello() {
        dispatch('message', {text: 'Hello!' });
    }

    function onInput (e){
        dispatch ('input', {name: e.target.value})
    }




 </script>

 
 <li class=" flex justify-around p-4 borderbottom shadow-md "><input class="h-4 mt-1 float-left" type="checkbox" checked={todo.completed} on:change={onCheck} > 

 <input class=" focus: bg-grey focus:text-black border-none bg-transparent" type="text" value={todo.name} on:input={onInput}></li> 
  












