import { get } from 'svelte/store'
import { x, y } from '../stores/StoreCharacters'
import { enemyList } from "../stores/StoreCharacters"



export const checkCollision = () => {
    get(enemyList).forEach(enemy => {
        if(
            get(x) >= enemy.top && get(x) <= enemy.top + 10 && get(y) >= enemy.left && get(y) <= enemy.left + 10
        ) {
            
        }
        
    })
}
