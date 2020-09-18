const character = document.querySelector("#characters")
const perso = document.querySelector("#character")
const block = document.querySelector("#block")

let fromTop = 200
let fromLeft = 200

let tabDown = false
let tabUp = false
let tabLeft = false
let tabRight = false

let blockTop = 400
let blockLeft = 250

let color = 0
const colors = ["blue", "green", "red", "purple"]



document.addEventListener('keydown', () => {
    if(event.key === "s"){
        if(tabDown)return
        tabDown = true
    };
    if(event.key === "z"){
        if(tabUp)return
        tabUp = true
    };
    if(event.key === "q"){
        if(tabLeft)return
        tabLeft = true
    };
    if(event.key === "d"){
        if(tabRight)return
        tabRight = true
    };
}, false)

document.addEventListener('keyup', () => {
    if(event.key === "s"){
        tabDown = false
        perso.classList.remove("mooveDown")
    }
    if(event.key === "z"){
        tabUp = false
        perso.classList.remove("mooveUp")
    }
    if(event.key === "q"){
        console.log(fromLeft)
        tabLeft = false
        perso.classList.remove("mooveLeft")
    }
    if(event.key === "d"){
        tabRight = false
        perso.classList.remove("mooveRight")
    }
})
        const touch = () => {
            if(fromTop >= blockTop - 40 && fromTop <= blockTop - 10 && fromLeft <= blockLeft && fromLeft >= blockLeft - 30){
                block.style.backgroundColor = ` ${colors[color]}`   
                if(color === 3){
                    color = 0
                } else {
                    color++
                }
            }
        }

const gamePlay = setInterval(function(){
    touch()
    if(tabDown && fromTop <= 450){
        fromTop += 1;
        character.style.top = `${fromTop}px`;
        perso.classList.add("mooveDown")
        console.log(fromTop)
    };
    if(tabUp && fromTop >= 0){
        fromTop -= 1;
        character.style.top = `${fromTop}px`;
        perso.classList.add("mooveUp")
        console.log(fromTop)
    }
    if(tabLeft && fromLeft >= 0){
        fromLeft -= 1;
        character.style.left = `${fromLeft}px`;
        perso.classList.add("mooveLeft")
        console.log(fromLeft)
    }
    if(tabRight && fromLeft <= 450){
        fromLeft += 1;
        character.style.left = `${fromLeft}px`;
        perso.classList.add("mooveRight")
        console.log(fromLeft)
    }
}, 10)
