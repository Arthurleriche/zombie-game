import { get } from 'svelte/store'

import {enemyList} from '../stores/StoreCharacters'
import {y, x} from '../stores/StoreCharacters'

const random = () => {
    let randomNum 
    randomNum = Math.floor(Math.random() * 480)
    return randomNum
}

const generateEnemy = () => {
    // random()
    console.log('sertt a rien')
    enemyList.update(a => [...a,{
        top: random(),
        left: random()
    }])
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
