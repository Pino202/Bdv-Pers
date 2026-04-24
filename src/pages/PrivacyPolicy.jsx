import { Link } from 'react-router-dom';

const LAST_UPDATED = '24 de abril de 2026';

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold mb-2 text-[#0047AB]">Política de Privacidad</h1>
        <p className="text-slate-500 text-sm mb-10">Última actualización: {LAST_UPDATED}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Marco legal aplicable</h2>
            <p>
              El Banco de Venezuela, S.A. Banco Universal ("<strong>BDV</strong>") da cumplimiento a la{' '}
              <strong>Ley Orgánica de Protección de Datos Personales (LOPDP)</strong> publicada en la Gaceta
              Oficial N.º 6.687 Extraordinario del 4 de agosto de 2021, así como a su Reglamento Parcial y a
              las disposiciones del{' '}
              <strong>Decreto con Rango, Valor y Fuerza de Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>{' '}
              (Gaceta Oficial N.º 37.148 del 28 de febrero de 2001) y a la{' '}
              <strong>Constitución de la República Bolivariana de Venezuela</strong>, artículo 60.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Responsable del tratamiento</h2>
            <p>
              <strong>Banco de Venezuela, S.A. Banco Universal</strong><br />
              Av. Urdaneta, Esquina de Veroes a Pelota, Edificio Banco de Venezuela,<br />
              El Rosal, Caracas 1060, República Bolivariana de Venezuela<br />
              RIF: J-00000898-9<br />
              Correo electrónico: <a href="mailto:privacidad@bancodevenezuela.com" className="text-[#0047AB] hover:underline">privacidad@bancodevenezuela.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Datos personales que recopilamos</h2>
            <p>En el Portal BDV Persona podemos tratar las siguientes categorías de datos:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Datos de identificación: nombre, apellido, cédula de identidad, pasaporte.</li>
              <li>Datos de contacto: correo electrónico, dirección de residencia.</li>
              <li>Datos de acceso: credenciales cifradas, registros de sesión (logs).</li>
              <li>Datos de navegación: dirección IP, país de origen de la conexión (geolocalización a nivel de país), tipo de dispositivo y navegador.</li>
              <li>Datos financieros: únicamente los necesarios para la prestación del servicio bancario y conforme a la normativa SUDEBAN.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Finalidad y base legal del tratamiento</h2>
            <table className="w-full text-sm border-collapse mt-2">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left p-2 border border-slate-200">Finalidad</th>
                  <th className="text-left p-2 border border-slate-200">Base legal (LOPDP)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Autenticación e identificación del usuario', 'Art. 9 – Ejecución del contrato de servicios'],
                  ['Verificación de residencia en Venezuela (geolocalización por IP)', 'Art. 9 – Interés legítimo y cumplimiento de normativa SUDEBAN'],
                  ['Seguridad informática y prevención de fraude', 'Art. 9 – Obligación legal y seguridad de la información'],
                  ['Mejora de la plataforma y análisis de uso', 'Art. 9 – Consentimiento del titular'],
                  ['Cumplimiento de obligaciones fiscales y regulatorias', 'Art. 9 – Obligación legal'],
                ].map(([f, b]) => (
                  <tr key={f} className="border-b border-slate-100">
                    <td className="p-2 border border-slate-200">{f}</td>
                    <td className="p-2 border border-slate-200">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Geolocalización por dirección IP</h2>
            <p>
              Con el fin de cumplir con las restricciones operativas y regulatorias del servicio, BDV
              realiza una verificación del país de origen de la conexión mediante la dirección IP del
              dispositivo del usuario al momento de acceder al portal. Este proceso:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Solo determina el <strong>país</strong> de la conexión; no se almacena la dirección IP completa en sistemas de BDV.</li>
              <li>Utiliza un servicio externo de geolocalización de terceros operado en territorio extranjero; la transferencia internacional está amparada en el Art. 37 de la LOPDP (transferencia necesaria para la ejecución del contrato).</li>
              <li>El resultado se almacena temporalmente en el dispositivo del usuario (sessionStorage) durante la sesión activa y no se comparte con terceros para fines publicitarios.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Derechos del titular</h2>
            <p>
              Conforme a los artículos 20 al 30 de la LOPDP, el titular de los datos tiene derecho a:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li><strong>Acceso:</strong> conocer qué datos personales trata BDV.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de datos cuando proceda.</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo.</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y legible.</li>
              <li><strong>Limitación:</strong> restringir el tratamiento en los supuestos legales previstos.</li>
            </ul>
            <p className="mt-2 text-sm">
              Para ejercer estos derechos, envíe una solicitud escrita a{' '}
              <a href="mailto:privacidad@bancodevenezuela.com" className="text-[#0047AB] hover:underline">privacidad@bancodevenezuela.com</a>{' '}
              indicando su nombre completo, cédula de identidad y el derecho que desea ejercer.
              BDV responderá en un plazo máximo de <strong>15 días hábiles</strong> conforme al Art. 25 de la LOPDP.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Conservación de datos</h2>
            <p>
              Los datos personales se conservan durante el tiempo necesario para el cumplimiento de la
              finalidad para la que fueron recabados y, en todo caso, durante los plazos establecidos
              por la normativa bancaria venezolana (mínimo 10 años para registros contables conforme
              al Código de Comercio).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Seguridad</h2>
            <p>
              BDV aplica medidas técnicas y organizativas adecuadas para proteger los datos personales
              frente a accesos no autorizados, pérdida, alteración o divulgación, incluyendo cifrado
              en tránsito (TLS 1.2+) y en reposo, control de acceso basado en roles y auditorías
              periódicas de seguridad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Modificaciones</h2>
            <p>
              BDV se reserva el derecho de actualizar esta Política. Los cambios sustanciales serán
              notificados mediante aviso destacado en el portal o por correo electrónico registrado.
              El uso continuado del portal tras la notificación implica la aceptación de la política
              actualizada.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">10. Autoridad de control</h2>
            <p>
              El órgano competente en materia de protección de datos personales en Venezuela es la{' '}
              <strong>Oficina de Protección de Datos Personales (OPDP)</strong> adscrita al{' '}
              Ministerio del Poder Popular para Ciencia y Tecnología.
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
