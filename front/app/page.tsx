import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Send } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
      {/* Header */}
      <header className="px-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" width={50} height={50} />
            <img src="/brand_text.png" alt="Logo" width={100} height={20} />
          </Link>
          <div className="flex items-center gap-8">
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
              href="/dashboard"
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
                href="/dashboard"
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
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-slate-800">How It Works</h2>
              <p className="text-xl leading-relaxed text-slate-600">
                Learn more about how Amelia can
                <br />
                assist you on your mental health
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-8">
              {/* Chat Interface Mockup */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-psychology-lavender flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-psychology-lavender max-w-xs rounded-2xl rounded-tl-sm px-4 py-3 text-white">
                    Hello! I'm here for you. How can I assist you today?
                  </div>
                </div>
                <div className="flex items-start justify-end gap-3">
                  <div className="bg-psychology-mint max-w-xs rounded-2xl rounded-tr-sm px-4 py-3 text-slate-800">
                    I've been feeling overwhelmed recently.
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    className="focus:ring-psychology-blue flex-1 rounded-full border border-slate-200 px-4 py-2 focus:ring-2 focus:outline-none"
                  />
                  <Button
                    size="sm"
                    className="bg-psychology-blue hover:bg-psychology-blue/90 rounded-full p-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-transparent text-xs"
                  >
                    Crisis support
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-transparent text-xs"
                  >
                    Coping strategies
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-transparent text-xs"
                  >
                    Mood tracking
                  </Button>
                </div>
              </div>
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
                  <img
                    src="/dashboard-mockup.png"
                    alt="Professional Dashboard"
                    className="h-64 w-96 rounded object-cover"
                  />
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
