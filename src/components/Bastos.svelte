function bastos(newTab, col, lig, lastE) {
    if (event.key === 'a') {
      player(gun);
    }

    if (event.key === 'a' && lastE === 'ArrowDown') {
      player(gun);
      let ligne = lig + 1;
      newTab[ligne][col] = 3;
      let myVar = setInterval(bastosDown, 80);

      function bastosDown() {
        if (ligne == 39) {
          //colonnes - 1
          newTab[ligne][col] = 2;
          clearInterval(myVar);
        } else {
          newTab[ligne][col] = 2;
          ligne++;
          newTab[ligne][col] = 3;
          showTab(newTab);
        }
      }
      ligne = lig + 1;
      colonne = col;
    }

    if (event.key === 'a' && lastE === 'ArrowRight') {
      let colonne = col + 1;
      newTab[lig][colonne] = 3;
      let myVar = setInterval(bastosRight, 30);

      function bastosRight() {
        if (colonne == 59) {
          newTab[lig][colonne] = 2;
          clearInterval(myVar);
        } else {
          newTab[lig][colonne] = 2;
          colonne++;
          newTab[lig][colonne] = 3;
          showTab(newTab);
        }
      }
      colonne = col + 1;
      ligne = lig;
    }

    if (event.key === 'a' && lastE === 'ArrowUp') {
      let ligne = lig - 1;
      newTab[ligne][col] = 3;
      let myVar = setInterval(bastosUp, 30);

      function bastosUp() {
        if (ligne == 0) {
          newTab[ligne][col] = 2;
          clearInterval(myVar);
        } else {
          newTab[ligne][col] = 2;
          ligne--;
          newTab[ligne][col] = 3;
          showTab(newTab);
        }
      }
      ligne = lig - 1;
      colonne = col;
    }

    if (event.key === 'a' && lastE === 'ArrowLeft') {
      let colonne = col - 1;
      newTab[lig][colonne] = 3;
      let myVar = setInterval(bastosLeft, 30);

      function bastosLeft() {
        if (colonne == 0) {
          newTab[lig][colonne] = 2;
          clearInterval(myVar);
        } else {
          newTab[lig][colonne] = 2;
          colonne--;
          newTab[lig][colonne] = 3;
          showTab(newTab);
        }
      }
      colonne = col - 1;
      ligne = lig;
    }
  }

  const gun = new Audio('./audios/gun.mp3');
  const player = audio => {
    // audio.pause()
    audio.currentTime = 0;
    audio.play();
  };

  //////////// B A S T O S /////////////////////