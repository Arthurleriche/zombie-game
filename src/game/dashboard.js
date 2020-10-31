import {pv} from '../stores/StoreCharacters'
import {get} from 'svelte/store'
import {lifeList} from '../stores/StoreCharacters'
import {gameOver} from '../stores/Store'
import { stopGame } from './gameloop'

let i = 1


export const heroHurted = (damage) => {
    get(lifeList).forEach( keur => {

        if(i === 1 && keur.id === 1){
            keur.pv -= damage
            document.getElementById('energy1').style.width = keur.pv +'%' 
            if(keur.pv === 0){
                i++
                keur.pv = 100
            }
        } else if (i ===2 && keur.id === 2){
            keur.pv -= damage
            document.getElementById('energy2').style.width = keur.pv +'%' 
            if(keur.pv === 0){
                i++
                keur.pv = 100
            }
        } else if (i ===3 && keur.id === 3){
            keur.pv -= damage
            document.getElementById('energy3').style.width = keur.pv +'%' 
            if(keur.pv === 0){
               gameOver.update (a => true)
               stopGame()
               keur.pv = 100
               i = 1 
            }
        }
    })
}




