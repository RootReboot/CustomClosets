function criarDivisoes() {

  var texture = new THREE.TextureLoader().load(texturaImagem);
  var geometryDivisao = new THREE.BoxGeometry(largura, altura, espessura);
  var materialDivisao = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });

  meshDivisao = new THREE.Mesh(geometryDivisao, materialDivisao);
  meshDivisao.position.x = comprimento / 2 - espessura / 2 - posicaoXDivisao;
  meshDivisao.position.y = altura / 2 + espessura;
  meshDivisao.position.z = -largura / 2 + espessura / 2;
  meshDivisao.rotation.y = THREE.Math.degToRad(90);
  scene.add(meshDivisao);
  listMeshDivisao.push(meshDivisao);
}

function criarDivisoesHorizontais() {

    var texture = new THREE.TextureLoader().load(texturaImagem);
    var geometryDivisaoHorizontal = new THREE.BoxGeometry(comprimento - espessura * 2, largura, espessura);
    var materialDivisaoHorizontal = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide,
        alphaTest: 0.5
    });

    meshDivisaoHorizontal = new THREE.Mesh(geometryDivisaoHorizontal, materialDivisaoHorizontal);
    meshDivisaoHorizontal.position.y = espessura + posicaoYDivisaoHorizontal;
    meshDivisaoHorizontal.position.z = - largura / 2 + espessura / 2;
    meshDivisaoHorizontal.rotation.x = THREE.Math.degToRad(90);
    scene.add(meshDivisaoHorizontal);
    listMeshDivisaoHorizontal.push(meshDivisaoHorizontal);
}