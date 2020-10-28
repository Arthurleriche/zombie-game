<script>
  import { x, y, direction } from '../stores/StoreCharacters';
</script>

<style>
  .hero-div {
    width: 50px;
    height: 50px;
    position: absolute;
  }

  .divHero {
    position: relative;
    width: 50px;
    height: 50px;
  }
  .hero {
    z-index: 1;
    width: 50px;
    height: 50px;
    overflow: hidden;
    position: absolute;
  }

  img {
    max-width: 600px;
    height: 400px;
  }

  .down {
    position: absolute;
    left: -50px;
  }
  .up {
    position: absolute;
    left: -50px;
    top: -150px;
  }
  .left {
    position: absolute;
    left: -50px;
    top: -50px;
  }
  .right {
    position: absolute;
    left: -50px;
    top: -100px;
  }

  .step-down {
    animation: moove 0.25s steps(2) infinite;
  }

  .step-up {
    position: absolute;
    animation: moove 0.25s steps(2) infinite;
    top: -150px;
  }

  .step-left {
    position: absolute;
    animation: moove 0.25s steps(2) infinite;
    top: -50px;
  }

  .step-right {
    position: absolute;
    animation: moove 0.25s steps(2) infinite;
    top: -100px;
  }
  @keyframes moove {
    from {
      transform: translate3d(0px, 0, 0);
    }
    to {
      transform: translate3d(-200px, 0, 0);
    }
  }
</style>

<div class="hero-div" style="top:{$y}px; left:{$x}px">
  <div class="hero">
    <img
      class="{$direction} moove-hero "
      id="hero1"
      src="./resources/space_hero.png"
      alt="" />
  </div>
</div>
