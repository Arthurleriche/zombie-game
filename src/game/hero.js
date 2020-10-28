let up = false
let right = false
let leftc = false
let down = false

export let top = 0
export let left = 0

document.addEventListener('keydown', (event) => {
    if(event.key === "ArrowDown"){
        down = true
    }
    if(event.key === "ArrowUp"){
        up = true
    }
    if(event.key === "ArrowLeft"){
        leftc = true
    }
    if(event.key === "ArrowRight"){
        right = true
    }
})

document.addEventListener('keyup', (event) => {
    if(event.key === "ArrowDown")
    {
        down = false
    }
    if(event.key === "ArrowUp"){
        up = false
    }
    if(event.key === "ArrowLeft"){
        leftc = false
    }
    if(event.key === "ArrowRight"){
        right = false
    }
})


export const moveHero = () => {
    console.log('TOP : '+  top + '  |  LEFT : ' + left)
    switch(true){
        case up && leftc:
            if(top === 0){
            break
            } else {
            top--
            left--       
            }
            break
        case up && right:
            if(top === 0){
            break
            } else {
            top--
            left++        
            }
            break
        case down && leftc:
            if(top === 0){
                break
            } else {
            top++
            left--       
            }
            break
        case down && right:
            if(top === 480){
            break
            } else {
            top++
            left++      
            }
            break

        case up:
            if(top === 0){
                break
            } else {
            top-- 
            }
            break
           
            case leftc: 
            if(left === 0){
            break
            } else {
            left--
            }
            break
        case down: 
            if(top === 480){
            break
            } else {
            top++ 
            break 
            }
            case right: 
            if(left === 480){
            break
            } else {
            left++
            break
        }
        }
}