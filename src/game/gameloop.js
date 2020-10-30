import { newGame } from '../stores/Store.js';
import {moveHero} from './hero.js'
import { moveEnemy } from './enemy.js'
// import {distance} from './collision.js'
import {checkCollision, checkCollisionWeapon, checkCollisionBoost, isDead} from './collision.js'
import { updateWeapon } from './weapon.js'
import { get } from 'svelte/store';

// import {debug} from '../components/Debug.svelte'

function startLoop(steps) {
    window.requestAnimationFrame(() => {
      if(get(newGame)){
        steps.forEach(step => {
          if (typeof step === 'function') step();
        });
        startLoop(steps);
      }
      });


  }

  export const playerAmbiance = () => {
    const audio = new Audio("./resources/ambiance_1.mp3")
    audio.play()
  }

  export const startGame = () => {   

    startLoop([moveHero, moveEnemy, checkCollision, checkCollisionWeapon,  updateWeapon, checkCollisionBoost, isDead]);
  };

  // startLoop([moveHero, moveEnemy]);