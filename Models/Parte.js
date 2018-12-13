function callCompleteGridPartes(alturaParte, nParte) {

  // nParte = id da parte a adicionar

  var nPartesPorModulo = Math.floor(altura / alturaParte);

  if (nParte == 0) {
    // Cabide
    var alturaStart = alturaParte;
  } else {
    //Prateleira && Gaveta
    var alturaStart = alturaParte / 2 + espessura;
  }

  comprimentoStart = 0;
  larguraModulo = largura;
  var isValid = true;
  var min = 0, max = 0, positionYSelected = 0, alturaSelected = 0;

  // Grids para armario sem divisoes
  if (numDivisoes == 0) {

    comprimentoModulo = comprimento;

    //Num partes a selecionar
    for (var i = 0; i < (nPartesPorModulo); i++) {
      //Partes já selecionadas
      for (var j = 0; j < listaSelectedPartes.length; j++) {
        if(listaSelectedPartes[j].name!=-10){
          //Cabide
          if (listaSelectedPartes[j].geometry.type == "CylinderGeometry") {
            positionYSelected = listaSelectedPartes[j].position.y;
            min = positionYSelected - alturaCabide + espessura;
            max = positionYSelected + 5;

            //Prateleira && Gaveta
          } else {
            positionYSelected = listaSelectedPartes[j].position.y;
            alturaSelected = (listaSelectedPartes[j].geometry.parameters.height / 2);
            min = positionYSelected - alturaSelected;
            max = positionYSelected + alturaSelected;
          }

          isValid = validarPartes(nParte, alturaStart, min, max);

          if (!isValid) break;
        }
      }

      //Se passar validaçoes chama grid correspondente
      if (isValid) {
        callGrid(nParte, alturaStart, comprimentoStart, -5);
      }

      alturaStart += alturaParte;
    }

    // Grids para armario com divisoes
  } else {
    comprimentoModulo = comprimentoDivisao;
    comprimentoStart = -comprimento / 2 + comprimentoDivisao / 2;

    //Para cada divisao
    for (var q = 0; q < (numDivisoes + 1); q++) {
      for (var i = 0; i < (nPartesPorModulo); i++) {
        for (var j = 0; j < listaOcupacaoPartes[q].length; j++) {
          if (listaOcupacaoPartes[q][j].geometry.type == "CylinderGeometry") {
            positionYSelected = listaOcupacaoPartes[q][j].position.y;
            min = positionYSelected - alturaCabide + espessura;
            max = positionYSelected + 5;
          } else {
            positionYSelected = listaOcupacaoPartes[q][j].position.y;
            alturaSelected = (listaOcupacaoPartes[q][j].geometry.parameters.height / 2);
            min = positionYSelected - alturaSelected;
            max = positionYSelected + alturaSelected;
          }

          isValid = validarPartes(nParte, alturaStart, min, max);

          if (!isValid) break;

        }

        //Se passar validaçoes chama grid correspondente
        if (isValid) {
          callGrid(nParte, alturaStart, comprimentoStart, q);
        }

        alturaStart += alturaParte;
      }

      if (nParte == 0) {
        alturaStart = alturaParte + espessura;
      } else {
        alturaStart = alturaParte / 2 + espessura;
      }
      isValid=true;
      comprimentoStart += comprimentoDivisao;
    }

  }

}

function validarPartes(nParte, alturaStart, min, max) {
  // Validar Altura
  if (nParte == 0) {

    //Cabide
    var alturaStartCabide = alturaStart - alturaCabide;

    if (alturaStartCabide <= min && alturaStart >= min) {
      return false;
    }

  } else {

    //Prateleira && Gaveta
    if (alturaStart >= min && alturaStart <= max) {
      return false;
    }

  }

  return true;
}

function callGrid(nParte, alturaStart, comprimentoStart, divisao) {

  switch (nParte) {

    //Id Cabide
    case 0:
      callGridCabide(alturaStart, comprimentoStart, divisao);
      break;

    //Id Gaveta
    case 1:
      callGridGaveta(alturaStart, comprimentoStart, divisao);
      break;

    //Id Prateleira
    case 2:
      callGridPrateleira(alturaStart, comprimentoStart, divisao);
      break;

    default:
      break;
  }

}
