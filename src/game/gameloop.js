import { isPlaying } from '../stores/Store.js';
import {moveHero} from './hero.js'
import { moveEnemy, stopCreatingEnemy } from './enemy.js'
import {checkCollision, checkCollisionWeapon, checkCollisionBooste, isDead, checkCollisionCoin} from './collision.js'
import { updateWeapon, updateGun, chooseWeaponFct, moveBullet, machineGun } from './weapon.js'
import { get } from 'svelte/store';
import { boost, stopBoost } from './bonus.js';
import{earnedCoins, enemyList, x,y} from '../stores/StoreCharacters';
import {gameOver} from '../stores/Store'

function startLoop(steps) {
    window.requestAnimationFrame(() => {
        steps.forEach(step => {
          if (typeof step === 'function') step();
        });
        if(get(isPlaying)) startLoop(steps);
      });
  }

  export const playerAmbiance = () => {
    const audio = new Audio("./resources/ambiance_1.mp3")
    audio.play()
  }

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
    startLoop([moveHero, moveEnemy, checkCollision, machineGun, moveBullet, checkCollisionWeapon, chooseWeaponFct,  updateWeapon, updateGun, checkCollisionBooste,checkCollisionCoin, stopGame]);
  }

  export const stopGame = () => {
    if(get(gameOver)){
      isPlaying.update(a => false)
      // earnedCoins.update(a => 0)
      stopBoost(); 
      stopCreatingEnemy(); 
      enemyList.update(a => [])
    } 
  }







