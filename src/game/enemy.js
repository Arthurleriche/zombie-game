import { get } from 'svelte/store'

import {enemyList} from '../stores/StoreCharacters'

const generateEnemy = () => {
    enemyList.update(a => [...a,{
        top: 20,
        left: 50
    }])
    console.log(get(enemyList))

}

export const createEnemy = () => {
    setInterval(generateEnemy, 3000)
    
}

export const moveEnemy = () => {
    if(get(enemyList).length >= 1){
        enemyList.update(enemyList =>
            enemyList.map(enemy => ({
                ...enemy,
                left: enemy.left + 0.1,
                top: enemy.top + 0.1,
            })),
            );
    }
}   