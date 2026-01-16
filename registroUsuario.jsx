import React, { useState } from 'react';
// Si usas React Router, descomenta:
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

const Register = () => {
    // 1. Estado único para el formulario (más limpio que variables separadas)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Estados de UI
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' | 'success'
    const [isLoading, setIsLoading] = useState(false);

    // Si usas React Router:
    // const navigate = useNavigate();

    const API_REGISTER_URL = 'http://localhost:3000/api/auth/register';

    // Manejador genérico para todos los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 2. Validación Frontend: Contraseñas
        if (formData.password !== formData.confirmPassword) {
            setMessage({ text: "Las contraseñas no coinciden.", type: 'error' });
            return;
        }

        // 3. Preparar UI
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const response = await fetch(API_REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.fullName, // Mapeamos 'fullName' a 'name' como espera tu API
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar usuario');
            }

            // 4. ÉXITO
            setMessage({ text: "¡Cuenta creada con éxito! Redirigiendo al login...", type: 'success' });

            // Esperar 2 segundos y redirigir
            setTimeout(() => {
                // Opción A: React Router
                // navigate('/login'); // o navigate('/');

                // Opción B: Recarga clásica (para coincidir con tu HTML original)
                window.location.href = 'index.html'; 
            }, 2000);

        } catch (error) {
            let errorText = error.message;
            if (errorText === 'Failed to fetch') {
                errorText = "No hay conexión con el servidor.";
            }
            setMessage({ text: "⚠️ " + errorText, type: 'error' });
            setIsLoading(false); // Solo restauramos el botón si falló
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <h1>📝 Crear Nueva Cuenta (KARTS-SEG-002)</h1>
            <hr />

            {/* Caja de Mensajes */}
            {message.text && (
                <div style={{ 
                    marginBottom: '15px', 
                    fontWeight: 'bold', 
                    color: message.type === 'success' ? 'green' : 'red' 
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos Personales</legend>
                    
                    <label htmlFor="fullName">Nombre Completo:</label><br />
                    <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        required 
                        placeholder="Tu nombre y apellido" 
                        style={{ width: '250px' }}
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <br /><br />

                    <label htmlFor="email">Correo Electrónico:</label><br />
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        placeholder="usuario@email.com" 
                        style={{ width: '250px' }}
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <br /><br />

                    <label htmlFor="password">Contraseña:</label><br />
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        placeholder="Mínimo 6 caracteres" 
                        minLength="6" 
                        style={{ width: '250px' }}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <br /><br />

                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label><br />
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        required 
                        placeholder="Repite la contraseña" 
                        style={{ width: '250px' }}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <br /><br />

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ padding: '10px 20px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? "Creando cuenta..." : "REGISTRARSE"}
                    </button>
                </fieldset>
            </form>

            <p>
                <small>¿Ya tienes cuenta? <a href="index.html">Inicia sesión aquí</a></small>
                {/* Si usas Router: <Link to="/login">Inicia sesión aquí</Link> */}
            </p>
        </div>
    );
};

export default Register;