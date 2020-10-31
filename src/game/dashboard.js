import {get} from 'svelte/store'
import {lifeList} from '../stores/StoreCharacters'
import {gameOver} from '../stores/Store'
import {i} from '../stores/Store'
// let i = 1


export const heroHurted = (damage) => {
    
    get(lifeList).forEach( keur => {
        
        if(get(i) === 1 && keur.id === 1){
            keur.pv -= damage
            document.getElementById('energy1').style.width = keur.pv +'%' 
            if(keur.pv <= 10){
                i.update(a => 2)
                document.getElementById('keur1').style.opacity = '0.5' 
            }
        } else if (get(i) ===2 && keur.id === 2){
            keur.pv -= damage
            document.getElementById('energy2').style.width = keur.pv +'%' 
            if(keur.pv <= 10){
                i.update(a => 3)
                document.getElementById('keur2').style.opacity = '0.5' 

            }
            console.log('KEUR 2 PV :' + keur.pv)
        } else if (get(i) ===3 && keur.id === 3){
            keur.pv -= damage
            document.getElementById('energy3').style.width = keur.pv +'%' 
            if(keur.pv < 10 ){
               gameOver.update (a => true)
               get(lifeList).forEach (keur => {
                   keur.pv = 100
               })
               i.update(a => 1)
            }
            console.log('KEUR 3 PV :' + keur.pv)
        } 
    }) 
    
}


export const heroHeal = () => {

    get(lifeList).forEach (keur => {
        if(get(i) === 1 && keur.id === 1 ){
            keur.pv += 10
            document.getElementById('energy1').style.width = keur.pv +'%' 
            if(keur.pv === 110){
                keur.pv = 100 
            }
        } else if(get(i) === 2 && keur.id === 2){
            keur.pv += 10
            document.getElementById('energy2').style.width = keur.pv +'%'
            if(keur.pv === 100){
                i.update(a => a - 1)
                document.getElementById('keur1').style.opacity = '1' 
            }
        } else if(get(i) ===3 && keur.id ===3){
            keur.pv += 10
            document.getElementById('energy3').style.width = keur.pv +'%'
            if(keur.pv === 100){
                i.update(a => a - 1)
                document.getElementById('keur2').style.opacity = '1' 
            }
        }
    })
}




