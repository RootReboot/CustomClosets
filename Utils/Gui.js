function criaGui() {
  params = {
    altura: 150,
    comprimento: 100,
    largura: 70,
    nDivisao: 0,
    nDivisaoHorizontal: 0,
    CameraCentralizada: function(){
      controls.reset();
    }
  };

  var selects = {
    selectGaveta: function () {
      clearModulos();
      callCompleteGridPartes(alturaGaveta, 1);
    },
    selectPorta: function () {
      clearModulos();
      callCompleteGridPorta();
    },
    selectPrateleira: function () {
      clearModulos();
      callCompleteGridPartes(alturaPrateleira, 2);
    },
    selectCabide: function () {
      clearModulos();
      callCompleteGridPartes(alturaCabide, 0);
    },
    selectLimpar: function () {
      clearModulos();
    },
    selectLimparTudo: function () {
      clearCompleteModulos();
    },
    selectRetirarUltimoElemento: function () {
      clearUltimoModulo();
    }
  };

  var materialSelect = {
    mat: texturaMadeiraEscura
  };

  var safeAltura = 0;
  var safeComprimento = 0;
  var safeLargura = 0;
  var folder = gui.addFolder('Dimensoes Armario');
  var folder1 = gui.addFolder('Adicionar partes');
  //var folderTexturas = gui.addFolder('Texturas');
  //FoldersParaCadaMaterial;
  let folderMateriais = gui.addFolder('Materiais');
  folderMateriais.open();
    let folderAglomerado = folderMateriais.addFolder('Aglomerado');
    folderAglomerado.open();
    let folderMadeira = folderMateriais.addFolder('Madeira');
    folderMadeira.open();
    let folderMetal = folderMateriais.addFolder('Metal');
    folderMetal.open();
  //
  var folderCamera = gui.addFolder('Camera');
  folderCamera.add(params,'CameraCentralizada');
  folderCamera.open();


  //Altura
  folder.add(params, 'altura').name('Altura(cm)').min(150).max(250).onFinishChange(function () {
    if (safeAltura != params.altura) {
      clearCompleteModulos()
      altura = params.altura * scaleArmario;
      meshDireita.geometry = new THREE.BoxGeometry(largura, altura, espessura);
      meshDireita.position.y = altura / 2 + espessura;
      meshEsquerda.geometry = new THREE.BoxGeometry(largura, altura, espessura);
      meshEsquerda.position.y = altura / 2 + espessura;
      meshCima.position.y = altura + espessura;
      meshAtras.geometry = new THREE.BoxGeometry(comprimento, altura, espessura);
      meshAtras.position.y = altura / 2 + espessura;
      maxDivisaoHorizontal = (Math.floor(params.altura / valorMinimoDivisaoHorizontal)) - 1;
      nDivisaoHorizontalFolder.max(maxDivisaoHorizontal);
      for (var i = 0; i < listMeshDivisao.length; i++) {
        listMeshDivisao[i].geometry = new THREE.BoxGeometry(largura, altura, espessura);
        listMeshDivisao[i].position.y = altura / 2 + espessura / 2;
      }
      for (var j = 0; j < listMeshDivisaoHorizontal.length; j++) {
        scene.remove(listMeshDivisaoHorizontal[j]);
      }
    }
    safeAltura = params.altura;
  });


  //Comprimento
  folder.add(params, 'comprimento').name('Comprimento(cm)').min(100).max(250).onFinishChange(function () {
    if (safeComprimento != params.comprimento) {
      clearCompleteModulos()
      comprimento = params.comprimento * scaleArmario;
      comprimentoDivisao = comprimento;
      numDivisoes=0
      meshDireita.position.x = comprimento / 2 - espessura / 2;
      meshEsquerda.position.x = -comprimento / 2 + espessura / 2;
      meshCima.geometry = new THREE.BoxGeometry(comprimento, largura, espessura);
      meshBaixo.geometry = new THREE.BoxGeometry(comprimento, largura, espessura);
      meshAtras.geometry = new THREE.BoxGeometry(comprimento, altura, espessura);
      maxDivisao = (Math.floor(params.comprimento / valorMinimoDivisao)) - 1;
      nDivisaoFolder.max(maxDivisao);
      for (var i = 0; i < listMeshDivisao.length; i++) {
        scene.remove(listMeshDivisao[i]);
      }
      for (var j = 0; j < listMeshDivisaoHorizontal.length; j++) {
          listMeshDivisaoHorizontal[j].geometry = new THREE.BoxGeometry(comprimento - espessura * 2, largura, espessura);
      }
    }
    safeComprimento = params.comprimento;
  });


  //Largura
  folder.add(params, 'largura').name('Largura(cm)').min(70).max(100).onFinishChange(function () {
    if (safeLargura != params.largura) {
      clearCompleteModulos();
      largura = params.largura * scaleArmario;
      meshCima.position.z = -largura / 2 + espessura / 2;
      meshBaixo.position.z = -largura / 2 + espessura / 2;
      meshDireita.position.z = -largura / 2 + espessura / 2;
      meshEsquerda.position.z = -largura / 2 + espessura / 2;
      meshEsquerda.geometry = new THREE.BoxGeometry(largura, altura, espessura);
      meshDireita.geometry = new THREE.BoxGeometry(largura, altura, espessura);
      meshCima.geometry = new THREE.BoxGeometry(comprimento, largura, espessura);
      meshBaixo.geometry = new THREE.BoxGeometry(comprimento, largura, espessura);
      meshAtras.geometry = new THREE.BoxGeometry(comprimento, altura, espessura);
      for (var i = 0; i < listMeshDivisao.length; i++) {
        listMeshDivisao[i].geometry = new THREE.BoxGeometry(largura, altura, espessura);
        listMeshDivisao[i].position.z = -largura / 2 + espessura / 2;
      }
      for (var j = 0; j < listMeshDivisaoHorizontal.length; j++) {
          listMeshDivisaoHorizontal[j].geometry = new THREE.BoxGeometry(comprimento - espessura * 2, largura, espessura);
          listMeshDivisaoHorizontal[j].position.z = - largura / 2 + espessura / 2;
      }
    }
    safeLargura = params.largura;
  });


  //Num Divisoes
  var nDivisaoFolder = folder.add(params, 'nDivisao').name('Nº Verticais').min(0).max(maxDivisao).onFinishChange(function () {

    numDivisoes = Math.round(params.nDivisao);

    if (validacaoDivisao != numDivisoes) {
      clearCompleteModulos();
      listaOcupacaoPartes.push([]);

      for (var q = 0; q < listMeshDivisao.length; q++) {
        scene.remove(listMeshDivisao[q]);
      }

      comprimentoDivisao = comprimento;

      if (numDivisoes != 0) {
        comprimentoDivisao = comprimento / (numDivisoes + 1);
        posicaoXDivisao = comprimentoDivisao;

        for (var i = 0; i < numDivisoes; i++) {
          listaOcupacaoPartes.push([]);
          criarDivisoes();
          posicaoXDivisao += comprimentoDivisao;
        };

        posicaoXDivisao = comprimentoDivisao;
      }

      validacaoDivisao = numDivisoes;
    }

  }).listen();

  var nDivisaoHorizontalFolder = folder.add(params, 'nDivisaoHorizontal').name('Nº Horizontais').min(0).max(maxDivisaoHorizontal).onFinishChange(function () {

    numDivisoesHorizontais = Math.round(params.nDivisaoHorizontal);
    if (validacaoDivisaoHorizontal != numDivisoesHorizontais) {
        clearCompleteModulos();
        listaOcupacaoPartes.push([]);

        for (var q = 0; q < listMeshDivisaoHorizontal.length; q++) {
            scene.remove(listMeshDivisaoHorizontal[q]);
        }
        alturaDivisaoHorizontal = altura;

        if (numDivisoesHorizontais != 0) {
            alturaDivisaoHorizontal = altura / (numDivisoesHorizontais + 1);
            posicaoYDivisaoHorizontal = alturaDivisaoHorizontal;

            for (var i = 0; i < numDivisoesHorizontais; i++) {
                listaOcupacaoPartes.push([]);
                criarDivisoesHorizontais();
                posicaoYDivisaoHorizontal += alturaDivisaoHorizontal;
            }
            posicaoYDivisaoHorizontal = alturaDivisaoHorizontal;
        }
        validacaoDivisaoHorizontal = numDivisoesHorizontais;
    }
  }).listen();


  //Add Partes Whizard
  folder1.add(selects, "selectCabide").name("Cabide");
  folder1.add(selects, "selectGaveta").name("Gaveta");
  folder1.add(selects, "selectPorta").name("Porta");
  folder1.add(selects, "selectPrateleira").name("Prateleira");
  folder1.add(selects, "selectRetirarUltimoElemento").name("Retirar Ultimo Elemento");
  folder1.add(selects, "selectLimpar").name("Retirar Grids");
  folder1.add(selects, "selectLimparTudo").name("Limpar Modulos");
  folder.open();
  var ficheiroTextura;


  //Materiais e Acabamentos
  var selectsTextura = {
    selectAglomerado: function () {
      ficheiroTextura = texturaMadeiraCompressada;
      texturaImagem = ficheiroTextura;
    },
    selectAglomeradoVerniz: function () {
      ficheiroTextura = texturaMadeiraDetalhada;
      texturaImagem = ficheiroTextura;
    },
    selectMadeira: function () {
      ficheiroTextura = texturaMadeiraClara;
      texturaImagem = ficheiroTextura;
    },
    selectMadeiraEnvernizado: function () {
      ficheiroTextura = texturaMadeiraEscura;
      texturaImagem = ficheiroTextura;
    },
    selectMatteEscuro: function () {
      ficheiroTextura = texturaMatteEscuro;
      texturaImagem = ficheiroTextura;
    },
    selectMatteClaro: function () {
      ficheiroTextura = texturaMatteClaro;
      texturaImagem = ficheiroTextura;
    },
    selectMetal: function () {
      ficheiroTextura = texturaMetal;
      texturaImagem = ficheiroTextura;
    }
  };

  folderAglomerado.add(selectsTextura, "selectAglomerado").name("Natural").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMadeiraCompressada + ')';
  folderAglomerado.add(selectsTextura, "selectAglomeradoVerniz").name("Envernizado").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMadeiraDetalhada + ')';

  folderMadeira.add(selectsTextura, "selectMadeira").name("Natural").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMadeiraClara + ')';
  folderMadeira.add(selectsTextura, "selectMadeiraEnvernizado").name("Envernizado").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMadeiraEscura + ')';

  folderMetal.add(selectsTextura, "selectMetal").name("Sem Acabamento").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMetal + ')';


  /*folderTexturas.add(selectsTextura, "selectAglomerado").name("Comprensada").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMadeiraCompressada + ')';
  folderTexturas.add(selectsTextura, "selectAglomeradoVerniz").name("Detalhada").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMadeiraDetalhada + ')';
  folderTexturas.add(selectsTextura, "selectClara").name("Clara").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMadeiraClara + ')';
  folderTexturas.add(selectsTextura, "selectEscura").name("Escura").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMadeiraEscura + ')';
  folderTexturas.add(selectsTextura, "selectMatteEscuro").name("Matte Escuro").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMatteEscuro + ')';
  folderTexturas.add(selectsTextura, "selectMatteClaro").name("Matte Claro").domElement.previousSibling.style.backgroundImage = 'url(' + texturaMatteClaro + ')';*/

  //folderTexturas.open();

}



function changeTexturaExterior(ficheiroTextura) {
  texturaImagem = ficheiroTextura;
  meshAtras.material.map = new THREE.TextureLoader().load(ficheiroTextura);
  meshEsquerda.material.map = new THREE.TextureLoader().load(ficheiroTextura);
  meshDireita.material.map = new THREE.TextureLoader().load(ficheiroTextura);
  meshBaixo.material.map = new THREE.TextureLoader().load(ficheiroTextura);
  meshCima.material.map = new THREE.TextureLoader().load(ficheiroTextura);
}

function changeTexturaInterior(ficheiroTextura) {
  for (var mesh in listaSelectedPartes) {
    listaSelectedPartes[mesh].material.map = new THREE.TextureLoader().load(ficheiroTextura);
  }

  for (var mesh in listMeshDivisao) {
    listMeshDivisao[mesh].material.map = new THREE.TextureLoader().load(ficheiroTextura);
  }
}



//Limpar Grids
function clearModulos() {
  for (var i = 0; i < listaSelectPartes.length; i++) {
    scene.remove(listaSelectPartes[i]);
  }
  listaSelectPartes = [];
}

function clearUltimoModulo() {
  var meshRetirar = listaSelectedPartes.pop();
  if(meshRetirar.name == -10){
    listaPortasMesh.pop();
  }
  domEvents.removeEventListener(meshRetirar,'click');
  domEvents.removeEventListener(meshRetirar,'contextmenu');
  if (meshRetirar.name != -5 && meshRetirar.name !=-10) {
    let index=listaOcupacaoPartes[meshRetirar.name].indexOf(meshRetirar);
    listaOcupacaoPartes[meshRetirar.name].splice(index,1);
  }
  scene.remove(meshRetirar);
}

//Limpar todos os modulos
function clearCompleteModulos() {

  for (var i = 0; i < listaSelectPartes.length; i++) {
    scene.remove(listaSelectPartes[i]);
  }

  for (i = 0; i < listaSelectedPartes.length; i++) {
    scene.remove(listaSelectedPartes[i]);
    domEvents.removeEventListener(listaSelectedPartes[i],'click');
    domEvents.removeEventListener(listaSelectedPartes[i],'contextmenu');
  }

  listaPortasMesh = [];
  listaSelectPartes = [];
  listaSelectedPartes = [];
  for(var i=0;i<listaOcupacaoPartes.length;i++){
    listaOcupacaoPartes[i]=[];
  }
}

dat.GUI.prototype.removeFolder = function (name) {
  var folder = this.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  this.__ul.removeChild(folder.domElement.parentNode);
  delete this.__folders[name];
  this.onResize();
}
