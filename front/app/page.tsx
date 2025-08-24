import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Send } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="text-2xl font-bold text-slate-800">Amelia</div>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-slate-700 hover:text-slate-900 font-medium">
              Home
            </Link>
            <Link href="#" className="text-slate-700 hover:text-slate-900 font-medium">
              About
            </Link>
            <Link href="#" className="text-slate-700 hover:text-slate-900 font-medium">
              Contact
            </Link>
            <Button className="bg-psychology-blue hover:bg-psychology-blue/90 text-white px-6 py-2 rounded-lg">
              Login
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">
                Always here
                <br />
                to support you
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                AI therapy assistant offering
                <br />
                continuous care for mental health.
              </p>
              <Link href="/dashboard">
                <Button className="bg-psychology-blue hover:bg-psychology-blue/90 text-white px-8 py-3 text-lg rounded-lg">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-psychology-lavender/30 rounded-full flex items-center justify-center">
                  <img
                    src="/therapist-illustration.png"
                    alt="AI Therapy Assistant"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-psychology-lavender rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-psychology-lavender rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">How It Works</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Learn more about how Amelia can
                <br />
                assist you on your mental health
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              {/* Chat Interface Mockup */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-psychology-lavender rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-psychology-lavender text-white px-4 py-3 rounded-2xl rounded-tl-sm max-w-xs">
                    Hello! I'm here for you. How can I assist you today?
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-psychology-mint text-slate-800 px-4 py-3 rounded-2xl rounded-tr-sm max-w-xs">
                    I've been feeling overwhelmed recently.
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-psychology-blue"
                  />
                  <Button size="sm" className="bg-psychology-blue hover:bg-psychology-blue/90 rounded-full p-2">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" className="rounded-full text-xs bg-transparent">
                    Crisis support
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full text-xs bg-transparent">
                    Coping strategies
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full text-xs bg-transparent">
                    Mood tracking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Mental Health Professionals Section */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-white p-4 rounded-lg shadow-lg transform -rotate-2">
                  <img
                    src="/dashboard-mockup.png"
                    alt="Professional Dashboard"
                    className="w-96 h-64 object-cover rounded"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-16 bg-psychology-lavender/20 rounded-lg"></div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                For Mental Health
                <br />
                Professionals
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Access tools and insights to
                <br />
                enhance patient care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Contact</h2>
              <p className="text-xl text-slate-600 leading-relaxed">For inquiries and support</p>
            </div>
            <div className="flex justify-center">
              <Button className="bg-psychology-mint hover:bg-psychology-mint/90 text-slate-800 px-12 py-4 text-lg rounded-lg">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
