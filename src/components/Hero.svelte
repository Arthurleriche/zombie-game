<script>
  import { step } from './StoreCharacters.js';
  import { direction } from './StoreCharacters.js';
</script>

<style>
  .hero {
    width: 48px;
    height: 48px;

    overflow: hidden;

    position: relative;
  }

  #hero {
    padding: 0;
  }
  img {
    max-width: 600px;
    height: 400px;
  }

  .down2 {
    position: absolute;
  }
  .down1 {
    position: absolute;
    left: -50px;
  }
  .down2 {
    position: absolute;
    left: -100px;
  }
  .up2 {
    position: absolute;
    top: -150px;
  }
  .up1 {
    position: absolute;
    top: -150px;
    left: -50px;
  }
  .up3 {
    position: absolute;
    top: -150px;
    left: -100px;
  }
  .right1 {
    position: absolute;
    top: -100px;
    left: -50px;
  }
  .right2 {
    position: absolute;
    top: -100px;
  }
  .right3 {
    position: absolute;
    top: -100px;
    left: -100px;
  }
  .left1 {
    position: absolute;
    top: -50px;
    left: -50px;
  }
  .left2 {
    position: absolute;
    top: -50px;
  }
  .left3 {
    position: absolute;
    top: -50px;
    left: -100px;
  }
</style>

<div>
  <div class="hero">
    <img
      class="{$direction}{$step}"
      id="hero"
      src="./resources/space_hero.png"
      alt="" />
  </div>
</div>
