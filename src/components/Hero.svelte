<script>
  export let feature;
  export let steps;

  console.log(feature, steps);
</script>

<style>
  .hero {
    height: 100px;
    width: 100px;
    overflow: hidden;

    position: relative;
  }

  img {
    max-width: 400px;
    height: 400px;
  }

  .down1 {
    position: absolute;
  }
  .down2 {
    position: absolute;
    left: -100px;
  }
  .down3 {
    position: absolute;
    left: -200px;
  }
  .down4 {
    position: absolute;
    left: -300px;
  }

  .up1 {
    position: absolute;
    top: -100px;
  }
  .up2 {
    position: absolute;
    top: -100px;
    left: -100px;
  }
  .up3 {
    position: absolute;
    top: -100px;
    left: -200px;
  }

  .up4 {
    position: absolute;
    top: -100px;
    left: -300px;
  }

  .left1 {
    position: absolute;
    top: -200px;
    left: -100px;
  }
  .left4 {
    position: absolute;
    top: -200px;
  }
  .left2 {
    position: absolute;
    top: -200px;
    left: -200px;
  }
  .left3 {
    position: absolute;
    top: -200px;
    left: -300px;
  }

  .right1 {
    position: absolute;
    top: -300px;
    left: -100px;
  }
  .right4 {
    position: absolute;
    top: -300px;
  }
  .right2 {
    position: absolute;
    top: -300px;
    left: -200px;
  }
  .right3 {
    position: absolute;
    top: -300px;
    left: -300px;
  }
</style>

<div class="hero">
  <img class="{feature}{steps}" id="hero" src="./img/Heroe.png" alt="" />
</div>
