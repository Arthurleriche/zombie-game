import {writable} from 'svelte/store';


// HERO
export const ligHero = writable(5);
export const colHero = writable(5);
export const previousLigHero = writable(5)
export const previousColHero = writable(5)
export const step = writable(1);
export const direction = writable("down");
export const leftSide = writable(2)
export const bottomSide = writable(1)
// Move HERO
export const down = writable(false)
export const up = writable(false)
export const right = writable(false)
export const left = writable(false)
// Move HERO
// HERO

// ZOMBIE
export const ligAlien = writable(1);
export const colAlien = writable(1);
export const previousLigAlien = writable(1)
export const previousColAlien = writable(1)
export const leftAlien = writable(0); 
export const topAlien = writable(0); 
