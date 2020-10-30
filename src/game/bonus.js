import {get} from 'svelte/bonus'
import {speed} from '../stores/StoreCharacters'
import {boostY, boostX, boostOnMap} from '../stores/StoreBonus'


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

export const boost = () => {
    setInterval(() => {
        boostHero()
    },10000)

}