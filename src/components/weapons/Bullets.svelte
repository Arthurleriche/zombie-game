<script>
  export let bullet;
</script>

<style>
  .bullet {
    width: 20px;
    height: 20px;
    background-color: green;
    position: absolute;
  }
</style>

<div class="bullet" style="left:{bullet.x}px; top:{bullet.y}px" />
