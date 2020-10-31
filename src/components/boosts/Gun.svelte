<script>
  import { gunBonusY, gunBonusX } from '../../stores/StoreBonus';
</script>

<style>
  .boost-hero {
    width: 70px;
    height: 70px;
    position: absolute;
  }
  .img {
    width: 70px;
    height: 70px;
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

<div class="boost-hero" style="top: {$gunBonusY}px; left:{$gunBonusX}px">
  <img class="img" src="./resources/gun1side.png" alt="" />
</div>
