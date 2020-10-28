import { get } from 'svelte/store'

import {enemyList} from '../stores/StoreCharacters'
import {y, x} from '../stores/StoreCharacters'

const generateEnemy = () => {
    enemyList.update(a => [...a,{
        top: Math.floor(Math.random() * 10),
        left: Math.floor(Math.random() * 10)
    }])
    console.log(get(enemyList))

}

export const createEnemy = () => {
    setInterval(generateEnemy, 3000)
 
}

const directionEnemy = (enemy, hero) => {
    if(enemy > hero){
        return enemy - 0.2
    } else {
        return enemy + 0.2
    }
}   
    

export const moveEnemy = () => {
    if(get(enemyList).length >= 1){
        enemyList.update(enemyList =>
            enemyList.map(enemy => ({
                ...enemy,
                left: directionEnemy(enemy.left, get(x)),
                top: directionEnemy(enemy.top, get(y))
            })),
            );
    }
}   
