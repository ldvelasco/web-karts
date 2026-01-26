import React from 'react';

const Home = () => (
  <div style={{ padding: '20px' }}>
    <h1>Bienvenido al Sistema</h1>
    <p>Esta es una ruta protegida.</p>
    <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
        Cerrar Sesión
    </button>
  </div>
);

export default Home;