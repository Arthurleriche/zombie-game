<script>
  // -----------------------------------------------------------
  // let development = process.env.isDev;
  // console.log(process.env.isDev);
  // if (process.env.NODE_ENV === 'production') {
  //   console.log('je suis en prod');
  // } else {
  //   console.log('je suis sur le serve');
  // }
  // -----------------------------------------------------------

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
