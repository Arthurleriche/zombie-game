import { get} from 'svelte/store'
import {stopGame} from './gameloop'
import { speed, x, y, lastTouch, pv, earnedCoins } from '../stores/StoreCharacters'
import { enemyList } from '../stores/StoreCharacters'
import {sabreX, sabreY, bullets, gunBullet} from '../stores/StoreWeapon'
import {sabreActive} from '../stores/StoreWeapon'
import {boostY, boostX, boostOnMap, heartY, heartX, heartOnMap, coinX, coinY, coinOnMap, gunBonusY, gunBonusX, gunOnMap} from '../stores/StoreBonus'
import {gameOver, level, sound} from '../stores/Store'
import {soundOn} from './option'
import { heroHeal, heroHurted } from './dashboard'
import {kills} from '../stores/Store'

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
                heroHurted(enemy.damage); 
            }
        } else {
            enemy.collision = false
        }
        //LEVEL DAMAGE 
        if(get(level) === 2){
            enemy.damage = 20
        } else if (get(level)===3){
            enemy.damage = 30
        }
   })
    newlist = get(enemyList).filter(enemy => enemy.collision === true)
    if(newlist.length > 0){
        document.querySelector('.hero').style.backgroundColor= 'rgba(219, 33, 33,0.5)'
    } else if(newlist.length === 0 &&  document.querySelector('.hero').style.backgroundColor !== null ){
        document.querySelector('.hero').style.backgroundColor= ''
    }
    // console.log(collisionBlocks(get(x),get(y)))
}

const killsLevelUp = () => {
    kills.update(a => a + 1)
    switch (get(level)){
        case 1: 
        console.log('BIENVENU AU NIVEAU 1')
        if(get(kills) === 5){
            kills.update(a => 0)
            level.update(a => a + 1)
        }
        break; 

        case 2:
        console.log('BIENVENU AU NIVEAU 2 ')
        if(get(kills) === 5){
            kills.update(a => 0)
            level.update(a => a + 1)
        }
        break; 

        case 3: 
        console.log('BIENVENU AU NIVEAU 3')
        break; 
    }
}


export const checkCollisionWeapon = () => {
    get(enemyList).forEach(enemy => {     
        if(distance(enemy.left,enemy.top, get(sabreX), get(sabreY)) < 45){
            deleteEnemy(enemy.id)
            killsLevelUp(); 
        }
    })
    get(bullets).forEach(bullet => {
        get(enemyList).forEach(enemy => {     
            if(distance(enemy.left,enemy.top, bullet.x, bullet.y) < 30){
                deleteEnemy(enemy.id)
                killsLevelUp(); 
                deleteBullet(bullet.id)
            }
        })
    })
}

export const checkCollisionBooste = () => {
    if(distance(get(x),get(y), get(boostX), get(boostY)) < 45 && get(boostOnMap)){
       speed.update(a => a + 2)
       boostOnMap.update(a => false)
       setTimeout(() => {
           speed.update(a => 4)
       }, 5000)
    }
    if(distance(get(x),get(y), get(heartX), get(heartY)) < 45 && get(heartOnMap)){
        heroHeal()
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

// export const collisionBlocks = (x,y) => {
//     if( x> 260 && x < 370 && y> 180 && y < 370 ){
//         return true
//     } else {
//         return false
//     }
// }