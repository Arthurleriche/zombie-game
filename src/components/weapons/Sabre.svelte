<script>
  export let sabreX;
  export let sabreY;
  console.log(sabreX);
</script>

<style>
  .sabre {
    height: 50px;
    width: 50px;
    position: absolute;
  }
</style>

<div class="sabre" style="top:{sabreY}px; left:{sabreX}px">
  <img src="./resources/lightsaber.png" alt="" />
</div>
