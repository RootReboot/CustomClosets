function callPrateleira() {

  var texture = new THREE.TextureLoader().load(texturaImagem);

  var material = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });
  callConstrutorPrateleira(material);
}

function callConstrutorPrateleira(material, alturaStart, comprimentoStart, numeroDivisao) {
  var big_rectangle_geo = new THREE.BoxGeometry((comprimentoModulo - espessura * 2), espessura, (larguraModulo - espessura * 2));

  meshPrateleira = new THREE.Mesh(big_rectangle_geo, material);
  meshPrateleira.castShadow = true;
  meshPrateleira.position.y = alturaStart;
  meshPrateleira.position.z = -larguraModulo / 2;
  meshPrateleira.position.x = -comprimentoStart;
  //meshPrateleira.rotation.x = THREE.Math.degToRad(90);
  meshPrateleira.name = numeroDivisao;
  scene.add(meshPrateleira);
}

function callGridPrateleira(alturaStart, comprimentoStart, numeroDivisao) {
  mat = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true });
  callConstrutorPrateleira(mat, alturaStart, comprimentoStart, numeroDivisao);
  listaSelectPartes.push(meshPrateleira);
}

function callCompleteGridPrateleira() {
  var nPrateleirasPorModulo = Math.floor(altura / alturaPrateleira);
  var alturaStart = alturaPrateleira / 2 + espessura;
  comprimentoStart = 0;
  larguraModulo = largura;
  var point = 0;
  if (numDivisoes == 0) {
    comprimentoModulo = comprimento;
    for (var i = 0; i < (nPrateleirasPorModulo); i++) {
      for (var j = 0; j < listaSelectedPartes.length; j++) {
        var positionYSelected = listaSelectedPartes[j].position.y;
        var alturaSelected = (listaSelectedPartes[j].geometry.parameters.height / 2);
        var min = positionYSelected - alturaSelected
        var max = positionYSelected + alturaSelected;
        if (alturaStart >= min && alturaStart <= max) {
          point = 1;
          break;
        }
      }
      if (point != 1) {
        callGridPrateleira(alturaStart, comprimentoStart, -5);
      }
      alturaStart += alturaPrateleira;
      point = 0;
    }
  } else {
    comprimentoModulo = comprimentoDivisao;
    comprimentoStart = -comprimento / 2 + comprimentoDivisao / 2;
    for (var q = 0; q < (numDivisoes + 1); q++) {
      for (var i = 0; i < (nPrateleirasPorModulo); i++) {
        for (var j = 0; j < listaOcupacaoPartes[q].length; j++) {
          var positionYSelected = listaOcupacaoPartes[q][j].position.y;
          var alturaSelected = (listaOcupacaoPartes[q][j].geometry.parameters.height / 2);
          var min = positionYSelected - alturaSelected
          var max = positionYSelected + alturaSelected;
          if (alturaStart >= min && alturaStart <= max) {
            point = 1;
            break;
          }
        }
        if (point != 1) {
          callGridPrateleira(alturaStart, comprimentoStart, q);
        }
        alturaStart += alturaPrateleira;
        point = 0;
      }
      alturaStart = alturaPrateleira / 2 + espessura;
      comprimentoStart += comprimentoDivisao;
    }

  }
}
