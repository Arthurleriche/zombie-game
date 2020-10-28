import { get } from 'svelte/store'
import { x, y } from '../stores/StoreCharacters'
import { enemyList } from '../stores/StoreCharacters'




// export const checkCollision = () => {
//     get(enemyList).forEach(enemy => {
//         if(
//             get(x) >= enemy.top && get(x) <= enemy.top + 10 && get(y) >= enemy.left && get(y) <= enemy.left + 10
//         ) {
            
//         }
        
//     })
// }


export const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1))
}

export const checkCollision = () => {
    // if( distance(enemy.left, enemy.right, x, y) < 40 ){
    //     console.log('COLLISION')
    // }
    console.log( get(enemyList)[0]) 
}

