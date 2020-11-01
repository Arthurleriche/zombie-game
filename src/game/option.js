import { get } from "svelte/store"

import { sound } from '../stores/Store'

export const soundOn = (son) => {
    if(get(sound)){
        const audio = new Audio(son)
        audio.play()
        
    }  
}