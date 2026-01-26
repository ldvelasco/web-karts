import React, { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const API_URL = 'http://localhost:8000/signup'; // Endpoint de registro

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = typeof data.detail === 'string' 
                    ? data.detail 
                    : "Datos invalidos (revisa el formato)";
                throw new Error(errorMsg);
            }
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            navigate('/login'); // Redirigimos al login para que entre oficialmente

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Crear Cuenta</h1>
            {error && <div style={{ color: 'red', marginBottom: '15px' }}>⚠️ {error}</div>}
            
            <form onSubmit={handleSubmit}>
                <fieldset style={{ borderRadius: '8px', border: '1px solid #ddd' }}>
                    <legend>Datos de Usuario</legend>
                    <label>Nombre Completo:</label><br />
                    <input 
                        type="text" 
                        required 
                        placeholder="Ej: Juan Pérez"
                        style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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
                            width: '100%', padding: '10px', backgroundColor: '#28a745', 
                            color: 'white', border: 'none', borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        {isLoading ? "Registrando..." : "REGISTRARSE"}
                    </button>
                </fieldset>
            </form>
            <p style={{ marginTop: '15px' }}>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    );
};

export default Register;