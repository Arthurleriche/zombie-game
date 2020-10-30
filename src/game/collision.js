import { each } from 'svelte/internal'
import { get, readable } from 'svelte/store'
import { x, y } from '../stores/StoreCharacters'
import { enemyList } from '../stores/StoreCharacters'
import {sabreX, sabreY} from '../stores/StoreWeapon'
import {weaponActive} from '../stores/StoreWeapon'

const scream = ["./resources/goblin_1.wav", "./resources/goblin_2.wav", "./resources/goblin_3.wav"]
let newlist 

export const distance = (x1, y1, x2, y2) => {
    return Math.trunc(Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1)))
}

export const checkCollision = () => {
   get(enemyList).forEach(enemy => {
        // console.log(enemy)
        if(distance(enemy.left,enemy.top, get(x), get(y)) < 40){
            enemy.collision = true      
        } else {
            enemy.collision = false
        }

   })

    newlist = get(enemyList).filter(enemy => enemy.collision === true)
    if(newlist.length > 0){
        document.querySelector('.hero').style.backgroundColor= 'rgba(219, 33, 33,0.5)'
    } else {
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

