<script>
  console.log('je suis ship');
  let num = 1;
  function number(number) {
    num = Math.floor(Math.random() * number);
  }
  number(4);
</script>

<style>
  .ship {
    height: 50px;
    width: 50px;
    overflow: hidden;
    position: relative;
  }
  #ship {
    min-width: 200px;
    height: 150px;
  }

  .texture1 {
    position: absolute;
  }
  .texture2 {
    position: absolute;
    left: -50px;
  }
  .texture3 {
    position: absolute;
    left: -100px;
  }
  .texture4 {
    position: absolute;
    left: -150px;
  }
</style>

<div class="ship">
  <img class="texture{num}" id="ship" src="./resources/texture2.png" alt="" />
</div>
