
<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
export let newTask = ''; 





   
</script>




{JSON.stringify(newTask)}


    <!-- addNewTask -->
    <div class="flex absolute leftcentre ml-16">
        <input  class="text-gray-500" placeholder="WESH" type="text" value={newTask} >
        <button class="animate-bounce bg-blue-500  w-8 text-white rounded ml-2">+</button>
    </div>

    



