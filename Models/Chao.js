// ground

function criaChao() {
  var textureGround = new THREE.TextureLoader().load(texturaGranito);
  var materialGround = new THREE.MeshLambertMaterial({
    map: textureGround,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  });
  meshChao = new THREE.Mesh(new THREE.PlaneBufferGeometry(1500, 1000), materialGround);
  meshChao.position.y = 0;
  meshChao.rotation.x = - Math.PI / 2;
  meshChao.receiveShadow = true;
  scene.add(meshChao);
}
