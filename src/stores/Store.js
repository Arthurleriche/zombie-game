import {writable} from 'svelte/store';

export const sound = writable(false)
export const newGame = writable(null); 


export const isPlaying = writable(false)
export const gameOver = writable(false)

export const backToMenu = writable(false)


export const i = writable(1)


export const level = writable(1);






