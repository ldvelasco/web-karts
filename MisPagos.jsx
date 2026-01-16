import React, { useState, useEffect } from 'react';

const MyPayments = () => {
    // --- ESTADOS ---
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configuración API (Ajusta la ruta según tu backend real)
    const API_URL = 'http://localhost:3000/api/v1/my-payments';

    // Recuperar el token (Indispensable para ver datos privados)
    const token = localStorage.getItem('authToken');

    // --- EFECTO: Cargar pagos al entrar ---
    useEffect(() => {
        const fetchPayments = async () => {
            // 1. Verificar si hay sesión
            if (!token) {
                setError("Debes iniciar sesión para ver tus pagos.");
                setLoading(false);
                return;
            }

            try {
                // 2. Petición al Backend
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Enviamos el token
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) throw new Error("Sesión expirada. Inicia sesión de nuevo.");
                    throw new Error("Error al obtener el historial de pagos.");
                }

                const data = await response.json();
                setPayments(data); // Asumimos que data es un array de objetos

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [token]);

    // --- RENDERIZADO ---

    // Vista de Carga
    if (loading) {
        return (
            <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
                <h1>Historial de Pagos</h1>
                <hr />
                <p>Cargando transacciones...</p>
            </div>
        );
    }

    // Vista de Error (ej. sin login)
    if (error) {
        return (
            <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
                <h1>Historial de Pagos</h1>
                <hr />
                <div style={{ color: 'red', fontWeight: 'bold' }}>
                    ⚠️ {error}
                </div>
                <br />
                <a href="index.html">Ir al Login</a>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <h1>Historial de Pagos</h1>
            <p>Aquí puedes consultar todas tus reservas y transacciones pasadas.</p>
            <hr />

            {/* TABLA DE DATOS */}
            {payments.length === 0 ? (
                <p>No tienes pagos registrados todavía.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
                            <th>Fecha</th>
                            <th>Concepto / Pista</th>
                            <th>Código Reserva</th>
                            <th>Monto</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p.id}>
                                {/* Formateamos la fecha para que se lea bien */}
                                <td>{new Date(p.date).toLocaleDateString()}</td>
                                <td>{p.concept || "Reserva Karts"}</td>
                                <td>{p.booking_code}</td>
                                <td>${p.amount}</td>
                                <td>
                                    {/* Lógica de color simple para el estado */}
                                    <span style={{ 
                                        color: p.status === 'completed' ? 'green' : 
                                               p.status === 'pending' ? 'orange' : 'red',
                                        fontWeight: 'bold'
                                    }}>
                                        {p.status === 'completed' ? 'PAGADO' : p.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <br />
            <button onClick={() => window.location.href = 'reserva.html'}>
                ← Volver a Reservar
            </button>
        </div>
    );
};

export default MyPayments;