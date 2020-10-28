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
    random()
    enemyList.update(a => [...a,{
        top: random(557),
        left: random(890),
        id: generateId()
    }])
    console.log(get(enemyList))
}

export const createEnemy = () => {  
    setInterval(generateEnemy, 1000)
 
}

const directionEnemy = (enemy, hero) => {
    if(enemy > hero){
        return enemy - 0.1
    } else {
        return enemy + 0.1
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
