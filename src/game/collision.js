import { each } from 'svelte/internal'
import { get } from 'svelte/store'
import { x, y } from '../stores/StoreCharacters'
import { enemyList } from '../stores/StoreCharacters'
import {sabreX, sabreY} from '../stores/StoreWeapon'
import {weaponActive} from '../stores/StoreWeapon'


export const distance = (x1, y1, x2, y2) => {
    return Math.trunc(Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1)))
}

export const checkCollision = () => {
   get(enemyList).forEach(enemy => {
    // console.log(enemy)
    if(distance(enemy.left,enemy.top, get(x), get(y)) < 40){
        // console.log('COLLISION');
        enemy.collision = true 
    } else {
        enemy.collision = false
    }
        }
    )
}

export const checkCollisionWeapon = () => {
    get(enemyList).forEach(enemy => {
        
        if(distance(enemy.left,enemy.top, get(sabreX), get(sabreY)) < 40 && get(weaponActive)){
            deleteEnemy(enemy.id)
            enemy.collision = true 
        } else {
            enemy.collision = false
        }
            }
        )
}

const deleteEnemy = (enemyId) => {
    enemyList.update(enemies => enemies.filter(enemy => enemy.id !== enemyId))
}

