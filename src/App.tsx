import Login from './components/Login';
import Register from './components/Register';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRouter from './components/ProtectedRouter';
import Home from './components/Home';
import { Navigate } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Grupo de Rutas Protegidas */}
          <Route element={<ProtectedRouter />}>
            <Route path="/home" element={ <Home />} />
            {/* Agrega aquí más rutas como /perfil, /reservas, etc. */}
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>
      </div>  
    </BrowserRouter>
  )
}

export default App