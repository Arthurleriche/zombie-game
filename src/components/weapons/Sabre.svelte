<script>
  export let sabreX;
  export let sabreY;
  import {classProp} from '../../stores/StoreWeapon'
</script>

<style>
  .sabre {
    height: 40px;
    width: 45px;
    position: absolute;
  }

  .right{
     animation-name: sabreRight ;
    animation-duration: 0.05s; 
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  } 

  .up{
    animation-name: sabreUp ;
    animation-duration: 0.05s; 
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }


  .down{
    animation-name: sabreDown ;
    animation-duration: 0.05s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .left{
    transform: rotate(270deg);
    animation-name: sabreLeft ;
    animation-duration: 0.05s; 
    animation-iteration-count: 1;
    transform: rotate(270deg);
    animation-fill-mode: forwards;
  }

  @keyframes sabreRight{
    from {transform:rotate(0deg)}
    to {transform: rotate(45deg)}
  }
  @keyframes sabreLeft{
    from {transform:rotate(270deg)}
    to {transform: rotate(225deg)}
  }
  @keyframes sabreUp{
    from {transform:rotate(0deg)}
    to {transform: rotate(-30deg)}
  }
  @keyframes sabreDown{
    from {transform:rotate(90deg)}
    to {transform: rotate(120deg)}
  }

</style>

<div id="" class="sabre {$classProp}" style="top:{sabreY}px; left:{sabreX}px">
  <img src="./resources/sword.png" alt="" />
</div>


