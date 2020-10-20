<script>
  import { ligHero } from '../StoreCharacters';
  import { colHero } from '../StoreCharacters';
  import { leftSide } from '../StoreCharacters.js';
  import { bottomSide } from '../StoreCharacters.js';

  import { ligAlien } from '../StoreCharacters.js';
  import { colAlien } from '../StoreCharacters.js';

  import { topAlien } from '../StoreCharacters.js';
  import { leftAlien } from '../StoreCharacters.js';

  const touch = () => {
    if ($ligHero === $ligAlien && $colHero === $colAlien) {
      document.querySelector('.touch').classList.add('collision');
    } else {
      document.querySelector('.touch').classList.remove('collision');
    }
  };

  let activate = false;

  const test = () => {
    activate = !activate;
  };
</script>

<style>
  button {
    background-color: white;
  }
  .debug {
    height: 400px;
    width: 400px;
    background-color: #ebebeb;
  }

  .titre {
    text-align: center;
    padding: 30px;
    background-color: black;
    color: #389393;
  }

  .hero-alien {
    background-color: #f5a25d;
    display: flex;
  }

  .hero {
    width: 50%;
    border: solid 1px;
  }
  .alien {
    width: 50%;
    border: solid 1px;
  }
  #titre {
    text-align: center;
  }

  .lig-hero {
    background-color: #fa7f72;
    text-align: right;
    padding-right: 10px;
  }

  .col-hero {
    background-color: #fa7f72;
    text-align: right;
    padding-right: 10px;
  }
  .lig-alien {
    background-color: #fa7f72;
    text-align: left;
    padding-left: 10px;
  }

  .col-alien {
    background-color: #fa7f72;
    text-align: left;
    padding-left: 10px;
  }

  .collision {
    background-color: red;
  }
</style>

{#if activate}
  <button on:click={test}>Debug-mode off</button>
{:else}<button on:click={test}>Debug-mode on</button>{/if}
{#if activate}
  <div class="debug">
    <h1 class="titre">Debug-mode activé</h1>
    <div class="hero-alien">
      <div class="hero touch collision">
        <h2 id="titre">HERO</h2>
        <p class="lig-hero">Lig ======== <span>{$ligHero}</span></p>
        <p class="col-hero">Col ======== <span>{$colHero}</span></p>
        <br />
        <p class="lig-hero">Lig ======== <span>{$leftSide}</span></p>
        <p class="col-hero">Col ======== <span>{$bottomSide}</span></p>
      </div>
      <div class="alien">
        <h2 id="titre">ALIEN</h2>
        <p class="lig-alien"><span>{$ligAlien}</span> ======== Lig</p>
        <p class="col-alien"><span>{$colAlien}</span> ======== Col</p>
        <br />
        <p class="lig-alien"><span>{$leftAlien}</span> ======== Lig</p>
        <p class="col-alien"><span>{$topAlien}</span> ======== Col</p>
      </div>
    </div>
  </div>
{/if}
