import {writable} from 'svelte/store';
// HERO
export const direction = writable("down");
export const x = writable(0)
export const y = writable(0)
// ZOMBIE
export const directionAlien = writable("down");
export const enemyList = writable([{
    top: 30, 
    left: 40,
}])