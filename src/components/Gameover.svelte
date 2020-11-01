<script>
import {startGame} from '../game/gameloop.js'
import {gameOver, kills, level} from '../stores/Store.js'
import { createEnemy} from "../game/enemy";
import {isPlaying} from '../stores/Store'
import { speed } from '../stores/StoreCharacters.js';
import { gunBullet } from '../stores/StoreWeapon.js';
import {earnedCoins} from '../stores/StoreCharacters.js';

function handleRetry() {
    startGame() 
    createEnemy()
    $gameOver = false
    document.getElementById('energy1').style.width = '100%'
    document.getElementById('energy2').style.width = '100%'
    document.getElementById('energy3').style.width = '100%'
    isPlaying.update(a => true)

    earnedCoins.update(a => 0)    
    level.update(a => 1)
    kills.update(a=>0)
    speed.update(a => 4)
    gunBullet.update(a => 10)
}
</script>


<div class="gameover text-pink font-bold  p-3 flex flex-col justify-center"> 
    <p class="text-center">GAME OVER </p>
    <button class="retry text-black text-xl font-bold bg-green-400 border border-white rounded-lg" on:click={handleRetry}> RETRY</button>
    <p class="text-2xl text-center">YOU HAVE KILLED {$kills} ALIENS</p>
    <p class="text-2xl text-center text-orange-500">YOU HAVE WON {$earnedCoins} COINS</p>
</div>


<style>
    .gameover{
        width:400px; 
        height:300px; 
        position:absolute;
        top:50%;
        left:50%; 
        transform: translate(-50%, -50%);
        color: rgb(161, 15, 15);
        font-size: 1rem;
        animation : animate-gameover 3s 1; 
        animation-fill-mode: forwards; 
        border:3px solid black; 
        /* background-image: url('./resources/backorund4.png'); */
        background-color: black; 
        border-radius:30px; 
        border: 3px solid grey; 
        opacity:0.8;
    }

    @keyframes animate-gameover {
        from {font-size:1rem}
        to {font-size:4rem}
    }

    button:hover{
        opacity:1; 
        color:white; 
        background-color:rgb(43, 136, 43); 
    }
</style>


