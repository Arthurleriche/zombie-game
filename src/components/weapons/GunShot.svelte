<script>
  export let gunX;
  export let gunY;
  import { classProp } from '../../stores/StoreWeapon';

  console.log($classProp);
</script>

<style>
  .gun {
    height: 40px;
    width: 45px;
    position: absolute;
  }
  .left {
    transform: rotate(-180deg);
    transform: rotateY(180deg);
  }
</style>

<div id="" class="gun {$classProp}" style="top:{gunY}px; left:{gunX}px">
  {#if $classProp === 'left'}
    <img src="./resources/gun1side.png" alt="" />
  {:else if $classProp === 'right'}
    <img src="./resources/gun1side.png" alt="" />
  {:else}<img src="./resources/gun1top.png" alt="" />{/if}
</div>
