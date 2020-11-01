<script>

  export let enemy;
  import {level} from '../stores/Store'

</script>

<style>
  .enemy {
    position: absolute;
    z-index:30; 
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

  @keyframes moove3 {
    from {
      transform: translate3d(0px, 0, 0);
    }
    to {
      transform: translate3d(-250px, 0,0);
    }
  }

  /* ---------LEVEL 2 ------------- */

  .alien2{
    width: 50px;
    height: 50px;
    overflow: hidden;
    position: relative;
    
  }

  .step-up2{
    position: absolute;
    left: 0px; 
    top: -150px;
    animation: moove 0.25s steps(3) infinite;
  }

  .step-right2{
    position: absolute;
    left: 0px; 
    top:-100px;
    animation: moove 0.25s steps(3) infinite;
  }

  .step-down2{
    position: absolute;
    left: 0px; 
    top: 0px;
    animation: moove 0.25s steps(3) infinite;
  }

  .step-left2{
    position: absolute;
    left: 0px; 
    top: -50px;
    animation: moove 0.25s steps(3) infinite;
  }
  /* ---------LEVEL 3 ------------- */

  .alien3{
    width: 70px;
    height: 100px;
    overflow: hidden;
    position: relative;
  }

  .step-down3{
    position: absolute;
    left: 0px; 
    top: 0px;
    /* animation: moove3 0.5s steps(3) infinite; */
  }

  .step-left3{
    position: absolute;
    left: 0px; 
    top: -100px;
    /* animation: moove3 0.5s steps(3) infinite; */
  }

  .step-up3{
    position: absolute;
    left: 0px; 
    top: -300px;
    /* animation: moove 0.25s steps(3) infinite; */
  }

  .step-right3{
    position: absolute;
    left: 0px; 
    top: -200px;
    /* animation: moove 0.25s steps(3) infinite; */
  }
</style>

{#if $level === 1}
  <div class="enemy" style="top:{enemy.top}px; left:{enemy.left}px">
    <div class="alien1">
      <img
        class={enemy.direction}
        id="alien1"
        src="./resources/enemy.png"
        alt="" />
    </div>
  </div>
{/if}

{#if $level === 2}
  <div class="enemy " style="top:{enemy.top}px; left:{enemy.left}px">
    <div class="alien2">
      <img
      class={enemy.direction}
      id="alien2"
      src="./resources/enemy.png"
      alt="" />
    </div>
  </div>
{/if}


{#if $level === 3}
  <div class="enemy " style="top:{enemy.top}px; left:{enemy.left}px">
    <div class=" alien3">
      <img
      class={enemy.direction}
      id="alien3"
      src="./resources/spacebot.png"
      alt=""
      style="" />
    </div>
  </div>
{/if}
