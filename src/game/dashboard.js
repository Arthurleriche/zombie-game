import {get} from 'svelte/store'
import {lifeList} from '../stores/StoreCharacters'
import {gameOver} from '../stores/Store'
import {i} from '../stores/Store'
// let i = 1


export const heroHurted = (damage) => {
    // console.log(get(lifeList))
    
    get(lifeList).forEach( keur => {
        
        if(get(i) === 1 && keur.id === 1){
            keur.pv -= damage
            document.getElementById('energy1').style.width = keur.pv +'%' 
            if(keur.pv < 20){
                i.update(a => 2)
                keur.pv = 100
            }
        } else if (get(i) ===2 && keur.id === 2){
            keur.pv -= damage
            document.getElementById('energy2').style.width = keur.pv +'%' 
            if(keur.pv < 20){
                i.update(a => 3)
                keur.pv = 100
            }
        } else if (get(i) ===3 && keur.id === 3){
            keur.pv -= damage
            document.getElementById('energy3').style.width = keur.pv +'%' 
            if(keur.pv <20 ){
               gameOver.update (a => true)
            //    stopGame()
               keur.pv = 100
               i.update(a => 1)
            }
        }
        // console.log(get(lifeList))
        // console.log(keur.pv)
    // console.log(get(i))
    }) 
    
}


export const heroHeal = () => {
    get(lifeList).forEach (keur => {
        if(get(i) === 1 && keur.id === 1 ){
            keur.pv += 10
            document.getElementById('energy1').style.width = keur.pv +'%' 
        } else if(get(i) === 2 && keur.id === 2){
            keur.pv += 10
            document.getElementById('energy2').style.width = keur.pv +'%'
        } else if(get(i) ===3 && keur.id ===3){
            keur.pv += 10
            document.getElementById('energy3').style.width = keur.pv +'%'
        }
    
    })
}




