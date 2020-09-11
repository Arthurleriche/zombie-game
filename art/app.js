const jeu = document.querySelector("#tableau");
const nbLigne = 10;
const nbCol = 10; 
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
    if(counter === 99){
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
        let ligne = lig + 1
        newTab[ligne][col] = 3
     
        setInterval(() => {
            newTab[ligne][col] = 2
            ligne++
            newTab[ligne][col] = 3
            showTab(newTab);
        }, 10);

        ligne = lig + 1
        colonne = col
        
     
    }
    if(event.key === "a" && lastE === "ArrowUp"){
        ligne = lig - 1
        newTab[ligne][col] = 3
        let stop = nbLigne - ligne

        setInterval((stop) => {
            newTab[ligne][col] = 2
            ligne--
            newTab[ligne][col] = 3
            showTab(newTab);
        },stop * 10);
        
        ligne = lig - 1
        colonne = col
    
    }
    if(event.key === "a" && lastE === "ArrowLeft"){
        let colonne = col - 1
        newTab[lig][colonne] = 3

        setInterval(() => {
            newTab[lig][colonne] = 2
            colonne--
            newTab[lig][colonne] = 3
            showTab(newTab);
        }, 10);

        ligne = lig
        colonne = col - 1
        
    } 
    if(event.key === "a" && lastE === "ArrowRight"){
        let colonne = col + 1
        newTab[lig][colonne] = 3

        setInterval(() => {
            newTab[lig][colonne] = 2
            colonne++
            newTab[lig][colonne] = 3
            showTab(newTab);
        }, 10);

        ligne = lig
        colonne = col + 1
        
    }
    if(event.key === "a"){
        newTab[ligne][colonne]
        
    } 
    showTab(newTab);

}

const player = (audio) => {
    audio.pause()
    audio.currentTime = 0;
    audio.play()
}

const moovePlayer = (event, newTab) => {
    if(event.key === "ArrowDown" && l <= 8){
        tableau[l][c] = 2;
        l++;
        newTab[l][c] = 1;
        player(fio)
    }
    if(event.key === "ArrowUp" && l >= 1){
        tableau[l][c] = 2;
        l--;
        newTab[l][c] = 1;
        player(fio)    
    }
    if(event.key === "ArrowRight" && c <= 8){
        tableau[l][c] = 2;
        c++;
        newTab[l][c] = 1;
        player(fio)    
    }
    if(event.key === "ArrowLeft" && c >= 0){
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
