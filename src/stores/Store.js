import {writable} from 'svelte/store';
export const newGame = writable(false); 
export const sound = writable(false)

export const isPlaying = writable(false)
export const gameOver = writable(false)

