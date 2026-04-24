import { Link } from 'react-router-dom';

const LAST_UPDATED = '24 de abril de 2026';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <header className="bg-[#0047AB] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/" className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[#0047AB] text-lg select-none">
            BDV
          </Link>
          <span className="text-xl font-semibold tracking-wide">Banco de Venezuela</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2 text-[#0047AB]">Términos y Condiciones de Uso</h1>
        <p className="text-slate-500 text-sm mb-10">Última actualización: {LAST_UPDATED}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Partes y objeto</h2>
            <p>
              Los presentes Términos y Condiciones de Uso ("<strong>Términos</strong>") regulan el acceso y uso
              del portal web <strong>BDV Persona</strong> ("<strong>Portal</strong>") provisto por{' '}
              <strong>Banco de Venezuela, S.A. Banco Universal</strong> ("<strong>BDV</strong>"), inscrito en
              el Registro Mercantil Primero de la Circunscripción Judicial del Distrito Capital, bajo el
              RIF J-00000898-9, con domicilio en Av. Urdaneta, Esquina de Veroes a Pelota, Edificio
              Banco de Venezuela, El Rosal, Caracas 1060, Venezuela.
            </p>
            <p className="mt-2">
              El acceso al Portal implica la aceptación plena e incondicional de estos Términos. Si no
              está de acuerdo, debe abstenerse de utilizar el Portal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Ámbito geográfico y elegibilidad</h2>
            <p>
              El Portal está destinado exclusivamente a:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Personas naturales con cédula de identidad venezolana o pasaporte vigente.</li>
              <li>Colaboradores del Banco de Venezuela con residencia habitual en la República Bolivariana de Venezuela.</li>
              <li>Usuarios que accedan desde una conexión de internet con punto de presencia dentro del territorio venezolano.</li>
            </ul>
            <p className="mt-2 text-sm">
              BDV se reserva el derecho de restringir el acceso a conexiones originadas fuera de Venezuela
              con el fin de cumplir con la normativa emitida por la{' '}
              <strong>Superintendencia de las Instituciones del Sector Bancario (SUDEBAN)</strong> y las
              políticas internas de seguridad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Registro y credenciales de acceso</h2>
            <p>
              El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso
              (usuario y contraseña). Cualquier actividad realizada mediante sus credenciales se presumirá
              realizada por el titular de la cuenta. En caso de pérdida, robo o uso no autorizado, el
              usuario deberá notificarlo de inmediato a BDV.
            </p>
            <p className="mt-2 text-sm">
              Queda prohibida la cesión, venta o transferencia de credenciales a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Uso aceptable</h2>
            <p>El usuario se compromete a utilizar el Portal de forma lícita y conforme a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>La <strong>Constitución de la República Bolivariana de Venezuela</strong>.</li>
              <li>La <strong>Ley del Sistema Financiero Nacional</strong> y la normativa SUDEBAN.</li>
              <li>La <strong>Ley Especial contra los Delitos Informáticos</strong> (Gaceta Oficial N.º 37.313 del 30-10-2001).</li>
              <li>La <strong>Ley Orgánica de Protección de Datos Personales (LOPDP)</strong>.</li>
              <li>El <strong>Decreto-Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>.</li>
            </ul>
            <p className="mt-2 text-sm">
              Se prohíbe expresamente: la ingeniería inversa del Portal, el uso de bots o scripts
              automatizados no autorizados, la introducción de código malicioso, y cualquier acción
              que comprometa la disponibilidad o integridad del sistema.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Propiedad intelectual</h2>
            <p>
              Todos los contenidos del Portal (marca, logotipos, diseño, código fuente, textos e imágenes)
              son propiedad de BDV o de sus licenciantes y están protegidos por las leyes venezolanas de
              propiedad intelectual. Queda prohibida su reproducción, distribución o modificación sin
              autorización expresa por escrito de BDV.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Disponibilidad del servicio</h2>
            <p>
              BDV realizará los esfuerzos razonables para mantener el Portal operativo, pero no garantiza
              disponibilidad ininterrumpida. BDV podrá suspender el acceso temporal o definitivamente
              por razones de mantenimiento, seguridad o causas de fuerza mayor, sin que ello genere
              derecho a indemnización a favor del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Limitación de responsabilidad</h2>
            <p>
              En la máxima extensión permitida por la legislación venezolana, BDV no será responsable por
              daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso del
              Portal, incluyendo pérdidas económicas, pérdida de datos o interrupciones del negocio,
              salvo que dichos daños sean consecuencia directa de dolo o culpa grave de BDV.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Ley aplicable y jurisdicción</h2>
            <p>
              Estos Términos se rigen por las leyes de la <strong>República Bolivariana de Venezuela</strong>.
              Cualquier controversia que surja en relación con el Portal o estos Términos se someterá a la
              jurisdicción exclusiva de los tribunales competentes del Área Metropolitana de Caracas,
              con renuncia expresa a cualquier otro fuero que pudiera corresponder.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Modificaciones</h2>
            <p>
              BDV se reserva el derecho de modificar estos Términos en cualquier momento. Las
              modificaciones entrarán en vigor desde su publicación en el Portal. El uso continuado
              del Portal tras la publicación constituirá la aceptación de los Términos modificados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">10. Contacto</h2>
            <p>
              Para consultas sobre estos Términos, puede contactarnos en:<br />
              <a href="mailto:legal@bancodevenezuela.com" className="text-[#0047AB] hover:underline">
                legal@bancodevenezuela.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-[#003380] text-blue-200 py-6 px-6 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <span>© {new Date().getFullYear()} Banco de Venezuela, S.A. Banco Universal.</span>
          <div className="flex gap-5">
            <Link to="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link to="/terminos" className="hover:text-white transition-colors">Términos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
