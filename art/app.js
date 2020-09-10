const nbLigne = 5;
const nbCol = 5; 
let tableau = []
let c = 0
let l = 0
const fio = new Audio('fio2.mp3');
const fio2 = new Audio('fio3.mp3')


const createTab = (lig, col, car = 0) => {
    let tab = []
    for(i=0; i <= lig; i++){
        const ligne = []
        for(y=0; y <= col; y++){
            ligne.push(car)
        }
        tab.push(ligne)
    }
    return tab
}
tableau = createTab(nbLigne, nbCol);

const showTab = (tab) => {
    const jeu = document.querySelector("#tableau");
    let content = "<table>";
    for(let i=0; i< nbLigne; i++){
        content += "<tr>";
        for(j=0; j < nbCol; j++){
            content += "<td class='border'>"
                if(tab[i][j] === 0){
                    content += "<img src='./kebab.png'>"
                }
                if(tab[i][j] === 1){
                    content += "<img src='./theo.png'>"
                }
                if(tab[i][j] === 2){
                    content += "<img src='./caca.png'>"
                }
                content += "</td>";
            }
            content += " </tr>";
        }
        content += "</table>";
        jeu.innerHTML = content
    }
    
    
const initGame = (newTab) => {
    newTab[0][0] = 1 
    showTab(newTab);
};
    
const updateGame = (newTab) => {
    let counter = 0
    
    for(let b= 0; b<=5; b++){
        for(let n= 0; n<5; n++){
            if(newTab[b][n] === 2){
                counter++
            }
        }
    }
    showTab(newTab);
    let end = false
    if(counter === 24){
        setTimeout(() => {
            fio2.play();
            end = true
            endOfGame(end) 
        }, 1000)
    }
}

const endOfGame = (fin) => {
    if(fin){
        alert('bien ouej le sang recommence j ai tres faim');
        end = false
        c = 0
        l = 0
        tableau = createTab(nbLigne, nbCol, 0);
        initGame(tableau)
        showTab(tableau)
    }
}

const player = (audio) => {
    audio.pause()
    audio.currentTime = 0;
    audio.play()
}

const moovePlayer = (event, newTab) => {
    if(event.key === "ArrowDown" && c <= 3){
        tableau[c][l] = 2;
        c++;
        newTab[c][l] = 1;
        player(fio)
    }
    if(event.key === "ArrowUp" && c >= 1){
        tableau[c][l] = 2;
        c--;
        newTab[c][l] = 1;
        player(fio)    
    }
    if(event.key === "ArrowRight" && l <= 3){
        tableau[c][l] = 2;
        l++;
        newTab[c][l] = 1;
        player(fio)    
    }
    if(event.key === "ArrowLeft" && l >= 1){
        tableau[c][l] = 2;
        l--;
        newTab[c][l] = 1;
        player(fio)    
    }
    updateGame(newTab)
}

initGame(tableau);

document.addEventListener('keydown', () => {
    event.repeat = true
    moovePlayer(event, tableau);
    console.log(event)
})