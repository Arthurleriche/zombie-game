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

  .container{
    /* border:4px solid white;  */
    height: 580px; 
    width:920px; 
  }
  .gamefield {
    height: 570px;
    width: 900px;
    background-size: cover;
    /* border: 3px solid rgb(252, 252, 252); */
    position: relative;
    border: 5px solid;
    border-image: conic-gradient(red, yellow, lime, aqua, blue, magenta, red) 1;
  }
  
</style>

<div class="container">
  <div class="gamefield m-auto" style="background-image: url('./resources/background_1.png')">
    <slot />
    <Deco/>
    <Dashboard/>
    {#if $gameOver}
    <GameOver/>
    {/if}
  </div>
</div>

