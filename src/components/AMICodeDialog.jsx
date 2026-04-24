import { useState } from "react";

export default function AMICodeDialog({ onCancel, onConfirm }) {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const isActive = focused || code.length > 0;
  const isValid = code.length >= 8;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "4px",
          padding: "32px 28px 24px",
          width: "360px",
          boxShadow: "0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12)",
        }}
      >
        {/* Title */}
        <h2
          style={{
            color: "#0067B1",
            fontSize: "22px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "20px",
            fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
          }}
        >
          Autenticación
        </h2>

        {/* Subtitle */}
        <p
          style={{
            color: "#0067B1",
            fontSize: "15px",
            fontWeight: 500,
            textAlign: "center",
            marginBottom: "20px",
            lineHeight: "1.4",
            fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
          }}
        >
          Pre-Aprobado Vehicular Introduzca el código AMI
        </p>

        {/* Input field */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: "4px 4px 0 0",
              padding: "12px 12px 0 12px",
            }}
          >
            <div style={{ position: "relative", paddingTop: "18px", paddingBottom: "4px" }}>
              <label
                style={{
                  position: "absolute",
                  top: isActive ? "0px" : "50%",
                  left: 0,
                  transform: isActive ? "scale(0.75)" : "translateY(-50%)",
                  transformOrigin: "0 0",
                  transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  color: focused ? "#0067B1" : "rgba(0,0,0,0.45)",
                  fontSize: "16px",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                }}
              >
                Introduzca código recibi...
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 20))}
                autoFocus
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  color: "rgba(0,0,0,0.87)",
                  lineHeight: "1.5",
                  fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                  padding: 0,
                  letterSpacing: "2px",
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </div>
          </div>
          <div
            style={{
              height: "2px",
              backgroundColor: focused ? "#0067B1" : "rgba(0,0,0,0.42)",
              transition: "background-color 0.2s",
            }}
          />
          {code.length > 0 && code.length < 8 && (
            <p style={{ fontSize: "11px", color: "#e53935", marginTop: "4px", fontFamily: "Roboto, sans-serif" }}>
              Mínimo 8 dígitos requeridos
            </p>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => isValid && onConfirm && onConfirm(code)}
            disabled={!isValid}
            style={{
              flex: 1,
              height: "42px",
              backgroundColor: isValid ? "#0067B1" : "rgba(0,0,0,0.08)",
              color: isValid ? "#fff" : "rgba(0,0,0,0.26)",
              border: "none",
              borderRadius: "2px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              cursor: isValid ? "pointer" : "default",
              fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
              transition: "background-color 0.3s",
            }}
          >
            Continuar
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: "42px",
              backgroundColor: "#0067B1",
              color: "#fff",
              border: "none",
              borderRadius: "2px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              cursor: "pointer",
              boxShadow: "0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)",
              fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}