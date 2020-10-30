import {writable} from 'svelte/store';
// HERO
export const direction = writable("down");
export const x = writable(50)
export const y = writable(50)
export const speed = writable(1)
export const lastTouch = writable(0)
export const pv = writable(100)
// ZOMBIE
export const directionAlien = writable("down");
export const enemyId = writable(1)
export const enemyList = writable([{
    top: -30, 
    left: 400,
    id: 1, 
    damage: 10
}])