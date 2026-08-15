const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
camera.position.z = 3

let req = null
const animate = () => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
  req = requestAnimationFrame(animate)
}
animate()

return () => {
  cancelAnimationFrame(req)
  renderer.dispose()
  if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
    mountRef.current.removeChild(renderer.domElement)
  }
}
