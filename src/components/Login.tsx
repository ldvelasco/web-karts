import React, { useState, useEffect, type FormEvent } from 'react';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // Tipamos el error como string o null
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const API_URL = 'http://localhost:8000';

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            console.log("Token detectado:", token);
        }
    }, []);

    // Añadimos el tipo FormEvent para el evento del formulario
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

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Usuario o contraseña incorrectos');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));

            alert("Login exitoso");
            // window.location.href = 'reserva.html'; 

        } catch (err: any) {
            let msg = err.message;
            if (msg === 'Failed to fetch') {
                msg = "No se puede conectar con el servidor.";
            }
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
                            width: '100%', 
                            padding: '10px', 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        {isLoading ? "Cargando..." : "INICIAR SESIÓN"}
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

export default Login;