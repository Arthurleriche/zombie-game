import { get} from 'svelte/store'
// import {stopGame} from './gameloop'

import { speed, x, y, lastTouch, pv, earnedCoins } from '../stores/StoreCharacters'
import { enemyList } from '../stores/StoreCharacters'
import {sabreX, sabreY} from '../stores/StoreWeapon'
import {weaponActive} from '../stores/StoreWeapon'
import {boostY, boostX, boostOnMap, heartY, heartX, heartOnMap, coinX, coinY, coinOnMap} from '../stores/StoreBonus'
import {gameOver} from '../stores/Store'
import { isPlaying } from '../stores/Store.js';
import {stopBoost } from './bonus.js';

const scream = ["./resources/goblin_1.wav", "./resources/goblin_2.wav", "./resources/goblin_3.wav"]
let newlist 

export const distance = (x1, y1, x2, y2) => {
    return Math.trunc(Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1)))
}

export const checkCollision = () => {
   get(enemyList).forEach(enemy => {     
        if(distance(enemy.left,enemy.top, get(x), get(y)) < 40){      
            enemy.collision = true      
            if (enemy.collision && Date.now() - get(lastTouch) > 1000){
                lastTouch.update(a => Date.now())
                pv.update(a => a - enemy.damage)
                console.log(get(pv))
            }
        } else {
            enemy.collision = false
        }
   })

    newlist = get(enemyList).filter(enemy => enemy.collision === true)
    if(newlist.length > 0){
        document.querySelector('.hero').style.backgroundColor= 'rgba(219, 33, 33,0.5)'
    } else if(newlist.length === 0 ){
        document.querySelector('.hero').style.backgroundColor= ''
    }

}

const audio = new Audio('./resources/wilhelm.wav')

export const isDead = () => {
    if(get(pv) <= 0){
        audio.play()
        
        // stopGame 
        console.log('STOP GAMEZZ');
        stopBoost()
        isPlaying.update(a => false)

        gameOver.update (a => true) 
        console.log('GAMEOVER:  ' + get(gameOver)); 
        pv.update(a => 100)

    }
}

export const checkCollisionWeapon = () => {
    get(enemyList).forEach(enemy => {     
        if(distance(enemy.left,enemy.top, get(sabreX), get(sabreY)) < 45 && get(weaponActive)){
            deleteEnemy(enemy.id)
        }
    })
}

export const checkCollisionBooste = () => {
    if(distance(get(x),get(y), get(boostX), get(boostY)) < 45 && get(boostOnMap)){
       speed.update(a => 2)
       boostOnMap.update(a => false)
       setTimeout(() => {
           speed.update(a => 1)
       }, 5000)
    }
    if(distance(get(x),get(y), get(heartX), get(heartY)) < 45 && get(heartOnMap)){
        pv.update(a => 100)
        heartOnMap.update(a => false)
     }
}

export const checkCollisionCoin = () => {
    if(distance(get(x), get(y), get(coinX), get(coinY)) < 40 && get(coinOnMap)){
        earnedCoins.update(a => a + 1)
        coinOnMap.update(a => false)
    }
}





function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

const screamEnemy = () => {
    const audio = new Audio(scream[getRandomInt(3)])
    audio.play()
}   

const deleteEnemy = (enemyId) => {
    enemyList.update(enemies => enemies.filter(enemy => enemy.id !== enemyId))
    screamEnemy()
}