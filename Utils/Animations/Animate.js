function animate() {
  TWEEN.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
