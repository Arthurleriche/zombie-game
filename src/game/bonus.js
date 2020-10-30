import {boostY, boostX, boostOnMap, heartX, heartY,  heartOnMap, coinOnMap, coinX, coinY} from '../stores/StoreBonus'

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
    }, 5000)

}

const coinAppears = () => {
    coinOnMap.update(a => true)
    coinX.update(a => random(500))
    coinY.update(a => random(500))
    setTimeout(() => {
        coinOnMap.update(a => false)
    }, 8000)
    console.log('DATE: '+ Date.now())
}

export const boost = () => {
    setInterval(() => {
        boostHero()
    },14000)
    setInterval(() => {
        heartHero()
    }, 22000)
    setInterval(()=> {
        coinAppears()
    }, 9000)
}