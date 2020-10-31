import { get } from 'svelte/store'
import { sound } from '../stores/Store'
import {enemyList} from '../stores/StoreCharacters'
import {y, x} from '../stores/StoreCharacters'
import {level} from '../stores/Store'

let enemyId = 1
let generateenemy
let direction = "down"
let speed = 1


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
        generateenemy = setInterval(generateEnemy, 3000)
    // }
}

export const stopCreatingEnemy = () => {
    clearInterval(generateenemy)
    enemyId = 1
}


const directionEnemyX = (enemy, hero, speedX) => {
    if(get(level)===1){

        if(enemy > hero + 25){
            direction = "step-left"
            return enemy - speedX
        } else {
            direction = "step-right"
            return enemy + speedX
        }


    } else if (get(level) === 2){
        switch(true){
            case enemy > hero + 10:
                direction = "step-left2";
                return enemy - speedX; // PAS à accélerer pour Alien 2 
            case enemy <= hero + 10:
                direction = "step-right2";
                return enemy + speedX;
        }
    } else if (get(level) === 3){
        switch(true){
            case enemy > hero + 10:
                direction = "step-left3";
                return enemy - speedX; // PAS à accélerer pour Alien 2 
            case enemy <= hero + 10:
                direction = "step-right3";
                return enemy + speedX;
        }
    }
}   



const directionEnemyY = (enemyY, hero, enemyX, speedY) => {
    if(get(level)===1){
        
        if(enemyY > hero ){
            direction = "step-up"
            return enemyY - speedY
        } else {
            direction = "step-down"
            return enemyY + speedY
        }


    } else if (get(level) === 2){
        speed = 1.5
        if(enemyY > hero ){
            direction = "step-up2"
            return enemyY - speedY
        } else {
            direction = "step-down2"
            return enemyY + speedY
        }
    } else if (get(level) === 3){
        speed = 3
        if(enemyY > hero ){
            direction = "step-up3"
            return enemyY - speedY
        } else {
            direction = "step-down3"
            return enemyY + speedY
        }
    }
        
}   

export const moveEnemy = () => {
    // console.log(document.getElementById('alien2'))
    // console.log(get(enemyList))

    //_______LEVEL 1 
    if(get(level)===1){
        if(get(enemyList).length >= 1){
            enemyList.update(enemyList =>
                enemyList.map(enemy => ({
                    ...enemy,
                    left: directionEnemyX(enemy.left, get(x), 1),
                    top: directionEnemyY(enemy.top, get(y), enemy.left, 1.3),
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
                    top: directionEnemyY(enemy.top, get(y), enemy.left, 1.8),
                    left: directionEnemyX(enemy.left, get(x), 1.5),
                    direction: direction
                })),
            );
        }
    }

    //_______LEVEL 3 
    if(get(level)===3){
        if(get(enemyList).length >= 1){
            enemyList.update(enemyList =>
                enemyList.map(enemy => ({
                    ...enemy,
                    left: directionEnemyX(enemy.left, get(x), 2),
                    top: directionEnemyY(enemy.top, get(y), enemy.left, 2),
                    direction: direction
                })),
            );
        }
    }
}   
