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
  import { startGame } from '../game/gameloop';
  createEnemy();
  startGame();
</script>

<style>
  .gamefield {
    height: 570px;
    width: 900px;
    border: 3px solid white;
    position: relative;
  }
</style>

<div class="gamefield m-auto">
  <slot />
</div>
