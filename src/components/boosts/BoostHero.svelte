<script>
  import { boostY, boostX } from '../../stores/StoreBonus';
</script>

<style>
  .boost-hero {
    width: 50px;
    height: 50px;
    position: absolute;
  }
  .img {
    width: 50px;
    height: 50px;
    animation: animation-boost 1s infinite;
  }

  @keyframes animation-boost {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>

<div class="boost-hero" style="top: {$boostY}px; left:{$boostX}px">
  <img class="img" src="./resources/energy.png" alt="" />
</div>/>
