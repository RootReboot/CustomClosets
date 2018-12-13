function criaLuzCamera() {
  var light = new THREE.PointLight(0xffffff, 1);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024; // default
  light.shadow.mapSize.height = 1024; // default
  light.shadow.bias = -0.0001; // default
  light.shadow.camera.far = 3500 // default
  light.position.copy(camera.position);
  scene.add(camera);
  camera.add(light);
}
