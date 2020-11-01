import { get } from 'svelte/store'
import {boostY, boostX, boostOnMap, heartX, heartY,  heartOnMap, coinOnMap, coinX, coinY, gunOnMap, machineGunOnMap, machineGunBonusY, machineGunBonusX} from '../stores/StoreBonus'
import {gunHero} from '../stores/StoreWeapon'
import { gunBonusX, gunBonusY} from '../stores/StoreBonus'

const random = (num) => {
    let randomNum 
    randomNum = Math.floor(Math.random() * num)
    return randomNum
}

const boostHero = () => {
    boostOnMap.update(a => true)
    boostX.update(a => random(500))
    boostY.update(a => random(500))
    setTimeout(() => {
        boostOnMap.update(a => false)
    }, 5000)

}
const heartHero = () => {
    heartOnMap.update(a => true)
    heartX.update(a => random(400) + 50 )
    heartY.update(a => random(400) +50 )
    setTimeout(() => {
        heartOnMap.update(a => false)
    }, 8000)
}


const coinAppears = () => {
    coinOnMap.update(a => true)
    coinX.update(a => random(500))
    coinY.update(a => random(500))
    setTimeout(() => {
        coinOnMap.update(a => false)
    }, 4000)

}

const gunAppears = () => {
    gunOnMap.update(a => true)
    gunBonusX.update(a => random(500))
    gunBonusY.update(a => random(500))
    setTimeout(() => {
        gunOnMap.update(a => false)
    }, 7000)
    
}

const machineGunAppears = () => {
    machineGunOnMap.update(a => true)
    machineGunBonusX.update(a => random(500))
    machineGunBonusY.update(a => random(500))
    setTimeout(() => {
        machineGunOnMap.update(a => false)
    }, 6000)
    
}

let boosthero
let hearthero
let coinappears
let gunappears
let machinegunappears

export const boost = () => {
    boosthero = setInterval(() => {
        boostHero()
    },14000)
    hearthero = setInterval(() => {
        heartHero()
    }, 3000)
    coinappears = setInterval(()=> {
        coinAppears()
    }, 5000)

    gunappears = setInterval(() => {
        gunAppears()  
    }, 25000)
    machinegunappears = setInterval(() => {
        machineGunAppears() 
    }, 25000)
}

export const stopBoost = () => {
    clearInterval(boosthero)
    clearInterval(hearthero)
    clearInterval(coinappears)
    clearInterval(gunappears)
    clearInterval(machinegunappears)
}