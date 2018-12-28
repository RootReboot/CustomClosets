function callConstrutorPorta(material, comprimentoStart,posicaoPuxador) {
  var medium_rectangle_geo = new THREE.BoxGeometry(comprimentoModulo , altura - espessura, espessura);
  var meshModuloPuxadorPorta_geo = new THREE.SphereGeometry(raioPuxador, raioPuxador, espessura);

  meshPorta = new THREE.Mesh(medium_rectangle_geo, material);
  meshPorta.castShadow = true;
  meshPorta.position.y = altura / 2 + espessura;
  meshPorta.position.z = -largura + espessura;
  //meshPorta.rotation.y = THREE.Math.degToRad(15);

  meshPuxadorPorta = new THREE.Mesh(meshModuloPuxadorPorta_geo, material);
  meshPorta.name = -10;
  meshPorta.add(meshPuxadorPorta);
  if(posicaoPuxador==1){
    meshPorta.position.x = -comprimentoStart;
    medium_rectangle_geo.applyMatrix(
    new THREE.Matrix4().makeTranslation(-comprimentoModulo/2, 0, 0)
  );
    meshPuxadorPorta.position.x = -comprimentoModulo / 2-comprimentoModulo/3;
    meshPuxadorPorta.position.z = -raioPuxador;
  }
  if(posicaoPuxador==0){//Puxador na esquerda
    meshPorta.position.x = -comprimento/2;
    meshPorta.rotation.x=THREE.Math.degToRad(180);
    medium_rectangle_geo.applyMatrix(
    new THREE.Matrix4().makeTranslation(comprimentoModulo/2, 0, 0)
  );
    meshPuxadorPorta.position.x = comprimentoModulo/2+comprimentoModulo / 3;
    meshPuxadorPorta.position.z=raioPuxador;
  }

    scene.add(meshPorta);
}

function callGridPorta(comprimentoStart,posicaoPuxador) {

  mat = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true });
  callConstrutorPorta(mat, comprimentoStart,posicaoPuxador);
  listaSelectPartes.push(meshPorta);
}

function callCompleteGridPorta() {

  // 2 portas no caso de não ter módulos
  if (numDivisoes == 0) {

    var nPortas = 2;

    var comprimentoDiv = (comprimentoDivisao) / nPortas;

  } else {

    var nPortasDivisao = Math.floor(comprimentoDivisao / comprimentoPorta);

    var nPortas = nPortasDivisao * (numDivisoes + 1);

    var comprimentoDiv = comprimentoPorta + (comprimentoDivisao % comprimentoPorta) / nPortasDivisao;

  }
  var comprimentoStart = -comprimento / 2;// + comprimentoDiv / 2;//+espessura
  comprimentoModulo = comprimentoDiv;

  var validatePortas=true;
  for (var i = 0; i < nPortas; i++) {
    for(var q=0;q<listaPortasMesh.length;q++){
      if(i==1 && numDivisoes == 0){
        if(listaPortasMesh[q].position.x==-comprimento/2){
            validatePortas=false;
            break;
        }
      }else{
        if(listaPortasMesh[q].position.x==-comprimentoStart){
            validatePortas=false;
            break;
        }
      }
    }
    if(validatePortas){
      if(numDivisoes==0){
        if(i==1){
          callGridPorta(comprimentoStart,0);
          break;
        }
      }
      callGridPorta(comprimentoStart,1);
    }
    validatePortas=true;
    comprimentoStart += comprimentoDiv;
  }

}
