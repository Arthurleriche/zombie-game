import { isPlaying } from '../stores/Store.js';
import {moveHero} from './hero.js'
import { moveEnemy } from './enemy.js'
import {checkCollision, checkCollisionWeapon, checkCollisionBooste, isDead, checkCollisionCoin} from './collision.js'
import { updateWeapon } from './weapon.js'
import { get } from 'svelte/store';
import { boost, stopBoost } from './bonus.js';
import{enemyList, x,y} from '../stores/StoreCharacters';


function startLoop(steps) {
    window.requestAnimationFrame(() => {
        steps.forEach(step => {
          if (typeof step === 'function') step();
        });
        if(get(isPlaying)) startLoop(steps);
        console.log('GAME TURNS');
      });


  }

  export const playerAmbiance = () => {
    const audio = new Audio("./resources/ambiance_1.mp3")
    audio.play()
  }

  // export const playerPopsmoke = () => {
  //   const audio2 = new Audio("./audio/laylow.mp3")
  //   audio2.play()
  // }

  export const startGame = () => {   
    isPlaying.update(a => true)
    x.update(a => 50)
    y.update(a => 50)
    enemyList.update(a => [{
      top: -30, 
      left: 400,
      id: 1, 
      damage: 10
  }])
    boost() 
    startLoop([moveHero, moveEnemy, checkCollision, checkCollisionWeapon,  updateWeapon, checkCollisionBooste,checkCollisionCoin, isDead]);
  };


  export const stopGame = () => {
    isPlaying.update(a => false)
    stopBoost(); 
  }

  



