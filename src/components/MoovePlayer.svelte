////	///  M O O V E P L A Y E R //////////////
let c = 0;
let l = 0;
const moovePlayer = (event, newTab) => {
  if (event.key === 'ArrowDown' && l < lignes - 1) {
    tableau[l][c] = 2;
    // tableau [l][c+1] = 2
    // tableau [l+1][c] = 2
    // tableau [l+1][c+1] = 2
    l++;
    newTab[l][c] = 1;
    // tableau [l][c+1] = 1
    // tableau [l+1][c] = 1
    // tableau [l+1][c+1] = 1
  }

  if (event.key === 'ArrowUp' && l >= 1) {
    tableau[l][c] = 2;
    // tableau [l][c+1] = 2
    // tableau [l+1][c] = 2
    // tableau [l+1][c+1] = 2
    l--;
    newTab[l][c] = 1;
    // tableau [l][c+1] = 1
    // tableau [l+1][c] = 1
    // tableau [l+1][c+1] = 1
  }

  if (event.key === 'ArrowRight' && c < colonnes - 1) {
    tableau[l][c] = 2;
    // tableau [l][c+1] = 2
    // tableau [l+1][c] = 2
    // tableau [l+1][c+1] = 2
    c++;
    newTab[l][c] = 1;
    // tableau [l][c+1] = 1
    // tableau [l+1][c] = 1
    // tableau [l+1][c+1] = 1
  }

  if (event.key === 'ArrowLeft' && c >= 1) {
    tableau[l][c] = 2;
    // tableau [l][c+1] = 2
    // tableau [l+1][c] = 2
    // tableau [l+1][c+1] = 2
    c--;
    newTab[l][c] = 1;
    // tableau [l][c+1] = 1
    // tableau [l+1][c] = 1
    // tableau [l+1][c+1] = 1
  }

  updateGame(newTab);
};
///////////  M O O V E P L A Y E R //////////////