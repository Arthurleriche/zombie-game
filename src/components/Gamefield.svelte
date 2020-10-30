<script>
  import { createEnemy } from '../game/enemy';
  import { boost } from '../game/bonus';
  import { startGame, playerAmbiance } from '../game/gameloop';
  import GameOver from './Gameover.svelte'
  import {gameOver} from '../stores/Store'
  console.log('gameOver from gamefield : ' + $gameOver);
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
</style>

<div>
  <div class="gamefield m-auto" style="background-image: url('./resources/background_1.png')">
    <slot />
    <p class=" controls text-lg text-red-600">
      Touches directionnelles = mouvement, espace = weapon
    </p>
    {#if $gameOver}
    <GameOver/>
    {/if}
  </div>
</div>

