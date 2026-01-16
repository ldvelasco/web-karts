import React, { useState, useEffect } from 'react';

const Booking = () => {
    // --- ESTADOS ---
    const [tracks, setTracks] = useState([]);           // Lista de circuitos
    const [slots, setSlots] = useState([]);             // Horarios disponibles
    
    // Selección del usuario
    const [selectedTrack, setSelectedTrack] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');

    // Estados de interfaz
    const [loadingTracks, setLoadingTracks] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' | 'success'

    // Configuración API
    const API_BASE_URL = 'http://localhost:3000/api/v1';

    // Recuperar token (si el backend requiere autenticación)
    const token = localStorage.getItem('authToken');

    // --- EFECTO 1: Cargar Pistas al montar el componente ---
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/tracks`);
                if (!response.ok) throw new Error('Error al cargar pistas');
                const data = await response.json();
                setTracks(data);
            } catch (error) {
                setMessage({ text: 'No se pudieron cargar los circuitos.', type: 'error' });
            } finally {
                setLoadingTracks(false);
            }
        };

        fetchTracks();
    }, []);

    // --- EFECTO 2: Buscar disponibilidad cuando cambia Pista o Fecha ---
    useEffect(() => {
        // Solo buscamos si ambos campos tienen valor
        if (!selectedTrack || !selectedDate) {
            setSlots([]); // Limpiar horarios si falta selección
            return;
        }

        const fetchAvailability = async () => {
            setLoadingSlots(true);
            setSlots([]); // Limpiar anteriores
            setSelectedSlot(''); // Resetear selección de hora
            setMessage({ text: '', type: '' });

            try {
                const url = `${API_BASE_URL}/availability?track_id=${selectedTrack}&date=${selectedDate}`;
                const response = await fetch(url);
                
                if (!response.ok) throw new Error('Error al obtener horarios');
                
                const data = await response.json();
                setSlots(data);
            } catch (error) {
                setMessage({ text: 'Error al comprobar disponibilidad.', type: 'error' });
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailability();
    }, [selectedTrack, selectedDate]);

    // --- MANEJADOR: Enviar Formulario ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSlot) {
            alert("Por favor selecciona un horario.");
            return;
        }

        setSubmitting(true);
        setMessage({ text: '', type: '' });

        const payload = {
            track_id: selectedTrack,
            date: selectedDate,
            slot_id: selectedSlot
        };

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Incluimos el token por si el backend lo necesita (basado en el login anterior)
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error al reservar');

            // Éxito
            setMessage({ 
                text: `¡CONFIRMADO! Tu código es: ${data.booking_code}`, 
                type: 'success' 
            });
            
            // Opcional: Resetear formulario tras éxito
            // setSelectedTrack('');
            // setSelectedDate('');
            // setSlots([]);

        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Sistema de Reserva de Carreras (KARTS-RF-003)</h1>
            <hr />

            {/* Mensajes de Estado */}
            {message.text && (
                <div style={{ color: message.type === 'error' ? 'red' : 'green', fontWeight: 'bold', margin: '10px 0' }}>
                    {message.type === 'error' ? '⚠️ ' : '✅ '}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                
                {/* 1. SELECCIÓN DE PISTA */}
                <fieldset>
                    <legend>1. Selección de Pista</legend>
                    <label htmlFor="track-select">Elige el circuito:</label><br />
                    
                    <select 
                        id="track-select" 
                        value={selectedTrack} 
                        onChange={(e) => setSelectedTrack(e.target.value)}
                        required
                        disabled={loadingTracks}
                    >
                        <option value="">-- Seleccionar --</option>
                        {tracks.map(track => (
                            <option key={track.id} value={track.id}>
                                {track.name} (Precio: ${track.price})
                            </option>
                        ))}
                    </select>
                    {loadingTracks && <span> Cargando pistas...</span>}
                </fieldset>
                <br />

                {/* 2. SELECCIÓN DE FECHA */}
                <fieldset>
                    <legend>2. Selección de Fecha</legend>
                    <label htmlFor="date-select">Fecha deseada:</label><br />
                    <input 
                        type="date" 
                        id="date-select" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required 
                        disabled={!selectedTrack} // Desactivado hasta elegir pista
                    />
                </fieldset>
                <br />

                {/* 3. HORARIOS (Radio Buttons) */}
                <fieldset>
                    <legend>3. Horarios Disponibles</legend>
                    
                    {/* Mensajes de carga o instrucciones */}
                    {!selectedTrack || !selectedDate ? (
                        <p>Selecciona una pista y una fecha para ver horarios.</p>
                    ) : loadingSlots ? (
                        <p>Consultando servidor...</p>
                    ) : slots.length === 0 ? (
                        <p>No hay huecos libres para esta fecha.</p>
                    ) : (
                        <ul>
                            {slots.map(slot => (
                                <li key={slot.id}>
                                    {slot.is_reserved ? (
                                        // Slot ocupado
                                        <span style={{ color: 'gray' }}>
                                            <del>{slot.time}</del> (Ocupado)
                                        </span>
                                    ) : (
                                        // Slot libre (Radio Button)
                                        <label>
                                            <input 
                                                type="radio" 
                                                name="slot_selection"
                                                value={slot.id}
                                                checked={selectedSlot === String(slot.id)}
                                                onChange={(e) => setSelectedSlot(e.target.value)}
                                            />
                                            {` ${slot.time}`}
                                        </label>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </fieldset>
                <br />

                {/* BOTÓN FINAL */}
                <button 
                    type="submit" 
                    disabled={!selectedSlot || submitting}
                >
                    {submitting ? "PROCESANDO..." : "CONFIRMAR Y PAGAR"}
                </button>
            </form>
        </div>
    );
};

export default Booking;