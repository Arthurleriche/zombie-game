import {get} from 'svelte/store'
import {weaponActive} from '../stores/StoreWeapon'
import {sabreX, sabreY} from '../stores/StoreWeapon' 
import {x, y, direction} from '../stores/StoreCharacters'
import {classProp} from '../stores/StoreWeapon'


document.addEventListener('keydown', (event) => {
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
                sabreY.update(a => get(y) + 45)
                sabreX.update(a => get(x) + 5)
                classProp.update(a => 'down')
                console.log('DOWN SKU');
                break
            case "step-down":
                sabreY.update(a => get(y) + 45)
                sabreX.update(a => get(x) + 5)
                classProp.update(a => 'down')
                console.log('STEPDOWN SKU');
                break
            case "up":
                sabreY.update(a => get(y) - 20)
                sabreX.update(a => get(x))
                classProp.update(a => 'up')
                break   
            case "step-up":
                sabreY.update(a => get(y) - 20)
                sabreX.update(a => get(x))
                classProp.update(a => 'up')
                break  
            case "left":
                sabreY.update(a => get(y))
                sabreX.update(a => get(x) - 30)
                classProp.update(a => 'left')
                break     
            case "step-left":
                sabreY.update(a => get(y))
                sabreX.update(a => get(x) - 30)
                classProp.update(a => 'left')

                break                  
            case "right":
                sabreY.update(a => get(y))
                sabreX.update(a => get(x) + 37)
                classProp.update(a => 'right')
                break
            case "step-right":
                sabreY.update(a => get(y))
                sabreX.update(a => get(x) + 37)
                classProp.update(a => 'right')
                break             
        }
    }
}