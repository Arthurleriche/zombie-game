import { get} from 'svelte/store'
import {stopGame} from './gameloop'
import { speed, x, y, lastTouch, pv, earnedCoins } from '../stores/StoreCharacters'
import { enemyList } from '../stores/StoreCharacters'
import {sabreX, sabreY} from '../stores/StoreWeapon'
import {weaponActive} from '../stores/StoreWeapon'
import {boostY, boostX, boostOnMap, heartY, heartX, heartOnMap, coinX, coinY, coinOnMap} from '../stores/StoreBonus'
import {gameOver, sound} from '../stores/Store'
import {soundOn} from './option'
import { heroHeal, heroHurted } from './dashboard'

const scream = ["./resources/goblin_1.wav", "./resources/goblin_2.wav", "./resources/goblin_3.wav"]
let newlist 


export const distance = (x1, y1, x2, y2) => {
    return Math.trunc(Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1)))
}


export const checkCollision = () => {

    // ______ LEVEL 1 
   get(enemyList).forEach(enemy => {     
        if(distance(enemy.left,enemy.top, get(x), get(y)) < 40){      
            enemy.collision = true      
            if (enemy.collision && Date.now() - get(lastTouch) > 1000){
                lastTouch.update(a => Date.now())
                // pv.update(a => a - enemy.damage)
                // console.log(get(pv))
                heroHurted(enemy.damage); 
            }
        } else {
            enemy.collision = false
        }
    // ______ LEVEL 2
    // ....... 
    // ....... 
    // ....... 
    // ....... 

   })

    newlist = get(enemyList).filter(enemy => enemy.collision === true)
    if(newlist.length > 0){
        document.querySelector('.hero').style.backgroundColor= 'rgba(219, 33, 33,0.5)'
    } else if(newlist.length === 0 &&  document.querySelector('.hero').style.backgroundColor !== null ){
        document.querySelector('.hero').style.backgroundColor= ''
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
        heroHeal()
        heartOnMap.update(a => false)
     }
}



export const checkCollisionCoin = () => {
    if(distance(get(x), get(y), get(coinX), get(coinY)) < 40 && get(coinOnMap)){
        earnedCoins.update(a => a + 1)
        coinOnMap.update(a => false)
    }
}


export const isDead = () => {
    if(get(pv) <= 0){
        soundOn('./resources/wilhelm.wav')
        // newGame.update(a => false) 
        stopGame()
        gameOver.update (a => true) 
        console.log('GAMEOVER:  ' + get(gameOver)); 
        pv.update(a => 100)

    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  
const deleteEnemy = (enemyId) => {
    enemyList.update(enemies => enemies.filter(enemy => enemy.id !== enemyId))
    soundOn(scream[getRandomInt(3)])
}