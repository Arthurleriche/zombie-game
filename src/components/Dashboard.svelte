<script>
    import {lifeList, earnedCoins} from '../stores/StoreCharacters'
    console.log('DASH SVELTE');
    console.log($lifeList)
</script>

<div class="dashboard relative text-black h-12 mt-12  mr-12 float-right  flex space-x-5">

    <div class="3hearts flex space-x-3">
    <!-- {#each $lifeList as life }
        <div class="h-12 w-12 bg-red-500 sq{life.id}">BJ</div>
    {/each} -->

        <div id="keur1" class="flex flex-col">
            <img src="./resources/heart2.png" alt="" class="heart2 h-4 w-4 m-auto coeur">
            <div id ="bar" class="bar h-4 w-12 border border-white ">
                <div  id="energy1"></div>
            </div>
        </div>

        <div id="keur2" class="flex flex-col">
            <img src="./resources/heart2.png" alt="" class="heart2 h-4 w-4 m-auto coeur">
            <div id ="bar" class="bar h-4 w-12 border border-white ">
                <div  id="energy2"></div>
            </div>
        </div>

        <div id="keur3"  class="flex flex-col">
            <img src="./resources/heart2.png" alt="" class="heart2 h-4 w-4 m-auto coeur">
            <div id ="bar" class="bar h-4 w-12 border border-white ">
                <div  id="energy3"></div>
            </div>
        </div>

    </div>

    <div class="earnedcoins flex space-x-6">
        <img src="./resources/coin.png" alt="" class="dashcoin mt-2 ml-2">
        <p class=" coinsearned font-bold text-white absolute pl-4 pt-2 ">{$earnedCoins}</p>
    </div>
    
</div>

<style>
    .dashcoin{
        width:1.5rem;
        height:1.5rem; 
    }
    .dashboard{
        width:280px;  
    }
    #bar{
        width:25px; 
        height:10px; 
    }
    #energy1{
        /* border:3px solid black;  */
        width:100%; 
        height:100%; 
        background-color: rgb(109, 184, 109); 
    }
    #energy2{
        width:100%; 
        height:100%; 
        background-color: rgb(109, 184, 109); 
    }
    #energy3{
        width:100%; 
        height:100%; 
        background-color: rgb(109, 184, 109);
    }


    
</style>
