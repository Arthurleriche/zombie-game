import {get} from 'svelte/store'
import {sabreActive, gunActive, chooseWeapon, bullets, gunBullet, machineGunBullet, machineGunActive, isFired} from '../stores/StoreWeapon'
import {sabreX, sabreY, gunX, gunY} from '../stores/StoreWeapon' 
import {x, y, direction} from '../stores/StoreCharacters'
import {classProp} from '../stores/StoreWeapon'

const weapon = ["sabre", "gun", "machineGun"];
let index = 0;
let lastShot = Date.now()
let bulletX;
let bulletY;
let bulletId = 0 


document.addEventListener('keydown', (event) => {
    if(event.key === " "){
        isFired.update(a => true)
    }
})

document.addEventListener('keyup', (event) => {
    if(event.key === " "){
        isFired.update(a => false)
        if (Date.now() - lastShot > 400 && get(chooseWeapon) === 'gun' && get(gunBullet) > 0){
            generateBullet()
            lastShot = Date.now()
            gunBullet.update(a => a - 1)
        }
        if(get(chooseWeapon) === "sabre"){
            sabreActive.update(a=>true)
            setTimeout(() => {
                sabreActive.update(a=>false)
            }, 300)
        }
    }


    if(event.key === "a"){
        if(index >= weapon.length){
         index = 0
        } 
        chooseWeapon.update(a => weapon[index])
        index++        
    }

    
})

export const chooseWeaponFct = () => {
    switch (get(chooseWeapon)){
        case "sabre":
            gunActive.update(a => false)
            machineGunActive.update(a => false)
            break
        case "gun":
            machineGunActive.update(a => false)
            sabreActive.update(a => false)
            gunActive.update(a => true)
            updateGun()
            break
            case "machineGun":
                machineGunActive.update(a => true)
                sabreActive.update(a => false)
                gunActive.update(a => false)
                updateGun()
                break
    }
}

export const machineGun = () => {
    if(get(isFired) && get(chooseWeapon) === "machineGun" && get(gunBullet) > 0 && Date.now() - lastShot > 100){
        generateBullet()
        lastShot = Date.now()
        machineGunBullet.update(a => a - 1)
    }
}

export const updateWeapon = () => {
    if(get(sabreActive)){
        switch (get(direction)){
            case "down":
                sabreY.update(a => get(y) + 45)
                sabreX.update(a => get(x) + 5)
                classProp.update(a => 'down')
                break
            case "step-down":
                sabreY.update(a => get(y) + 45)
                sabreX.update(a => get(x) + 5)
                classProp.update(a => 'down')
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
    } else { 
        sabreY.update(a => null)
        sabreX.update( a => null)

    }
}

  
export const updateGun = () => {   
    
        switch (get(direction)){
            case "down":
                gunY.update(a => get(y) + 45)
                gunX.update(a => get(x) + 5)
                classProp.update(a => 'down')
                bulletX = get(gunX) + 10
                bulletY = get(gunY) + 10
                break
            case "step-down":
                gunY.update(a => get(y) + 45)
                gunX.update(a => get(x) + 5)
                classProp.update(a => 'down')
                bulletX = get(gunX) + 10
                bulletY = get(gunY) + 10
                break
            case "up":
                gunY.update(a => get(y) - 20)
                gunX.update(a => get(x))
                classProp.update(a => 'up')
                bulletX = get(gunX) + 10
                bulletY = get(gunY) - 10
                break   
            case "step-up":
                gunY.update(a => get(y) - 20)
                gunX.update(a => get(x))
                classProp.update(a => 'up')
                bulletX = get(gunX) + 10
                bulletY = get(gunY) - 10
                break  
            case "left":
                gunY.update(a => get(y) + 10)
                gunX.update(a => get(x) - 30)
                classProp.update(a => 'left')
                bulletX = get(gunX) - 10
                bulletY = get(gunY) + 10
                break     
            case "step-left":
                gunY.update(a => get(y) + 10)
                gunX.update(a => get(x) - 30)
                classProp.update(a => 'left')
                bulletX = get(gunX) - 10
                bulletY = get(gunY) + 10
                break                  
            case "right":
                gunY.update(a => get(y) +10)
                gunX.update(a => get(x) + 37)
                classProp.update(a => 'right')
                bulletX = get(gunX) + 10
                bulletY = get(gunY) +10
                break
            case "step-right":
                gunY.update(a => get(y) + 10)
                gunX.update(a => get(x) + 37)
                classProp.update(a => 'right')
                bulletX = get(gunX) + 10
                bulletY = get(gunY) + 10
                break             
        }
    }


const generateBullet = () => {
    bulletId++
    bullets.update(a => [...a,{         
        y: bulletY,
        x: bulletX,
        damage: 10, 
        direction: get(classProp),
        id: bulletId
    }])
}

const directionBulletX = (x, direction) => {
    if(direction === "left"){
        return x - 10
    }
    if(direction === "right"){
        return x + 10
    }
    if(direction === "down" ||direction === "up"){
        return x
    }

}

const directionBulletY = (y, direction) => {
    if(direction === "up"){
        return y - 10
    }
    if(direction === "down"){
        return y + 10
    }
    if(direction === "left" ||direction === "right"){
        return y
    }
}

export const moveBullet = () => { 
    if(get(bullets).length >= 1){
        bullets.update(bulletList =>
            bulletList.map(bullet => ({
                ...bullet,
                x: directionBulletX(bullet.x, bullet.direction),
                y: directionBulletY(bullet.y, bullet.direction),
                
            })),
        );
    }
}   

