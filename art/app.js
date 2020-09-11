const jeu = document.querySelector("#tableau");
const nbLigne = 5;
const nbCol = 5; 
let tableau = []
let l = 0
let c = 0
const fio = new Audio('fio2.mp3');
const fio2 = new Audio('fio3.mp3');
let lastEvent = ""



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

let ligne = 0
let colonne = 0

const bastos = (newTab, col, lig, lastE) => {
    if(event.key === "a" && lastE === "ArrowDown"){
     newTab[lig + 1][col] = 3
     ligne = lig + 1
     colonne = col
     console.log(ligne, colonne)
     
    }
    if(event.key === "a" && lastE === "ArrowUp"){
        newTab[lig - 1][col] = 3
        ligne = lig - 1
        colonne = col
        console.log(ligne, colonne)
    }
    if(event.key === "a" && lastE === "ArrowLeft"){
        newTab[lig][col - 1] = 3
        ligne = lig
        colonne = col - 1
        console.log(ligne, colonne)
    } 
    if(event.key === "a" && lastE === "ArrowRight"){
        newTab[lig][col + 1] = 3
        ligne = lig
        colonne = col + 1
        console.log(ligne, colonne)
    }
    if(event.key === "a"){
        newTab[ligne][colonne]
        console.log(ligne, colonne)
    } 
    showTab(newTab);

    console.log(newTab)

}

const player = (audio) => {
    audio.pause()
    audio.currentTime = 0;
    audio.play()
}

const moovePlayer = (event, newTab) => {
    if(event.key === "ArrowDown" && c <= 3){
        tableau[l][c] = 2;
        l++;
        newTab[l][c] = 1;
        player(fio)
    }
    if(event.key === "ArrowUp" && c >= 1){
        tableau[l][c] = 2;
        l--;
        newTab[l][c] = 1;
        player(fio)    
    }
    if(event.key === "ArrowRight" && l <= 3){
        tableau[l][c] = 2;
        c++;
        newTab[l][c] = 1;
        player(fio)    
    }
    if(event.key === "ArrowLeft" && l >= 1){
        tableau[l][c] = 2;
        c--;
        newTab[l][c] = 1;
        player(fio)    
    }
    updateGame(newTab)
}

initGame(tableau);

let array = []
document.addEventListener('keydown', (event) => {
    array = [event.key, ...array]
    array.splice(2)
    event.repeat = true
    moovePlayer(event, tableau);
    bastos(tableau, c, l, array[1])
})
