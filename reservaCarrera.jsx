import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const KartsBookingSystem = () => {
  // Estados de datos
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  
  // Estados de control
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [debugLog, setDebugLog] = useState('Esperando acciones...');

  // Helper para el log de depuración
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setDebugLog(prev => prev + `\n[${time}] ${msg}`);
  };

  // 1. Inicialización: Cargar pistas
  useEffect(() => {
    const fetchTracks = async () => {
      addLog("Iniciando aplicación...");
      try {
        const response = await fetch(`${API_BASE_URL}/tracks`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setTracks(data);
        addLog("Pistas cargadas correctamente.");
      } catch (err) {
        setStatusMsg("⚠️ No se pudo conectar al Backend.");
      } finally {
        setLoadingTracks(false);
      }
    };
    fetchTracks();
  }, []);

  // 2. Consultar disponibilidad (Efecto reactivo)
  useEffect(() => {
    if (!selectedTrack || !selectedDate) {
      setSlots([]);
      return;
    }

    const checkAvailability = async () => {
      setLoadingSlots(true);
      setSelectedSlotId(null);
      addLog(`Buscando horarios para Pista ${selectedTrack} en fecha ${selectedDate}...`);

      try {
        const response = await fetch(
          `${API_BASE_URL}/availability?track_id=${selectedTrack}&date=${selectedDate}`
        );
        if (!response.ok) throw new Error('Fallo al obtener horarios');
        const data = await response.json();
        setSlots(data);
      } catch (err) {
        setStatusMsg("⚠️ Error al cargar disponibilidad.");
      } finally {
        setLoadingSlots(false);
      }
    };

    checkAvailability();
  }, [selectedTrack, selectedDate]);

  // 3. Procesar Reserva
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlotId) return;

    setSubmitting(true);
    addLog("Enviando POST a /bookings...");

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track_id: selectedTrack,
          date: selectedDate,
          slot_id: selectedSlotId
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al reservar');

      addLog("Reserva Exitosa: " + data.booking_code);
      alert(`¡CONFIRMADO!\nTu código es: ${data.booking_code}`);
      window.location.reload();

    } catch (err) {
      setStatusMsg("⚠️ " + err.message);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Sistema de Reserva de Carreras (KARTS-RF-003)</h1>
      <hr />

      <div id="status-message">{statusMsg}</div>

      <form onSubmit={handleSubmit}>
        
        <fieldset>
          <legend>1. Selección de Pista</legend>
          <label htmlFor="track-select">Elige el circuito:</label><br />
          <select 
            id="track-select"
            value={selectedTrack} 
            onChange={(e) => setSelectedTrack(e.target.value)}
            required
          >
            <option value="">{loadingTracks ? 'Cargando datos...' : '-- Seleccionar --'}</option>
            {tracks.map(track => (
              <option key={track.id} value={track.id}>
                {track.name} (Precio: ${track.price})
              </option>
            ))}
          </select>
        </fieldset>

        <br />

        <fieldset>
          <legend>2. Selección de Fecha</legend>
          <label htmlFor="date-select">Fecha deseada:</label><br />
          <input 
            id="date-select"
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={!selectedTrack}
            required 
          />
        </fieldset>

        <br />

        <fieldset>
          <legend>3. Horarios Disponibles</legend>
          {loadingSlots ? (
            <p>Consultando servidor...</p>
          ) : slots.length === 0 ? (
            <p>Selecciona una pista y una fecha para ver horarios.</p>
          ) : (
            <ul>
              {slots.map(slot => (
                <li key={slot.id}>
                  {slot.is_reserved ? (
                    <span><del>{slot.time}</del> (Ocupado)</span>
                  ) : (
                    <label>
                      <input 
                        type="radio" 
                        name="slot_selection" 
                        value={slot.id}
                        onChange={() => {
                          setSelectedSlotId(slot.id);
                          addLog(`Usuario seleccionó horario ID: ${slot.id}`);
                        }}
                        checked={selectedSlotId === slot.id}
                      />
                      {slot.time}
                    </label>
                  )}
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <br />

        <button 
          type="submit" 
          disabled={!selectedSlotId || submitting}
        >
          {submitting ? "ENVIANDO DATOS..." : "CONFIRMAR Y PAGAR"}
        </button>
      </form>

      <hr />
      <h3>Datos de Depuración (Log):</h3>
      <pre id="debug-log">{debugLog}</pre>
    </div>
  );
};

export default KartsBookingSystem;