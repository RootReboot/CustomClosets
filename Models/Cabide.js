function callConstrutorCabide(materialCabide, alturaStart, comprimentoStart, numeroDivisao) {
  var geometriaCabide = new THREE.CylinderGeometry(espessura, espessura, (comprimentoModulo - espessura * 2));
  meshCabide = new THREE.Mesh(geometriaCabide, materialCabide);
  meshCabide.position.y = alturaStart;
  meshCabide.position.z = -larguraModulo / 2;
  meshCabide.position.x = -comprimentoStart;
  meshCabide.rotation.x = THREE.Math.degToRad(90);
  meshCabide.rotation.z = THREE.Math.degToRad(90);
  meshCabide.name = numeroDivisao;
  scene.add(meshCabide);
}

function callGridCabide(alturaStart, comprimentoStart, numeroDivisao) {
  mat = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true });
  callConstrutorCabide(mat, alturaStart, comprimentoStart, numeroDivisao);
  listaSelectPartes.push(meshCabide);
}
