function criaLuzHemisferica() {
  hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);
  hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 30);
  scene.add(hemiLightHelper);
}
