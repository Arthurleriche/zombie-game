<script>
  import { gameOver, i, newGame, sound } from '../stores/Store';
  import { isPlaying } from '../stores/Store';
  import { stopCreatingEnemy } from '../game/enemy.js';
  import { earnedCoins, enemyList, lifeList } from '../stores/StoreCharacters';
  import { stopBoost } from '../game/bonus.js';

  let src = './img/mute.svg';

  function handleAudio() {
    var Player = document.getElementById('player');
    if ($sound == false) {
      Player.play();
      src = './img/volume.svg';
      $sound = true;
    } else {
      Player.pause();
      src = './img/mute.svg';
      $sound = false;
    }
  }

  function handleClick() {
    $newGame = false;
    isPlaying.update(a => false);
    stopBoost();
    stopCreatingEnemy();
    lifeList.update(a => [
      { life: 100, id: 1, pv: 100 },
      { life: 100, id: 2, pv: 100 },
      { life: 100, id: 3, pv: 100 },
    ]);
    i.update(a => 1);
    earnedCoins.update(a => 0);
    enemyList.update(a => [
      {
        top: -30,
        left: 400,
        id: 1,
        damage: 10,
      },
    ]);
  }
</script>

<style>
  .title {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    color: white;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: rgb(64, 131, 78);
  }
  #mute {
    filter: drop-shadow(16px 16px 20px red) invert(75%);
  }

  .back {
    filter: drop-shadow(16px 16px 20px red) invert(75%);
  }
</style>

<div class="header flex justify-around  w-full">
  <audio id="player" src="./audio/laylow.mp3">
    <track kind="captions" />
  </audio>
  <img
    id="mute"
    class="h-16 w-16 mt-4"
    {src}
    alt="volume"
    on:click={handleAudio} />
  <p class="title text-6xl text-center">ALIENUX I.O - MOTORx</p>
  <img
    src="./resources/backmenu.png"
    alt="back"
    class=" back h-12 w-12 text-white mt-6"
    on:click={handleClick} />
</div>
