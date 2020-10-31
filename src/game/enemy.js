import { get } from 'svelte/store'
import { sound } from '../stores/Store'
import {enemyList} from '../stores/StoreCharacters'
import {y, x} from '../stores/StoreCharacters'
import {level} from '../stores/Store'

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
    
}


export const createEnemy = () => {  
    // if(get(level) === 1 ){
        generateenemy = setInterval(generateEnemy, 4000)
    // }
}

export const stopCreatingEnemy = () => {
    clearInterval(generateenemy)
    enemyId = 1
}


const directionEnemyX = (enemy, hero) => {
    if(get(level)===1){
        if(enemy > hero + 25){
            direction = "step-left"
            return enemy - 0.5
        } else {
            direction = "step-right"
            return enemy + 0.5
        }


    } else if (get(level) === 2){
        switch(true){
            case enemy > hero + 10:
                direction = "step-left2";
                return enemy - 0.5; // PAS à accélerer pour Alien 2 
            case enemy <= hero + 10:
                direction = "step-right2";
                return enemy + 0.5;
        }
    }
}   


const directionEnemyY = (enemyY, hero, enemyX) => {
    if(get(level)===1){
        if(enemyY > hero ){
            direction = "step-up"
            return enemyY - 0.5
        } else {
            direction = "step-down"
            return enemyY + 0.5
        }


    } else if (get(level) === 2){
        if(enemyY > hero ){
            direction = "step-up2"
            return enemyY - 0.5
        } else {
            direction = "step-down2"
            return enemyY + 0.5
        }
    }
        
}   

export const moveEnemy = () => {
    console.log(document.getElementById('alien2'))
    console.log(get(enemyList))
    //_______LEVEL 1 
    if(get(level)===1){
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

    //_______LEVEL 2 
    if(get(level)===2){
        if(get(enemyList).length >= 1){
            enemyList.update(enemyList =>
                enemyList.map(enemy => ({
                    ...enemy,
                    top: directionEnemyY(enemy.top, get(y), enemy.left),
                    left: directionEnemyX(enemy.left, get(x)),
                    direction: direction
                })),
            );
        }
    }
}   
