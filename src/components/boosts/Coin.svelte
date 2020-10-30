<script>
import { coinX,coinY } from "../../stores/StoreBonus";
</script>

<style>
    .coin{
        width:40px;
        height:40px;
        position:absolute; 
        animation : animate-coin 1s infinite; 
    }

    @keyframes animate-coin {
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

<img class="coin" src="./resources/coin.png" alt="coin" style="top:{$coinY}px; left:{$coinX}px;" />