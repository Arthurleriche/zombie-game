<script>
  import { createEnemy } from '../game/enemy';
  import { startGame, playerAmbiance } from '../game/gameloop';
  import GameOver from './Gameover.svelte'
  import {gameOver} from '../stores/Store'
  import Dashboard from './Dashboard.svelte'
  import Deco from './Deco.svelte'
  playerAmbiance();
  createEnemy();
  startGame();
</script>

<style>
  .gamefield {
    height: 570px;
    width: 900px;
    background-size: cover;
    border: 3px solid rgb(252, 252, 252);
    position: relative;
  }
  p {
    color: white;
    text-align: center;
    margin-bottom: 30px;
  }
  .controls {
    position: absolute;
    bottom: 0;
    left: 40%;
  }
/* 
  .container{
    width:50px; 
    height:50px; 
    overflow:hidden; 
    position:relative;
    border:1px solid green; 
  } */


  
</style>

<div>
  <div class="gamefield m-auto" style="background-image: url('./resources/background_1.png')">
    <slot />
    <Deco/>
    <Dashboard/>
    {#if $gameOver}
    <GameOver/>
    {/if}
  </div>
</div>

