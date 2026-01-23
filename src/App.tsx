// App.tsx

// 1. Borramos { useState } de aquí porque no se usa
// import { useState } from 'react'  <-- ESTO SOBRABA
import './App.css'

// OJO: Si MisPagos.jsx está en la misma carpeta, quítale los dos puntos ".."
// Si de verdad está fuera (en la carpeta anterior), déjalo así.
import MisPagos from '../MisPagos';

function App() {
  return (
    <>
      <div style={{ width: '100%' }}>
        {/* 👇 Aquí mostramos tu componente en la pantalla */}
        <MisPagos />
      </div>
    </>
  )
}

export default App