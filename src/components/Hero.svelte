<script>
  import { top, left } from '../game/hero';
  import { x, y } from '../stores/StoreCharacters';
</script>

<style>
  .hero {
    width: 50px;
    height: 50px;
    background-color: green;
    position: absolute;
  }
</style>

<div class="hero" style="top:{$x}px; left:{$y}px" />

<!-- /* .down {
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
  } */ -->
