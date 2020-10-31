import { get } from 'svelte/store'

import {enemyList} from '../stores/StoreCharacters'
import {y, x} from '../stores/StoreCharacters'

let enemyId = 1
let generateenemy
let direction = "down"

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
    console.log('Enemy Generated');
    enemyList.update(a => [...a,{         
        // top: random(0),
        // left: random(375),
        top: 0,
        left: 375,
        id: generateId(), 
        collision: false, 
        direction: direction,
        damage: 10

    }])
    const audio = new Audio('./resources/ghost.wav')
    audio.play()
}


export const createEnemy = () => {  
        generateenemy = setInterval(generateEnemy, 4000)
}

export const stopCreatingEnemy = () => {
    clearInterval(generateenemy)
    enemyId = 1
}


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
