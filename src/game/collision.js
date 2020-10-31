import { get} from 'svelte/store'
import {stopGame} from './gameloop'
import { speed, x, y, lastTouch, pv, earnedCoins } from '../stores/StoreCharacters'
import { enemyList } from '../stores/StoreCharacters'
import {sabreX, sabreY, bullets, gunBullet} from '../stores/StoreWeapon'
import {sabreActive} from '../stores/StoreWeapon'
import {boostY, boostX, boostOnMap, heartY, heartX, heartOnMap, coinX, coinY, coinOnMap, gunBonusY, gunBonusX, gunOnMap} from '../stores/StoreBonus'
import {gameOver, sound} from '../stores/Store'
import {soundOn} from './option'

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


export const checkCollisionWeapon = () => {
    get(enemyList).forEach(enemy => {     
        if(distance(enemy.left,enemy.top, get(sabreX), get(sabreY)) < 45){
            deleteEnemy(enemy.id)
        }
    })
    get(bullets).forEach(bullet => {
        get(enemyList).forEach(enemy => {     
            if(distance(enemy.left,enemy.top, bullet.x, bullet.y) < 30){
                deleteEnemy(enemy.id)
                deleteBullet(bullet.id)
            }
        })
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
        // heroHeal()
        heartOnMap.update(a => false)
     }
     if(distance(get(x),get(y), get(gunBonusX), get(gunBonusY)) < 45 && get(gunOnMap)){
        gunOnMap.update(a => false)
        gunBullet.update(a => a + 10)
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
const deleteBullet = (bulletId) => {
    bullets.update(bullet => bullet.filter(bullet => bullet.id !== bulletId))
    soundOn(scream[getRandomInt(3)])
}