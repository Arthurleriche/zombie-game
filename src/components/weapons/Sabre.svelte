<script>
  export let sabreX;
  export let sabreY;
  console.log(sabreX);
</script>

<style>
  .sabre {
    height: 50px;
    width: 50px;
    background-color: yellow;
    position: absolute;
  }
</style>

<div class="sabre" style="top:{sabreY}px; left:{sabreX}px" />
