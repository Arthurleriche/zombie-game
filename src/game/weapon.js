import {get} from 'svelte/store'
import {weaponActive} from '../stores/StoreWeapon'
import {sabreX, sabreY} from '../stores/StoreWeapon' 
import {x, y, direction} from '../stores/StoreCharacters'


document.addEventListener('keyup', (event) => {
    if(event.key === " "){
        weaponActive.update(a=>true)
    }
    setTimeout(() => {
        weaponActive.update(a=>false)
    }, 300)
})

 
export const updateWeapon = () => {   
    console.log(get(direction))
    if(get(weaponActive)){  
        switch (get(direction)){
            case "down":
                sabreY.update(a => get(y) + 50)
                sabreX.update(a => get(x))
                break
            case "step-down":
                sabreY.update(a => get(y) + 50)
                sabreX.update(a => get(x))
                break
            case "up":
                sabreY.update(a => get(y) - 50)
                sabreX.update(a => get(x))
                break   
            case "step-up":
                sabreY.update(a => get(y) - 50)
                sabreX.update(a => get(x))
                break  
            case "left":
                sabreY.update(a => get(y))
                sabreX.update(a => get(x) - 50)
                break     
            case "step-left":
                sabreY.update(a => get(y))
                sabreX.update(a => get(x) - 50)
                break                  
            case "right":
                sabreY.update(a => get(y))
                sabreX.update(a => get(x) + 50)
                break
            case "step-right":
                sabreY.update(a => get(y))
                sabreX.update(a => get(x) + 50)
                break             
        }
    }
}