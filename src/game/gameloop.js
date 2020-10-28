import {moveHero} from './hero.js'
import { moveEnemy } from './enemy.js'
import { checkCollision }  from './collision'

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