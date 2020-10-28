import {moveHero} from './hero.js'
import { moveEnemy } from './enemy.js'
// import { checkCollision }  from './collision'
import {distance} from './collision.js'
import {checkCollision} from './collision.js'
// import {debug} from '../components/Debug.svelte'



function startLoop(steps) {
    window.requestAnimationFrame(() => {
      steps.forEach(step => {
        if (typeof step === 'function') step();
      });
      startLoop(steps);
    });

  }

  export const startGame = () => {   
    startLoop([moveHero, moveEnemy, checkCollision]);
  };

  // startLoop([moveHero, moveEnemy]);