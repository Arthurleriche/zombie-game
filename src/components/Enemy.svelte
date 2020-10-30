<script>

  export let enemy;

</script>

<style>
  .enemy {
    position: absolute;
  }
  .alien1 {
    width: 50px;
    height: 50px;
    overflow: hidden;
    position: relative;
  }
  img {
    max-width: 600px;
    height: 400px;
  }
  .down {
    position: absolute;
    left: -500px;
    top: -200px;
  }
  .left {
    position: absolute;
    left: -500px;
    top: -250px;
  }
  .right {
    position: absolute;
    left: -500px;
    top: -300px;
  }
  .up {
    position: absolute;
    left: -500px;
    top: -350px;
  }
  .step-down {
    position: absolute;
    left: -450px;
    animation: moove 0.25s steps(3) infinite;
    top: -200px;
  }
  .step-up {
    animation: moove 0.25s steps(3) infinite;
    position: absolute;
    left: -450px;
    top: -350px;
  }
  .step-left {
    position: absolute;
    animation: moove 0.25s steps(3) infinite;
    top: -250px;
    left: -450px;
  }
  .step-right {
    animation: moove 0.25s steps(3) infinite;
    position: absolute;
    left: -450px;
    top: -300px;
  }
  @keyframes moove {
    from {
      transform: translate3d(0px, 0, 0);
    }
    to {
      transform: translate3d(-150px, 0, 0);
    }
  }
</style>

<div class="enemy" style="top:{enemy.top}px; left:{enemy.left}px">
  <div class="alien1">
    <img
      class={enemy.direction}
      id="alien1"
      src="./resources/enemy.png"
      alt="" />
  </div>
</div>
