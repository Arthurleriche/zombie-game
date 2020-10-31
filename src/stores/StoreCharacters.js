import {writable} from 'svelte/store';
// HERO
export const direction = writable('down');
export const x = writable(50)
export const y = writable(50)
export const speed = writable(4)
export const lastTouch = writable(0)
export const pv = writable(100)
export const earnedCoins = writable(0)
export const lifeList = writable([
    {life: 100, id : 1, pv:100},
    {life: 100, id : 2, pv: 100},
    {life: 100, id : 3, pv:100}
])
// ZOMBIE
export const directionAlien = writable("down");
export const enemyId = writable(1)
export const enemyList = writable([{
    top: -30, 
    left: 400,
    id: 1, 
    damage: 10
}])


//ZOMBIE 2 
export const enemy2Id = writable(1)
export const enemyList2  = writable([{
    top: 100, 
    left: 100, 
    id:1, 
    damage:20
}])

