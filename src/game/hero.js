let up = false
let right = false
let leftc = false
let down = false

import {x, y } from '../stores/StoreCharacters'
import { get } from 'svelte/store'

export let top = 0
export let left = 0

document.addEventListener('keydown', (event) => {
    if(event.key === "ArrowDown"){
        down = true
    }
    if(event.key === "ArrowUp"){
        up = true
    }
    if(event.key === "ArrowLeft"){
        leftc = true
    }
    if(event.key === "ArrowRight"){
        right = true
    }

})

document.addEventListener('keyup', (event) => {
    if(event.key === "ArrowDown")
    {
        down = false
    }
    if(event.key === "ArrowUp"){
        up = false
    }
    if(event.key === "ArrowLeft"){
        leftc = false
    }
    if(event.key === "ArrowRight"){
        right = false
    }
})


export const moveHero = () => {
    // console.log('TOP : '+  top + '  |  LEFT : ' + left)
    switch(true){
        case up && leftc:
            if(get(x) === 0 || get(y) === 0){
            break
            } else {
                x.update(a => a - 1)
                y.update(a => a - 1) 
            }
            break
        case up && right:
            if(get(x) === 0 || get(y) === 480){
            break
            } else {
                x.update(a => a - 1)
                y.update(a => a + 1)         
            }
            break
        case down && leftc:
            if(get(x) === 0 || get(y) === 0){
                break
            } else {
            x.update(a => a + 1)
            y.update(a => a - 1)      
            }
            break
        case down && right:
            if(get(x) === 480 || get(y) === 480){
            break
            } else {
            x.update(a => a + 1)
            y.update(a => a + 1)
            }
            break

        case up:
            if(get(x) === 0){
                break
            } else {
            x.update(a => a - 1)
            }
            break
           
            case leftc: 
            if(get(y) === 0){
            break
            } else {
                y.update(a => a - 1)
            }
            break
            case down: 
            if(get(x) === 480){
                break
            } else {
                x.update(a => a + 1)
                break 
            }
            case right: 
            if(get(y) === 480){
                break
            } else {
                y.update(a => a + 1)
            break
        }
        }
}