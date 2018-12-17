function init(){
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.set(0, 150, -1500);

    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0xa0a0a0, 1000, 2000 );

    createRenderer();
    domEvents = new THREEx.DomEvents(camera,renderer.domElement);

    var ambientLight= new THREE.AmbientLight(0xffffff,0.7);
    scene.add(ambientLight);

    //criaLuzHemisferica();
    criaLuzDirecional();
    //criaLuzCamera();

    criaChao();
    callArmarioInicial();
    criaGui();
    //var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    //grid.material.opacity = 0.2;
    //grid.material.transparent = true;
    //scene.add( grid );

    //

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 150, 0) ;
    controls.update();
    //var dragControls = new THREE.DragControls( elementos, camera, renderer.domElement );
  //  dragControls.addEventListener( 'dragstart', function () {

    //  controls.enabled = false;

    //} );
    //dragControls.addEventListener( 'dragend', function () {

      //controls.enabled = true;

    //} );


    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener("mousemove", onDocumentMouseMove, false );
    window.addEventListener("click",onDocumentMouseClick,false);

  }

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

function onDocumentMouseClick(event){

  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects(listaSelectPartes);


  if ( intersects.length > 0 ) {
    var texture = new THREE.TextureLoader().load(texturaImagem);
    var material = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide,
        alphaTest: 0.5
    });
    intersects[0].object.material=material;
    intersects[0].object.children.forEach(function(pChild){
      pChild.material=material;
    })

    var index=listaSelectPartes.indexOf(intersects[0].object);
    listaSelectPartes.splice(index,1);
    listaSelectedPartes.push(intersects[0].object);

  addEventListenerToParte(intersects[0].object);
    //-5 e apenas um modulo nao sendo necessario uma matrix,-10 e uma porta
    if(intersects[0].object.name!=-5 && intersects[0].object.name!=-10){
          listaOcupacaoPartes[intersects[0].object.name].push(intersects[0].object);
    }
    if(intersects[0].object.name==-10){
        listaPortasMesh.push(intersects[0].object);
    }
  }
}
//button = leftClick,rightCLick,etc
function addEventListenerToParte(part) {
  domEvents.addEventListener(part,'click', function() {
    var clickedObject=part;

    if(!clickedObject.material.map.image.currentSrc.includes(texturaImagem)){
      clickedObject.material.map = new THREE.TextureLoader().load(texturaImagem);
    }else{
      if(clickedObject.name==-10){
        var degToRad = Math.PI / 180;
        var targetAngle = clickedObject.rotation.y === -100 * degToRad
        ? 0
        : -100 * degToRad;

        new TWEEN.Tween(clickedObject.rotation)
        .easing(TWEEN.Easing.Circular.Out)
        .to(
          {
          y: targetAngle
          },
          500
        )
        .start();
        }
    }
  });

  domEvents.addEventListener(part,'contextmenu',function() {
    let index=listaSelectedPartes.indexOf(part);
    listaSelectedPartes.splice(index,1);
    if(part.name == -10) {
      let indexPortas = listaPortasMesh.indexOf(part);
      listaPortasMesh.splice(indexPortas,1);
    }
    if (part.name != -5 && part.name !=-10) {
      let indexOcupacaoPartes = listaOcupacaoPartes[part.name].indexOf(part);
      listaOcupacaoPartes[part.name].splice(indexOcupacaoPartes,1);
    }
    domEvents.removeEventListener(part,'click');
    scene.remove(part);
    domEvents.removeEventListener(part,'contextmenu');//apagase a si proprio
  });
}

  var INTERSECTED;

  function onDocumentMouseMove( event ){
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects(listaSelectPartes);
    if ( intersects.length > 0 ) {

      if ( INTERSECTED != intersects[ 0 ].object ) {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex( 0xff0000 );
      }
    } else {
      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      INTERSECTED = null;
    }

  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
