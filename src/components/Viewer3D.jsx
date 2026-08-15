import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Viewer3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const width = mountRef.current?.clientWidth || 600
    const height = 400
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)

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

    const handleResize = () => {
      const w = mountRef.current.clientWidth || width
      renderer.setSize(w, height)
      camera.aspect = w / height
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(req)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', maxWidth: 800 }} />
}
