import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🔒',
    title: 'Seguridad bancaria',
    desc: 'Plataforma protegida con cifrado de extremo a extremo y autenticación multifactor.',
  },
  {
    icon: '⚡',
    title: 'Gestión ágil',
    desc: 'Administra tus datos personales, documentos y solicitudes desde un solo lugar.',
  },
  {
    icon: '🇻🇪',
    title: 'Solo para Venezuela',
    desc: 'Servicio exclusivo para clientes y colaboradores en territorio venezolano.',
  },
];

export default function BdvLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-[#0047AB] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[#0047AB] text-lg select-none">
            BDV
          </div>
          <span className="text-xl font-semibold tracking-wide">Banco de Venezuela</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0047AB] to-[#0065CC] text-white py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Portal BDV Persona
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto">
              Plataforma de autogestión exclusiva para clientes y colaboradores
              del Banco de Venezuela con residencia en Venezuela.
            </p>
            <div className="mt-8 inline-block bg-yellow-400 text-slate-900 text-sm font-semibold px-5 py-2 rounded-full">
              Servicio disponible únicamente desde Venezuela
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl shadow-sm p-7 border border-slate-100">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Address + Map */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 items-start">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#0047AB]">Encuéntranos</h2>
              <p className="text-slate-600 mb-2 leading-relaxed">
                <span className="font-semibold">Sede Principal Corporativa</span><br />
                Av. Urdaneta, Esquina de Veroes a Pelota,<br />
                Edificio Banco de Venezuela,<br />
                El Rosal, Caracas 1060,<br />
                República Bolivariana de Venezuela
              </p>
              <p className="text-slate-500 text-sm mt-4">
                Horario de atención:<br />
                Lunes a Viernes, 8:30 am – 3:30 pm
              </p>
              <p className="text-slate-500 text-sm mt-3">
                Correo electrónico de contacto corporativo:<br />
                <a href="mailto:contacto@bancodevenezuela.com" className="text-[#0047AB] hover:underline">
                  contacto@bancodevenezuela.com
                </a>
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 h-64 md:h-80">
              <iframe
                title="Ubicación BDV El Rosal"
                width="100%"
                height="100%"
                frameBorder="0"
                loading="lazy"
                src="https://maps.google.com/maps?q=Av.+Urdaneta+Esquina+Veroes+Banco+de+Venezuela+Caracas&output=embed"
              />
            </div>
          </div>
        </section>

        {/* Notice */}
        <section className="bg-slate-50 border-t border-slate-200 py-10 px-6">
          <div className="max-w-3xl mx-auto text-center text-slate-500 text-sm leading-relaxed">
            <p>
              El acceso a este portal está restringido a usuarios ubicados en Venezuela
              conforme a las políticas internas del Banco de Venezuela y la normativa
              vigente de la <strong>Superintendencia de las Instituciones del Sector Bancario (SUDEBAN)</strong>.
            </p>
            <p className="mt-3">
              Si eres un usuario venezolano y ves esta página, verifica que tu conexión
              no use una VPN o proxy internacional.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#003380] text-blue-200 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <span>© {new Date().getFullYear()} Banco de Venezuela, S.A. Banco Universal. Todos los derechos reservados.</span>
          <div className="flex gap-5">
            <Link to="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link to="/terminos" className="hover:text-white transition-colors">Términos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
