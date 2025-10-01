import Link from 'next/link';
import { MessageCircle, ListChecks, Shield, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
      {/* Header */}
      <header className="">
        <nav className="mx-auto inline-block w-full max-w-full items-center justify-between px-2 py-2 sm:flex sm:max-w-6xl sm:px-6 sm:py-0">
          <Link href="/" className="hidden items-center gap-2 sm:flex">
            <img src="/logo.png" alt="Logotipo" width={50} height={50} />
            <img src="/brand_text.png" alt="Texto de marca" width={100} height={20} />
          </Link>
          <div className="flex items-center justify-center gap-8 sm:justify-end">
            <Link href="#home" className="font-medium text-slate-700 hover:text-slate-900">
              Inicio
            </Link>
            <Link href="#about" className="font-medium text-slate-700 hover:text-slate-900">
              Acerca de
            </Link>
            <Link href="#contact" className="font-medium text-slate-700 hover:text-slate-900">
              Contacto
            </Link>
            <Link
              href="/login"
              className="bg-psychology-blue hover:bg-psychology-blue/90 rounded-lg px-6 py-2 text-white"
            >
              Iniciar sesión
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-100 px-6 py-16" id="home">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mb-6 text-5xl leading-tight font-bold text-slate-800">
                Siempre disponible
                <br />
                para apoyarte
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-slate-600">
                Asistente de terapia con IA que te acompaña
                <br />
                cuando tu terapeuta no está disponible.
              </p>
              <Link
                className="bg-psychology-blue hover:bg-psychology-blue/90 rounded-lg px-8 py-3 text-lg text-white"
                href="/login"
              >
                Comenzar
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex items-center justify-center">
                  <img
                    src="/amelia.png"
                    alt="Asistente de terapia con IA"
                    className="amelia-image h-auto w-full object-contain md:w-[500px] md:max-w-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white px-6 py-16" id="about">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="max-w-xl lg:pr-8">
              <h2 className="mb-2 text-4xl font-bold text-slate-800">Cómo funciona</h2>
              <p className="text-slate-600">Atención por WhatsApp, insights para tu terapeuta.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-psychology-blue/10 text-psychology-blue rounded-md p-2">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800">Comunícate cuando quieras</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Escribe a Amelia por WhatsApp para recibir acompañamiento cálido e inmediato.
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-psychology-blue/10 text-psychology-blue rounded-md p-2">
                      <ListChecks className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800">Elige tu ritmo</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Puedes comentarle lo bueno que fue tu dia o perdirle ayuda si necesitas acompañamiento durante esos momentos difíciles.
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-psychology-blue/10 text-psychology-blue rounded-md p-2">
                      <Shield className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800">Privado por diseño</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Tus reflexiones se almacenan de forma segura.
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-psychology-blue/10 text-psychology-blue rounded-md p-2">
                      <BarChart3 className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800">Insights para tu cuidado</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Resúmenes y tendencias que ayudarán a tu terapeuta a ver tu progreso y tener terapia más eficientes.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm md:p-12">
              <img src="/whatsapp_picture.jpg" alt="Interfaz de chat" className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* For Mental Health Professionals Section */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex justify-center">
              <div className="relative">
                <div className="-rotate-2 transform rounded-lg bg-white p-4 shadow-lg">
                  <picture>
                    <img
                      src="/dashboard.png"
                      alt="Panel profesional"
                      className="h-64 w-96 rounded object-cover"
                    />
                  </picture>
                </div>
                <div className="bg-psychology-lavender/20 absolute -right-4 -bottom-4 h-16 w-24 rounded-lg"></div>
              </div>
            </div>
            <div>
              <h2 className="mb-6 text-4xl font-bold text-slate-800">
                Para profesionales
                <br />
                de la salud mental
              </h2>
              <p className="text-xl leading-relaxed text-slate-600">
                Accede a herramientas e insights que
                <br />
                potencian el cuidado de tus pacientes.
              </p>
              <p className="mt-4 text-sm text-slate-600">
                Visualiza tendencias de estado de ánimo, actividad conversacional, distribución de
                emociones, alertas de crisis y hallazgos clave de un vistazo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white px-6 py-16" id="contact">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-slate-800">Contacto</h2>
              <p className="text-xl leading-relaxed text-slate-600">Para consultas y soporte</p>
            </div>
            <div className="flex justify-center">
              <Link
                className="bg-psychology-mint hover:bg-psychology-mint/90 rounded-lg px-12 py-4 text-lg text-slate-800"
                target="_blank"
                rel="noopener noreferrer"
                href="https://wa.me/573112853261?text=Estoy interesado en sus servicios"
              >
                Enviar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
