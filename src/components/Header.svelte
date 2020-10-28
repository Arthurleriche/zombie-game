<script>
  import { sound } from '../stores/StoreOption.js';

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
</script>


<div class="header  relative w-full">
    <div class="title text-6xl text-center">
      <p class="title">ALIENUX I.O - MOTORx </p>
    </div>
    <audio id="player" src="./audio/laylow.mp3">
      <track kind="captions" />
    </audio>
    <img id="mute" class="h-16 w-16 absolute m-8 left-0 top-0" {src}  alt="volume" on:click={handleAudio} />
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
</style>