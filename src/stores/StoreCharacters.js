import {writable} from 'svelte/store';
// HERO
export const direction = writable("down");
export const x = writable(50)
export const y = writable(50)
// ZOMBIE
export const directionAlien = writable("down");
export const enemyId = writable(1)
export const enemyList = writable([{
    top: 30, 
    left: 40,
    id: 1
}])