let up = false
let right = false
let leftc = false
let down = false

import {x, y, direction, speed } from '../stores/StoreCharacters'
import { get } from 'svelte/store'
// import {collisionBlocks} from '../game/collision'

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
        direction.update(a => "down")
    }
    if(event.key === "ArrowUp"){
        up = false
        direction.update(a => "up")
    }
    if(event.key === "ArrowLeft"){
        leftc = false
        direction.update(a => "left")
    }
    if(event.key === "ArrowRight"){
        right = false
        direction.update(a => "right")
    }
})


export const moveHero = () => {
        switch(true){
                case up && leftc:
                    if(get(x) <= 45 || get(y) < 19){
                    direction.update(a => "up")
                    break
                    } else {
                        x.update(a => a - 1 * get(speed))
                        y.update(a => a - 0.5 * get(speed)) 
                        direction.update(a => "step-left")
                    }
                break

                case up && right:
                    if(get(y) <= 20 || get(x) >= 800){
                    direction.update(a => "up")
                    break
                    } else {
                        y.update(a => a - 0.5 * get(speed))
                        x.update(a => a + 1 * get(speed))     
                        direction.update(a => "step-right")    
                    }
                break

                case down && leftc:
                    if(get(y) > 510 || get(x) < 45){
                        direction.update(a => "left")
                        break
                    } else {
                    x.update(a => a - 1 * get(speed))
                    y.update(a => a + 0.5 * get(speed))   
                    direction.update(a => "step-left")   
                    }
                break

                case down && right:
                    if(get(x) >= 800 || get(y) >= 510){
                    direction.update(a => "right")
                    break
                    } else {
                    x.update(a => a + 1  * get(speed))
                    y.update(a => a + 0.5 * get(speed))
                    direction.update(a => "step-right")
                    }
                break
        
                case up:
                    if(get(y) <= 20){
                        direction.update(a => "up")
                        break
                    } else {
                    y.update(a => a - 1 * get(speed))
                    direction.update(a => "step-up")
                    }
                break
                   
                case leftc: 
                    if(get(x) <= 50 ){
                        direction.update(a => "left")
                        break
                    } else {
                        x.update(a => a - 1 * get(speed))
                        direction.update(a => "step-left")
                    }
                break

                case down: 
                    if(get(y) >= 510){
                        direction.update(a => "down")
                        break
                    } else {
                        y.update(a => a + 1 * get(speed))
                        direction.update(a => "step-down")
                    }
                break

                case right: 
                    if(get(x) >= 800){
                        direction.update(a => "right")
                        break
                    } else {
                        x.update(a => a + 1 * get(speed))
                        direction.update(a => "step-right")
                break
                }
                }
            
    
    
    
    
}