import {writable} from 'svelte/store';

export const  ligHero = writable(5);
export const  colHero = writable(5);
export const  step = writable(1);
export const  direction = writable("down");