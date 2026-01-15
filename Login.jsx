import React, { useState, useEffect } from 'react';
// Si usas React Router, descomenta la siguiente línea:
// import { useNavigate } from 'react-router-dom';

const Login = () => {
    // 1. Estados para manejar los inputs y la interfaz
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Si usas React Router:
    // const navigate = useNavigate();

    // Configuración
    const API_URL = 'http://localhost:3000/api/auth/login';

    // Verificación automática al cargar (equivalente al window.onload)
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Si quieres redirección automática si ya está logueado:
            // window.location.href = '/reserva'; 
            // O con Router: navigate('/reserva');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpiar errores y activar estado de carga
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Usuario o contraseña incorrectos');
            }

            const data = await response.json();

            // ÉXITO: Guardar sesión
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));

            // REDIRIGIR
            // Opción A: Si usas React Router (Recomendado para SPA)
            // navigate('/reserva'); 
            
            // Opción B: Si es una página estática o distinta (Como en tu ejemplo original)
            window.location.href = 'reserva.html';

        } catch (err) {
            let msg = err.message;
            if (msg === 'Failed to fetch') {
                msg = "No se puede conectar con el servidor. Inténtalo más tarde.";
            }
            setError(msg);
        } finally {
            // Restaurar botón (loading false)
            setIsLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <h1>Acceso a Usuarios</h1>
            <hr />

            {/* Caja de Errores - Renderizado condicional */}
            {error && (
                <div style={{ color: 'red', marginBottom: '15px' }}>
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Credenciales</legend>
                    
                    <label htmlFor="email">Correo Electrónico:</label><br />
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        placeholder="ejemplo@correo.com" 
                        style={{ width: '250px' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br /><br />

                    <label htmlFor="password">Contraseña:</label><br />
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        style={{ width: '250px' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br /><br />

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ padding: '10px 20px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? "Cargando..." : "INICIAR SESIÓN"}
                    </button>
                </fieldset>
            </form>

            <p>
                <small>¿No tienes cuenta? <a href="#">Regístrate aquí</a></small>
            </p>
        </div>
    );
};

export default Login;