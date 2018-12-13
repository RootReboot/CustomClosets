function callArmarioInicial() {

  var texture = new THREE.TextureLoader().load(texturaImagem);
  // export mesh

  var geometryAtras = new THREE.BoxGeometry(comprimento, altura, espessura);
  var materialAtras = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });

  meshAtras = new THREE.Mesh(geometryAtras, materialAtras);
  meshAtras.castShadow = true;
  //  mesh.receiveShadow=true;
  meshAtras.position.y = altura / 2 + espessura;
  //meshAtras.position.z = espessura/2;

  scene.add(meshAtras);

  var geometryBaixo = new THREE.BoxGeometry(comprimento, largura, espessura);
  var materialBaixo = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });

  meshBaixo = new THREE.Mesh(geometryBaixo, materialBaixo);
  meshBaixo.castShadow = true;
  //  mesh1.receiveShadow=true;
  meshBaixo.position.y = espessura;
  meshBaixo.position.z = -largura / 2 + espessura / 2;
  meshBaixo.rotation.x = THREE.Math.degToRad(90);
  scene.add(meshBaixo);

  var geometryCima = new THREE.BoxGeometry(comprimento, largura, espessura);
  //var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
  var materialCima = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });

  meshCima = new THREE.Mesh(geometryCima, materialCima);
  meshCima.castShadow = true;
  //mesh2.receiveShadow=true;
  meshCima.position.y = altura + espessura;
  meshCima.position.z = -largura / 2 + espessura / 2;
  meshCima.rotation.x = THREE.Math.degToRad(90);
  scene.add(meshCima);

  var geometryEsquerdaDireita = new THREE.BoxGeometry(largura, altura, espessura);
  //var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
  var materialEsquerdaDireita = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });

  meshEsquerda = new THREE.Mesh(geometryEsquerdaDireita, materialEsquerdaDireita);
  meshEsquerda.castShadow = true;
  //meshespessura.receiveShadow=true;
  meshEsquerda.position.x = comprimento / 2 - espessura / 2;
  meshEsquerda.position.y = altura / 2 + espessura;
  meshEsquerda.position.z = -largura / 2 + espessura / 2;
  meshEsquerda.rotation.y = THREE.Math.degToRad(90);
  scene.add(meshEsquerda);

  meshDireita = new THREE.Mesh(geometryEsquerdaDireita, materialEsquerdaDireita);
  meshDireita.castShadow = true;
  //mesh4.receiveShadow=true;
  meshDireita.position.x = -comprimento / 2 + espessura / 2;
  meshDireita.position.y = altura / 2 + espessura;
  meshDireita.position.z = -largura / 2 + espessura / 2;
  meshDireita.rotation.y = THREE.Math.degToRad(90);
  scene.add(meshDireita);

  domEvents.addEventListener(meshDireita,'click', event =>{
    changeTextura(meshDireita);
  });

  domEvents.addEventListener(meshEsquerda,'click', event =>{
    changeTextura(meshEsquerda);
  });

  domEvents.addEventListener(meshBaixo,'click', event =>{
    changeTextura(meshBaixo);
  });

  domEvents.addEventListener(meshCima,'click', event =>{
    changeTextura(meshCima);
  });

  domEvents.addEventListener(meshAtras,'click', event =>{
    changeTextura(meshAtras);
  });

  function changeTextura(mesh){
    if(!mesh.material.map.image.currentSrc.includes(texturaImagem)){
      meshDireita.material.map = new THREE.TextureLoader().load(texturaImagem);
      meshEsquerda.material.map = new THREE.TextureLoader().load(texturaImagem);
      meshBaixo.material.map = new THREE.TextureLoader().load(texturaImagem);
      meshCima.material.map = new THREE.TextureLoader().load(texturaImagem);
      meshAtras.material.map = new THREE.TextureLoader().load(texturaImagem);
      listMeshDivisao.forEach(function(element){
            element.material.map= new THREE.TextureLoader().load(texturaImagem);
      });

      }
  }

}

  //
