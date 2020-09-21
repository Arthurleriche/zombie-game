console.log("coucou");
let tableau = [];

  const createTab = (lig, col, car = 0) => {
    let tab = [];
    for (let i = 0; i <= lig; i++) {
      const ligne = [];
      for (let y = 0; y <= col; y++) {
        ligne.push(car);
      }
      tab.push(ligne);
    }
    return tab;
  };

tableau = createTab(10, 10);
console.log(tableau);

tableau.forEach(element => 
    element[10].forEach(elements => console.log(elements))    
);