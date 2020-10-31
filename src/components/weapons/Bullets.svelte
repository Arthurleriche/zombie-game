<script>
  export let bullet;
</script>

<style>
  .bullet {
    width: 20px;
    height: 20px;
    position: absolute;
  }

  .down {
    width: 20px;
    height: 20px;
    transform: rotate(90deg)
  }

  .left{
    width: 20px;
    height: 20px;
    transform: rotate(180deg)
  }

  .up{
    width: 20px;
    height: 20px;
    transform: rotate(-90deg)
  }
</style>

<img src="./img/bullet.svg" alt="" class="bullet" style="left:{bullet.x}px; top:{bullet.y}px" />
