import { get } from 'svelte/store'

import {enemyList} from '../stores/StoreCharacters'
import {y, x} from '../stores/StoreCharacters'

let enemyId = 1

const generateId = () => {
    enemyId++
    return enemyId
}

const random = (num) => {
    let randomNum 
    randomNum = Math.floor(Math.random() * num)
    return randomNum
}


const generateEnemy = () => {
    // random()
    // console.log('sertt a rien')
    enemyList.update(a => [...a,{
        top: random(557),
        left: random(890),
        id: generateId(), 
        direction: direction
    }])
    console.log(get(enemyList))
}

export const createEnemy = () => {  
    setInterval(generateEnemy, 5000)
 
}

let direction = "down"

const directionEnemyX = (enemy, hero) => {
    if(enemy > hero + 25){
        direction = "step-left"
        return enemy - 0.5
    } else {
        direction = "step-right"
        return enemy + 0.5
    }
}   
const directionEnemyY = (enemyY, hero, enemyX) => {
    if(enemyY > hero +25){
        // if(enemyY - hero > enemyX - hero){
        //     direction = "step-right"
        // } else{
            // }
            
        direction = "step-up"
        return enemyY - 0.5
    } else {
        direction = "step-down"
        return enemyY + 0.5
    }
}   

export const moveEnemy = () => {
    
    if(get(enemyList).length >= 1){
        enemyList.update(enemyList =>
            enemyList.map(enemy => ({
                ...enemy,
                left: directionEnemyX(enemy.left, get(x)),
                top: directionEnemyY(enemy.top, get(y), enemy.left),
                direction: direction
            })),
        );
    }
}   
