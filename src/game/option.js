import { get } from "svelte/store"

import { sound } from '../stores/Store'

export const soundOn = (son) => {
    console.log("je suis soundOn")
    if(get(sound)){
        const audio = new Audio(son)
        audio.play()
        
    }  
}