import {writable} from 'svelte/store';

export const nbrLig = writable(10);
export const nbrCol = writable(10);

export const tableau = writable([])

export const  ligHero = writable(8);
export const  colHero = writable(2);
