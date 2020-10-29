<script>
  import { createEnemy } from '../game/enemy';
  import { startGame, playerAmbiance } from '../game/gameloop';

  playerAmbiance();
  createEnemy();
  startGame();
</script>

<style>
  .gamefield {
    height: 570px;
    width: 900px;
    background-size: cover;
    border: 3px solid white;
    position: relative;
  }
  p {
    color: white;
    text-align: center;
    font-size: 40px;
    margin-bottom: 30px;
  }
</style>

<div>
  <p>Touche directionnelles = mouvement, espace = weapon</p>
  <div
    class="gamefield m-auto"
    style="background-image: url('./resources/background_1.png')">
    <slot />
  </div>
</div>
