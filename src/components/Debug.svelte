<script>
  import { enemyList } from '../stores/StoreCharacters.js';
  import { x, y, pv, earnedCoins } from '../stores/StoreCharacters.js';
  import { distance } from '../game/collision.js';
  import {level} from '../stores/Store'

  const handleLevel = () => {
    console.log('OUAIS OUAIS ' + $level)
    if($level === 1){
      $level = 2
    } else {
      $level = 1
    }
  }
</script>

<style>
  .ID {
    height: 100px;
    margin: 2px;
  }
  .coord {
    width: 100px;
    height: 25px;
  }
  .debugEnemy {
    width: 400px;
    height: 400px;
    border: 2px solid red;
  }
</style>

<div class="flex flex-col">
  <div class="debugEnemy flex flex-wrap bg-transparent ">
    {#each $enemyList as enemy}
      {#if enemy.collision}
        <div class=" ID text-white text-sm">
          enemy:{enemy.id}
          <br />
          <div class="coord bg-red-800 border border-white">
            X:
            {enemy.left}
          </div>
          <div class="coord bg-red-800 border border-white">Y:{enemy.top}</div>
          <div class="coord bg-red-800 border border-white">
            Distance:{distance(enemy.left, enemy.top, $x, $y)}
          </div>
          <div class="coord bg-red-800 border border-white">
            Collision:
            {enemy.collision}
          </div>
        </div>
      {:else}
        <div class=" ID text-white text-sm">
          enemy:{enemy.id}
          <br />
          <div class="coord border border-white">X: {enemy.left}</div>
          <div class="coord border border-white">Y:{enemy.top}</div>
          <div class="coord border border-white">
            Distance:{distance(enemy.left, enemy.top, $x, $y)}
          </div>
          <div class="coord border border-white">
            Collision:
            {enemy.collision}
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <div class="text-white debugHero border border-green-300 p-4 m-auto">
    HERO:
    <br />
    <div class="coord border border-white">X: {$x}</div>
    <div class="coord border border-white">Y: {$y}</div>
    <div class="coord border border-white">PV: {$pv}</div>
    <div class="coord border border-white">$ : {$earnedCoins}</div>
    <button class="coord border border-blue-600 rounded-lg  m-2  level   " on:click={handleLevel}>Level : {$level}</button>

  </div>

  
</div>
