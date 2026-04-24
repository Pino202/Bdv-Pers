import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    title: 'Salas',
    desc: 'Sofás, sillones y mesas de centro en maderas nobles y telas selectas.',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    title: 'Comedores',
    desc: 'Mesas extensibles y sillas tapizadas para reunir a los tuyos con elegancia.',
    img: 'https://images.unsplash.com/photo-1617104678098-de229db51175?w=600&q=80',
  },
  {
    title: 'Dormitorios',
    desc: 'Camas, cómodas y closets diseñados para el descanso y el orden.',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  },
  {
    title: 'Oficinas',
    desc: 'Escritorios, estantes y sillas ergonómicas para espacios de trabajo productivos.',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
  },
];

const Logo = () => (
  <div className="flex items-center gap-3">
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="42" height="42" rx="4" fill="#C9A84C"/>
      <rect x="8" y="28" width="26" height="4" rx="1" fill="#3D2B1F"/>
      <rect x="10" y="16" width="22" height="12" rx="2" fill="#3D2B1F"/>
      <rect x="8" y="18" width="5" height="10" rx="1" fill="#4A3728"/>
      <rect x="29" y="18" width="5" height="10" rx="1" fill="#4A3728"/>
      <rect x="11" y="28" width="3" height="5" rx="1" fill="#3D2B1F"/>
      <rect x="28" y="28" width="3" height="5" rx="1" fill="#3D2B1F"/>
    </svg>
    <div>
      <span className="text-xl font-bold tracking-widest text-[#3D2B1F]">BDV</span>
      <span className="block text-xs tracking-[0.3em] text-[#C9A84C] uppercase leading-none">Muebles</span>
    </div>
  </div>
);

export default function BdvLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#3D2B1F]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>

      {/* Header */}
      <header className="bg-[#FAF6F0] border-b border-[#E8D9C0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wider text-[#5C3D2E]">
            <a href="#colecciones" className="hover:text-[#C9A84C] transition-colors">Colecciones</a>
            <a href="#nosotros" className="hover:text-[#C9A84C] transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-[#C9A84C] transition-colors">Contacto</a>
          </nav>
          <a
            href="mailto:ventas@bdvmuebles.com"
            className="hidden md:inline-block border border-[#C9A84C] text-[#C9A84C] text-xs tracking-widest px-5 py-2 hover:bg-[#C9A84C] hover:text-white transition-colors"
          >
            COTIZAR
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="relative h-[88vh] min-h-[500px] flex items-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85"
            alt="Sala de estar clásica BDV"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f08]/80 via-[#1a0f08]/40 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6 w-full">
            <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">Caracas, Venezuela · Est. 2010</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-xl">
              El arte de<br />vivir bien
            </h1>
            <p className="mt-5 text-[#E8D9C0] text-lg max-w-md leading-relaxed">
              Muebles de madera sólida elaborados con oficio y tradición para el hogar venezolano.
            </p>
            <a
              href="#colecciones"
              className="mt-8 inline-block bg-[#C9A84C] text-white text-sm tracking-widest px-8 py-4 hover:bg-[#b8963e] transition-colors"
            >
              VER COLECCIONES
            </a>
          </div>
        </section>

        {/* Colecciones */}
        <section id="colecciones" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-2">Nuestras colecciones</p>
              <h2 className="text-4xl font-bold">Cada espacio, una obra</h2>
              <div className="mt-4 mx-auto w-16 h-px bg-[#C9A84C]" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map(cat => (
                <div key={cat.title} className="group cursor-default">
                  <div className="overflow-hidden aspect-[4/5]">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="pt-5">
                    <h3 className="text-lg font-bold tracking-wide">{cat.title}</h3>
                    <p className="mt-1 text-sm text-[#7A5C44] leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banner intermedio */}
        <section className="bg-[#3D2B1F] py-16 px-6 text-center">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Fabricación propia</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto leading-snug">
            Diseñamos y fabricamos cada pieza en nuestros talleres en Venezuela
          </h2>
          <p className="mt-4 text-[#C4A882] max-w-xl mx-auto text-sm leading-relaxed">
            Maderas certificadas, herrajes importados y tapicería artesanal. Cada mueble BDV
            lleva el sello de calidad de nuestros maestros artesanos.
          </p>
        </section>

        {/* Nosotros + Contacto */}
        <section id="nosotros" className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-start">
            <div>
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Sobre nosotros</p>
              <h2 className="text-3xl font-bold mb-5">Tradición y elegancia desde 2010</h2>
              <p className="text-[#5C3D2E] leading-relaxed mb-4">
                BDV Muebles nació con la visión de llevar muebles de alta calidad al hogar
                venezolano. Con más de quince años de trayectoria, combinamos técnicas
                artesanales con diseños atemporales que perduran generación tras generación.
              </p>
              <p className="text-[#5C3D2E] leading-relaxed">
                Atendemos proyectos residenciales y comerciales en todo el territorio nacional,
                ofreciendo asesoría de diseño de interiores sin costo adicional.
              </p>

              <div id="contacto" className="mt-10 space-y-3 text-sm text-[#5C3D2E]">
                <p className="font-bold text-[#3D2B1F] tracking-wide">SHOWROOM</p>
                <p>
                  Av. Francisco de Miranda, C.C. El Rosal,<br />
                  Local 14-B, El Rosal,<br />
                  Caracas 1060, Venezuela
                </p>
                <p>Lunes a Sábado · 9:00 am – 6:00 pm</p>
                <p>
                  <a href="mailto:ventas@bdvmuebles.com" className="text-[#C9A84C] hover:underline">
                    ventas@bdvmuebles.com
                  </a>
                </p>
              </div>
            </div>

            <div className="rounded overflow-hidden shadow-lg border border-[#E8D9C0] h-80 md:h-full min-h-[320px]">
              <iframe
                title="BDV Muebles El Rosal Caracas"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://maps.google.com/maps?q=Av.+Francisco+de+Miranda+El+Rosal+Caracas+Venezuela&output=embed"
              />
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#2C1810] text-[#A08060] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wider">
          <span>© {new Date().getFullYear()} BDV Muebles. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <Link to="/privacidad" className="hover:text-[#C9A84C] transition-colors">Privacidad</Link>
            <Link to="/terminos" className="hover:text-[#C9A84C] transition-colors">Términos</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
