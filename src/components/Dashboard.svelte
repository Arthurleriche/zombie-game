<script>
    import {lifeList, earnedCoins} from '../stores/StoreCharacters'
    import {gunBullet} from '../stores/StoreWeapon'
    import{machineGunBullet} from '../stores/StoreWeapon'
    import {level} from '../stores/Store'
    import {kills} from '../stores/Store'
</script>

<div class="dashboard relative text-black h-12 mt-12  mr-12 float-right  flex space-x-5">
    <div class="threehearts flex space-x-3">
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

    <div class="level mt-2 pl-4 text-yellow-500 font-bold">Lv.{$level}</div>
    <div class="wrapper flex flex-col space-y-2">
        <div class="kills text-white font-bold absolute ml-4 flex"><img class="h-8 w-8" src="./resources/kills.png" alt="" /> <p class="ml-2 mt-1">{$kills}</p> </div>
        <div class="munitions text-white font-bold  absolute mt-2 flex ml-4 "> <img class="h-8 w-10" src="./resources/gun1side.png" alt="" /> <p class="ml-2 mt-1">{$gunBullet - 1}</p></div> <br>
        <div class="machinegun munitions text-white font-bold  absolute mt-2 flex ml-4 "> <img class="h-8 w-10" src="./resources/machinegun1.png" alt="" /> <p class="ml-2 mt-1">{$machineGunBullet-1}</p></div>

    </div>

</div>

<style>
    .machinegun{
        right: 0px; 
        top:120px; 
    }
    .dashcoin{
        width:1.5rem;
        height:1.5rem; 
    }
    .dashboard{
        width:250px; 
        height:120px; 
    }
    .kills{
        bottom:30%;
        left:65%; 
    }

    .munitions{
        bottom:0%;
        left:65%; 
    }
    .threehearts{
        width: 100px;
        height:60px; 
    }
    #bar{
        width:25px; 
        height:10px; 
        margin-bottom:10px; 
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
