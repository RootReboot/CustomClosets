function callConstrutorGaveta(material, alturaStart, comprimentoStart, numeroDivisao) {
  var compr = comprimentoModulo - espessura * 2;
  var larg = larguraModulo - espessura * 3 - raioPuxador * 2;//3 por causa da porta 
  var alt = alturaGaveta;
  var medium_rectangle_geo = new THREE.BoxGeometry(compr, alt, espessura);
  var big_rectangle_geo = new THREE.BoxGeometry(compr, larg, espessura);
  var small_rectangle_geo = new THREE.BoxGeometry(larg, alt, espessura);
  var meshModuloPuxadorGaveta_geo = new THREE.SphereGeometry(raioPuxador, raioPuxador, espessura);

  meshGavetaAtras = new THREE.Mesh(medium_rectangle_geo, material);
  meshGavetaAtras.castShadow = true;
  meshGavetaAtras.position.z = larg;


  meshGavetaFrente = new THREE.Mesh(medium_rectangle_geo, material);
  meshGavetaFrente.castShadow = true;
  meshGavetaFrente.position.y = alturaStart;
  meshGavetaFrente.position.z = -larg - espessura;
  meshGavetaFrente.position.x = -comprimentoStart;

  meshPuxadorGaveta = new THREE.Mesh(meshModuloPuxadorGaveta_geo, material);
  meshPuxadorGaveta.castShadow = true;
  //meshModuloPuxadorGaveta.position.y = larguraModulo/2 + scaleArmario;
  meshPuxadorGaveta.position.z = -raioPuxador;

  meshGavetaBaixo = new THREE.Mesh(big_rectangle_geo, material);
  meshGavetaBaixo.castShadow = true;
  meshGavetaBaixo.position.y = -alt / 2 + espessura / 2;
  meshGavetaBaixo.position.z = larg / 2;
  meshGavetaBaixo.rotation.x = THREE.Math.degToRad(90);

  meshGavetaEsquerda = new THREE.Mesh(small_rectangle_geo, material);
  meshGavetaEsquerda.castShadow = true;
  meshGavetaEsquerda.position.x = compr / 2 - espessura / 2;
  meshGavetaEsquerda.position.z = larg / 2;
  meshGavetaEsquerda.rotation.y = THREE.Math.degToRad(90);

  meshGavetaDireita = new THREE.Mesh(small_rectangle_geo, material);
  meshGavetaDireita.castShadow = true;
  meshGavetaDireita.position.x = -compr / 2 + espessura / 2;
  meshGavetaDireita.position.z = larg / 2;
  meshGavetaDireita.rotation.y = THREE.Math.degToRad(90);

  meshGavetaFrente.add(meshPuxadorGaveta);
  meshGavetaFrente.add(meshGavetaBaixo);
  meshGavetaFrente.add(meshGavetaAtras);
  meshGavetaFrente.add(meshGavetaEsquerda);
  meshGavetaFrente.add(meshGavetaDireita);
  meshGavetaFrente.name = numeroDivisao;

  scene.add(meshGavetaFrente);
}

function callGridGaveta(altura, comprimentoStart, numeroDivisao) {
  mat = new THREE.MeshLambertMaterial({ color: 0xf0f0f0, opacity: 0.5, transparent: true, wireframe: true });
  callConstrutorGaveta(mat, altura, comprimentoStart, numeroDivisao);
  listaSelectPartes.push(meshGavetaFrente);
}
