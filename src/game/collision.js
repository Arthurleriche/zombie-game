import { get} from 'svelte/store'
import {stopGame} from './gameloop'
import { speed, x, y, lastTouch, pv, earnedCoins } from '../stores/StoreCharacters'
import { enemyList } from '../stores/StoreCharacters'
import {sabreX, sabreY, bullets, gunBullet, machineGunActive, machineGunBullet, weapons, gunHero, machineGunHero} from '../stores/StoreWeapon'
import {sabreActive} from '../stores/StoreWeapon'
import {boostY, boostX, boostOnMap, heartY, heartX, heartOnMap, coinX, coinY, coinOnMap, gunBonusY, gunBonusX, gunOnMap, machineGunBonusX, machineGunBonusY, machineGunOnMap} from '../stores/StoreBonus'
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
       enemy.damage =20    
        if(distance(enemy.left,enemy.top, get(x), get(y)) < 45){      
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
            enemy.damage = 30
        } else if (get(level)===3){
            enemy.damage = 40
        }
   })
    newlist = get(enemyList).filter(enemy => enemy.collision === true)
    if(newlist.length > 0){
        document.querySelector('.hero').style.backgroundColor= 'rgba(219, 33, 33,0.5)'
    } else if(newlist.length === 0 &&  document.querySelector('.hero').style.backgroundColor !== null ){
        document.querySelector('.hero').style.backgroundColor= ''
    }
}

const killsLevelUp = () => {
    kills.update(a => a + 1)
    switch (get(level)){
        case 1: 
        if(get(kills) === 5){
            // kills.update(a => 0)
            level.update(a => a + 1)
        }
        break; 

        case 2:
        if(get(kills) === 15){
            // kills.update(a => 0)
            level.update(a => a + 1)
        }
        break; 
        case 3: 
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

    get(bullets).forEach(bullet => {
        if(bullet.x < 45 || bullet.x > 800 || bullet.y < 15 || bullet.y > 510){
            deleteBullet(bullet.id)
        }     
    })
}




export const checkCollisionBooste = () => {
    console.log(get(weapons))
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
         if(get(gunHero) === false){
             weapons.update(a => [...a, "gun"])
             gunHero.update(a => true)
         }
        gunOnMap.update(a => false)
        gunBullet.update(a => a + 10)
     }
     if(distance(get(x),get(y), get(machineGunBonusX), get(machineGunBonusY)) < 45 && get(machineGunOnMap)){
         if(get(machineGunHero) === false){
             weapons.update(a => [...a, "machineGun"])
             machineGunHero.update(a => true)
         }
        machineGunOnMap.update(a => false)
        machineGunBullet.update(a => a + 25)
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

