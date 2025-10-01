import Link from 'next/link';
import { MessageCircle, ListChecks, Shield, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
      {/* Header */}
      <header className="">
        <nav className="mx-auto inline-block w-full max-w-full items-center justify-between px-2 py-2 sm:flex sm:max-w-6xl sm:px-6 sm:py-0">
          <Link href="/" className="hidden items-center gap-2 sm:flex">
            <img src="/logo.png" alt="Logo" width={50} height={50} />
            <img src="/brand_text.png" alt="Logo" width={100} height={20} />
          </Link>
          <div className="flex items-center justify-center gap-8 sm:justify-end">
            <Link href="#home" className="font-medium text-slate-700 hover:text-slate-900">
              Home
            </Link>
            <Link href="#about" className="font-medium text-slate-700 hover:text-slate-900">
              About
            </Link>
            <Link href="#contact" className="font-medium text-slate-700 hover:text-slate-900">
              Contact
            </Link>
            <Link
              href="/login"
              className="bg-psychology-blue hover:bg-psychology-blue/90 rounded-lg px-6 py-2 text-white"
            >
              Login
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
                Always here
                <br />
                to support you
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-slate-600">
                AI therapy assistant offering
                <br />
                continuous care for mental health.
              </p>
              <Link
                className="bg-psychology-blue hover:bg-psychology-blue/90 rounded-lg px-8 py-3 text-lg text-white"
                href="/login"
              >
                Get Started
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex items-center justify-center">
                  <img
                    src="/amelia.png"
                    alt="AI Therapy Assistant"
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
              <h2 className="mb-2 text-4xl font-bold text-slate-800">How It Works</h2>
              <p className="text-slate-600">Care on WhatsApp, insights for your therapist.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-psychology-blue/10 text-psychology-blue rounded-md p-2">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800">Reach out anytime</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Message Amelia on WhatsApp for warm, instant support.
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-psychology-blue/10 text-psychology-blue rounded-md p-2">
                      <ListChecks className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800">Choose your flow</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Chat freely or do a 2‑minute guided check‑in.
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-psychology-blue/10 text-psychology-blue rounded-md p-2">
                      <Shield className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800">Private by design</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Your reflections are stored securely.
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="bg-psychology-blue/10 text-psychology-blue rounded-md p-2">
                      <BarChart3 className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800">Insight for your care</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Summaries and trends help your therapist see progress.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm md:p-12">
              <img src="/whatsapp_picture.jpg" alt="Chat Interface" className="h-auto w-full" />
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
                      alt="Professional Dashboard"
                      className="h-64 w-96 rounded object-cover"
                    />
                  </picture>
                </div>
                <div className="bg-psychology-lavender/20 absolute -right-4 -bottom-4 h-16 w-24 rounded-lg"></div>
              </div>
            </div>
            <div>
              <h2 className="mb-6 text-4xl font-bold text-slate-800">
                For Mental Health
                <br />
                Professionals
              </h2>
              <p className="text-xl leading-relaxed text-slate-600">
                Access tools and insights to
                <br />
                enhance patient care.
              </p>
              <p className="mt-4 text-sm text-slate-600">
                View mood trends, conversation activity, emotion distribution, crisis alerts, and
                key insights at a glance.
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
              <h2 className="mb-6 text-4xl font-bold text-slate-800">Contact</h2>
              <p className="text-xl leading-relaxed text-slate-600">For inquiries and support</p>
            </div>
            <div className="flex justify-center">
              <Link
                className="bg-psychology-mint hover:bg-psychology-mint/90 rounded-lg px-12 py-4 text-lg text-slate-800"
                target="_blank"
                rel="noopener noreferrer"
                href="https://wa.me/573112853261?text=I'm interested in your services"
              >
                Submit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
