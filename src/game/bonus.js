import {boostY, boostX, boostOnMap, heartX, heartY,  heartOnMap} from '../stores/StoreBonus'

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
    heartX.update(a => random(500))
    heartY.update(a => random(500))
    setTimeout(() => {
        heartOnMap.update(a => false)
    }, 5000)

}

export const boost = () => {
    setInterval(() => {
        boostHero()
    },14000)
    setInterval(() => {
        heartHero()
    }, 22000)

}