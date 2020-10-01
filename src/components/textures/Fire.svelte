<script>
  console.log('je suis fire');
</script>

<style>
  .tt {
    height: 100px;
    width: 50px;
    display: flex;
    justify-content: center;
  }
  .fire {
    width: 30px;
    height: 30px;
    position: relative;
    overflow: hidden;
    margin: 0;
    padding: 0px;
    display: block;
    animation: fire-bomb-active 0.4s infinite;
  }

  #fire {
    max-width: 320px;
    height: 400px;
  }

  .fire-bomb {
    position: absolute;
    top: -80px;
  }

  @keyframes fire-bomb-active {
    0% {
      height: 50px;
    }
    20% {
      height: 64px;
    }
    30% {
      height: 30px;
    }
    50% {
      height: 58px;
    }
  }
</style>

<div class="tt">
  <div class="fire">
    <img class="fire-bomb" id="fire" src="./resources/texture1.png" alt="" />
  </div>
</div>
