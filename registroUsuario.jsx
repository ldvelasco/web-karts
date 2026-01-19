import React, { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const API_REGISTER_URL = 'http://localhost:3000/api/auth/register';

    // --- NUEVO: FUNCIÓN DE VALIDACIÓN DE SEGURIDAD ---
    const validatePasswordSecurity = (password) => {
        // Regex: Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        
        if (!regex.test(password)) {
            return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
        }
        return null; // Null significa que no hay error, es válida
    };
    // -------------------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        // 1. Validación: Coincidencia de contraseñas
        if (formData.password !== formData.confirmPassword) {
            setMessage({ text: "Las contraseñas no coinciden.", type: 'error' });
            return;
        }

        // 2. NUEVO: Validación de Seguridad (Fuerte)
        const securityError = validatePasswordSecurity(formData.password);
        if (securityError) {
            setMessage({ text: securityError, type: 'error' });
            return; // Detenemos el proceso si la contraseña es débil
        }

        // 3. Preparar UI
        setIsLoading(true);

        try {
            const response = await fetch(API_REGISTER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar usuario');
            }

            // ÉXITO
            setMessage({ text: "¡Cuenta creada con éxito! Redirigiendo...", type: 'success' });
            
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 2000);

        } catch (error) {
            let errorText = error.message;
            if (errorText === 'Failed to fetch') errorText = "No hay conexión con el servidor.";
            
            setMessage({ text: "⚠️ " + errorText, type: 'error' });
            setIsLoading(false);
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
                        type="text" id="fullName" name="fullName" required 
                        placeholder="Tu nombre y apellido" style={{ width: '250px' }}
                        value={formData.fullName} onChange={handleChange}
                    />
                    <br /><br />

                    <label htmlFor="email">Correo Electrónico:</label><br />
                    <input 
                        type="email" id="email" name="email" required 
                        placeholder="usuario@email.com" style={{ width: '250px' }}
                        value={formData.email} onChange={handleChange}
                    />
                    <br /><br />

                    {/* Nota visual para el usuario sobre la seguridad */}
                    <label htmlFor="password">Contraseña:</label><br />
                    <span style={{ fontSize: '0.8em', color: '#666' }}>
                        (Mín. 8 caracteres, 1 mayúscula, 1 número)
                    </span><br />
                    <input 
                        type="password" id="password" name="password" required 
                        style={{ width: '250px' }}
                        value={formData.password} onChange={handleChange}
                    />
                    <br /><br />

                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label><br />
                    <input 
                        type="password" id="confirmPassword" name="confirmPassword" required 
                        style={{ width: '250px' }}
                        value={formData.confirmPassword} onChange={handleChange}
                    />
                    <br /><br />

                    <button 
                        type="submit" disabled={isLoading}
                        style={{ padding: '10px 20px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? "Creando cuenta..." : "REGISTRARSE"}
                    </button>
                </fieldset>
            </form>

            <p><small>¿Ya tienes cuenta? <a href="index.html">Inicia sesión aquí</a></small></p>
        </div>
    );
};

export default Register;