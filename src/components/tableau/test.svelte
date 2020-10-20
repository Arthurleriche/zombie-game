<script>
  const createHero = () => {
    return {
      updateHero: () => {
        $previousLigHero = $ligHero;
        $previousColHero = $colHero;
        switch (true) {
          case down:
            $direction = 'step-down';
            if ($ligHero >= $nbrLig - 2 && $bottomSide <= 5) {
              $direction = 'down';
            } else {
              $bottomSide = $bottomSide - 1;
            }
            if ($bottomSide === 0) {
              $ligHero++;
              $bottomSide = 49;
            }
            break;
          case up:
            $direction = 'step-up';
            if ($ligHero <= 1) {
              $direction = 'up';
            } else {
              $bottomSide = $bottomSide + 1;
              if ($bottomSide === 50) {
                $ligHero--;
                $bottomSide = 1;
              }
            }
            break;
          case left:
            $direction = 'step-left';
            if ($colHero <= 1 && $leftSide <= 5) {
              $direction = 'left';
            } else {
              $leftSide = $leftSide - 1;
              if ($leftSide === 0) {
                $colHero--;
                $leftSide = 49;
              }
            }
            break;
          case right:
            $direction = 'step-right';
            if ($colHero >= $nbrCol - 1) {
              $direction = 'right';
            } else {
              $leftSide = $leftSide + 1;
              if ($leftSide === 50) {
                $colHero++;
                $leftSide = 1;
              }
            }
            break;
        }
      },
      drawHero: () => {
          
      }
    };
  };

  const updateMoveHero = () => {
    $previousLigHero = $ligHero;
    $previousColHero = $colHero;
    switch (true) {
      case down:
        $direction = 'step-down';
        if ($ligHero >= $nbrLig - 2 && $bottomSide <= 5) {
          $direction = 'down';
        } else {
          $bottomSide = $bottomSide - 1;
        }
        if ($bottomSide === 0) {
          $ligHero++;
          $bottomSide = 49;
        }
        break;
      case up:
        $direction = 'step-up';
        if ($ligHero <= 1) {
          $direction = 'up';
        } else {
          $bottomSide = $bottomSide + 1;
          if ($bottomSide === 50) {
            $ligHero--;
            $bottomSide = 1;
          }
        }
        break;
      case left:
        $direction = 'step-left';
        if ($colHero <= 1 && $leftSide <= 5) {
          $direction = 'left';
        } else {
          $leftSide = $leftSide - 1;
          if ($leftSide === 0) {
            $colHero--;
            $leftSide = 49;
          }
        }
        break;
      case right:
        $direction = 'step-right';
        if ($colHero >= $nbrCol - 1) {
          $direction = 'right';
        } else {
          $leftSide = $leftSide + 1;
          if ($leftSide === 50) {
            $colHero++;
            $leftSide = 1;
          }
        }
        break;
    }
  };

  const drawMoveHero = () => {
    $tableau[$previousLigHero][$previousColHero] = 0;
    $tableau[$ligHero][$colHero] = 'p';
  };
</script>
