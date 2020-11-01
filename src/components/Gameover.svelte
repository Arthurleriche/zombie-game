<script>
import {startGame} from '../game/gameloop.js'
import {gameOver, kills, level} from '../stores/Store.js'
import { createEnemy} from "../game/enemy";
import {isPlaying} from '../stores/Store'
import { speed } from '../stores/StoreCharacters.js';

function handleRetry() {
    startGame() 
    createEnemy()
    $gameOver = false
    document.getElementById('energy1').style.width = '100%'
    document.getElementById('energy2').style.width = '100%'
    document.getElementById('energy3').style.width = '100%'
    isPlaying.update(a => true)

    
    level.update(a => 1)
    kills.update(a=>0)
    speed.update(a => 4)
}
</script>


<div class="gameover text-pink font-bold  flex flex-col justify-center"> 
    <p>GAME OVER </p>
    <button class="retry text-black text-xl font-bold bg-green-400 border border-white rounded-lg" on:click={handleRetry}> RETRY</button>
</div>


<style>
    .gameover{
        position:absolute;
        top:50%;
        left:50%; 
        transform: translate(-50%, -50%);
        color: rgb(161, 15, 15);
        font-size: 1rem;
        animation : animate-gameover 3s 1; 
        animation-fill-mode: forwards; 
    }

    @keyframes animate-gameover {
        from {font-size:1rem}
        to {font-size:4rem}
    }
</style>


