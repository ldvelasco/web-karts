import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const API_URL = 'http://localhost:8000/login';

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/home'); // Si ya está logueado, mandarlo a Home
        }
    }, [navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Usuario o contraseña incorrectos');
            }

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));

            navigate('/home'); // Redirección interna sin recargar

        } catch (err: any) {
            let msg = err.message;
            if (msg === 'Failed to fetch') msg = "No se puede conectar con el servidor.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Acceso a Usuarios</h1>
            {error && <div style={{ color: 'red', marginBottom: '15px' }}>⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
                <fieldset style={{ borderRadius: '8px', border: '1px solid #ddd' }}>
                    <legend>Credenciales</legend>
                    <label>Correo Electrónico:</label><br />
                    <input 
                        type="email" 
                        required 
                        style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Contraseña:</label><br />
                    <input 
                        type="password" 
                        required 
                        style={{ width: '100%', marginBottom: '20px', padding: '8px', boxSizing: 'border-box' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            width: '100%', padding: '10px', backgroundColor: '#007bff', 
                            color: 'white', border: 'none', borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        {isLoading ? "Cargando..." : "INICIAR SESIÓN"}
                    </button>
                </fieldset>
            </form>
            <p style={{ marginTop: '15px' }}>
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
        </div>
    );
};

export default Login;