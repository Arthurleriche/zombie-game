<script>
  import { sound } from '../stores/StoreOption.js';
  import { newGame} from '../stores/Store';
  import {stopGame} from '../game/gameloop'

  let src = './img/mute.svg';

  function handleAudio() {
    var Player = document.getElementById('player');
    if ($sound == true) {
      Player.play();
      src = './img/volume.svg';
    } else {
      Player.pause();
      src = './img/mute.svg';
    }
    $sound = !$sound;
  }


  function handleClick() {
    $newGame = false 
    stopGame()
  }
</script>


<div class="header flex justify-around  w-full">
    <audio id="player" src="./audio/laylow.mp3">
      <track kind="captions" />
    </audio>
    <img id="mute" class="h-16 w-16 mt-4" {src}  alt="volume" on:click={handleAudio} />
    <p class="title text-6xl text-center">ALIENUX I.O - MOTORx </p>
    <img src="./resources/backmenu.png" alt="back" class=" back h-12 w-12 text-white mt-6" on:click={handleClick}/>
</div>


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

    .back{
      filter:drop-shadow(16px 16px 20px red) invert(75%);
    }
</style>