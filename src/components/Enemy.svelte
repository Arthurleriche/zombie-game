<script>
  export let enemy;
  console.log(enemy);
</script>

<style>
  .enemy {
    width: 10px;
    height: 10px;
    background-color: red;
    position: absolute;
  }
</style>

<div class="enemy" style="top:{enemy.top}px; left:{enemy.left}px" />
