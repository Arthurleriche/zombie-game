import {writable} from 'svelte/store';

export const nbrLig = writable(52);
export const nbrCol = writable(95);

export const tableau = writable([])

export const  ligHero = writable(10);
export const  colHero = writable(10);

export const newGame = writable(false); 
export const retry = writable(false); 
