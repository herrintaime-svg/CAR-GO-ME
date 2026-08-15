import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Viewer3D({ placement }) {
  const mountRef = useRef();

  useEffect(() => {
    const el = mountRef.current;
    if(!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071826);

    const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 100);
    camera.position.set(4,3,6);

    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0.8,0);
    controls.update();

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5,10,7);
    scene.add(dir);

    const grid = new THREE.GridHelper(10, 20, 0x111827, 0x0b1220);
    scene.add(grid);

    // vehicle box (if placement present)
    if (placement && placement.vehicle) {
      const v = placement.vehicle;
      const geom = new THREE.BoxGeometry(v.length, v.height, v.width);
      const mat = new THREE.MeshStandardMaterial({ color:0x06b6d4, transparent:true, opacity:0.18, side:THREE.BackSide });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.y = v.height/2;
      scene.add(mesh);
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.BoxGeometry(v.length, v.height, v.width)), new THREE.LineBasicMaterial({ color:0xffffff }));
      wire.position.copy(mesh.position);
      scene.add(wire);
    }

    // items placements (if any)
    if (placement && placement.placements) {
      placement.placements.forEach((p, idx) => {
        const geom = new THREE.BoxGeometry(p.w, p.h, p.d);
        const mat = new THREE.MeshStandardMaterial({ color: p.color || (0x111111 + ((idx*1234567)%0xffffff)), opacity:1, transparent:false });
        const m = new THREE.Mesh(geom, mat);
        m.position.set(p.x + p.w/2 - (placement.vehicle ? placement.vehicle.length/2 : 0), p.y + p.h/2, p.z + p.d/2 - (placement.vehicle ? placement.vehicle.width/2 : 0));
        scene.add(m);
        const outline = new THREE.LineSegments(new THREE.WireframeGeometry(geom), new THREE.LineBasicMaterial({ color:0x000000 }));
        outline.position.copy(m.position);
        scene.add(outline);
      });
    }

    function onResize() {
      const w = el.clientWidth; const h = el.clientHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w,h);
    }
    window.addEventListener("resize", onResize);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [placement]);

  if(!placement) return <div style={{padding:20}}>Tidak ada hasil optimasi. Buat manifest lalu tekan "Optimasi Susunan".</div>;

  const metrics = placement.metrics || {};
  return (
    <div style={{display:"flex", height:"100%"}}>
      <div className="canvasWrap" ref={mountRef} style={{flex:1}} />
      <div className="sidebar-right">
        <h4>Metrics</h4>
        <div className="small">Volume Kendaraan: {metrics.vehicleVolume?.toFixed(3)} m³</div>
        <div className="small">Volume Terpakai: {metrics.usedVolume?.toFixed(3)} m³</div>
        <div className="small">Utilisasi: {metrics.utilization ? (metrics.utilization*100).toFixed(1) : 0} %</div>
        <h4 style={{marginTop:12}}>Daftar Item</h4>
        <div className="list">
          {placement.placements.map((p, i)=>(
            <div key={i} className="item">
              <div style={{fontWeight:600}}>Item #{i+1}</div>
              <div className="small">Size: {p.w}×{p.h}×{p.d} m</div>
              <div className="small">Pos: x={p.x.toFixed(2)}, y={p.y.toFixed(2)}, z={p.z.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
