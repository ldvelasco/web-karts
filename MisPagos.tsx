import { useState, useEffect } from "react";
// Si el archivo CSS está en la misma carpeta, usa ./
// Si está fuera, usa ../
import "./MisPagos.css";

// 1. Definimos la forma que tiene un "Pago"
interface Payment {
  id: string | number;
  date: string;
  concept: string;
  booking_code: string;
  amount: number;
  status: string;
}

const MyPayments = () => {
  // 2. Le decimos al estado: "Esto va a ser un array de Payment"
  const [payments, setPayments] = useState<Payment[]>([]);

  // 3. El error puede ser texto (string) o nulo (null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3000/api/v1/my-payments";
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPayments = async () => {
      if (!token) {
        setError("Debes iniciar sesión para ver tus pagos.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error("Sesión expirada.");
          throw new Error("Error al obtener el historial.");
        }

        // Aquí TypeScript confía en que la respuesta coincide con tu interfaz
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        // En lugar de forzar "any", preguntamos si es un Error de verdad
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  // --- RENDERIZADO ---

  if (loading) {
    return (
      <div className="payments-container">
        <h1 className="payments-title">Historial de Pagos</h1>
        <div className="loading-msg">🏎️ Calentando motores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payments-container">
        <h1 className="payments-title">Historial de Pagos</h1>
        <div className="error-msg">⚠️ {error}</div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <a href="/" className="link-login">
            Ir al Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <h1 className="payments-title">Historial de Pagos</h1>
      <p>Tus vueltas y reservas confirmadas.</p>

      {payments.length === 0 ? (
        <div className="empty-msg">Aún no has quemado asfalto (Sin pagos).</div>
      ) : (
        <div className="table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Código</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{p.concept || "Reserva Karts"}</td>
                  <td style={{ fontFamily: "monospace" }}>{p.booking_code}</td>
                  <td>${p.amount}</td>
                  <td>
                    <span className={`status-badge status-${p.status}`}>
                      {p.status === "completed" ? "PAGADO" : p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn-back" onClick={() => (window.location.href = "/")}>
        ← Volver al Paddock
      </button>
    </div>
  );
};

export default MyPayments;
