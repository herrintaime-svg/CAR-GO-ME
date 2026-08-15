import React from 'react'
import Viewer3D from './components/Viewer3D'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>CAR-GO-ME — Prototype</h1>
      </header>
      <main>
        <section>
          <h2>Viewer</h2>
          <Viewer3D />
        </section>
        <section>
          <h2>Pages (stubs)</h2>
          <p>VehicleForm, ItemMaster, ManifestForm — placeholder components.</p>
        </section>
      </main>
    </div>
  )
}
