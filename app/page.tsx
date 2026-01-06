"use client";

import {
  ArrowRight,
  Calendar,
  BarChart3,
  Timer,
  Bell,
  Gamepad2,
  Music,
  Brain,
  Mail,
  Phone,
  MapPin,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen scroll-smooth bg-gradient-to-br from-gray-50 via-indigo-50 to-white text-slate-800">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">WorkLife+</h1>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#features">Features</a>
          <a href="#why">Why Us</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
          <a href="/app" className="text-indigo-600 font-semibold">
            Open App →
          </a>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-36 pb-28 text-center max-w-6xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
          A Smarter Way to Work.
          <br />
          <span className="text-indigo-600">A Healthier Way to Live.</span>
        </h2>

        <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
          WorkLife+ is a modern productivity and work-life balance platform
          inspired by tools like Sunsama. It helps you plan intentionally,
          focus deeply, reduce stress, and avoid burnout.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/app"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl shadow"
          >
            Get Started Free <ArrowRight size={18} />
          </a>

          <a
            href="#features"
            className="px-8 py-4 rounded-xl border border-indigo-600 text-indigo-600"
          >
            Explore Features
          </a>
        </div>

        {/* TRUST BAR */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>✔ Used by students & professionals</span>
          <span>✔ Designed for mental well-being</span>
          <span>✔ No credit card required</span>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-8">
        <h3 className="text-3xl font-semibold text-center mb-14">
          Everything You Need — In One Calm Workspace
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature icon={<Timer />} title="Daily Planner" desc="Plan your day intentionally with tasks and priorities." link="/app?tab=today" />
          <Feature icon={<BarChart3 />} title="Analytics" desc="Track productivity and work-life balance visually." link="/app?tab=analytics" />
          <Feature icon={<Calendar />} title="Calendar" desc="Schedule tasks using a real interactive calendar." link="/app?tab=calendar" />
          <Feature icon={<Bell />} title="Smart Reminders" desc="Health, break and habit reminders." link="/app?tab=reminders" />
          <Feature icon={<Gamepad2 />} title="Stress-Relief Games" desc="Refresh your mind with quick games." link="/app?tab=games" />
          <Feature icon={<Music />} title="Music & Video" desc="Focus music and relaxing videos." link="/app?tab=media" />
          <Feature icon={<Brain />} title="AI Burnout Detection" desc="Detect overwork and maintain balance." link="/app?tab=analytics" />
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section id="why" className="py-24 bg-white">
        <h3 className="text-3xl font-semibold text-center mb-12">
          Why Choose WorkLife+?
        </h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-8 text-center">
          <WhyCard title="Designed for Balance" text="Not just productivity — we focus on mental well-being." />
          <WhyCard title="Simple & Calm UI" text="Clean design that reduces cognitive overload." />
          <WhyCard title="All-in-One Platform" text="Tasks, focus, analytics, calendar, and relaxation in one place." />
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-8">
        <h3 className="text-3xl font-semibold text-center mb-12">
          Loved by Users
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <Testimonial name="Adarsh Singh" role="CSE Student" text="This project genuinely helped me manage studies and personal life better." />
          <Testimonial name="Riya Mehta" role="Software Intern" text="The focus mode and analytics are extremely helpful." />
          <Testimonial name="Aman Kumar" role="Freelancer" text="Finally a productivity tool that doesn’t cause burnout." />
          <Testimonial name="Sneha Patel" role="MBA Student" text="Clean UI and very calming experience." />
          <Testimonial name="Rahul Verma" role="Working Professional" text="The calendar and reminders keep me disciplined." />
          <Testimonial name="Priya Sharma" role="Designer" text="Love the balance between work and relaxation features." />
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-24 bg-slate-900 text-slate-200">
        <h3 className="text-3xl font-semibold text-center mb-12 text-white">
          Get in Touch
        </h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-8 text-center">
          <ContactCard icon={<Mail />} title="Email" text="support@worklifeplus.com" />
          <ContactCard icon={<Phone />} title="Phone" text="+91-98765-43210" />
          <ContactCard icon={<MapPin />} title="Address" text="ABES Engineering College, Ghaziabad, India" />
        </div>

        <p className="text-center text-sm text-slate-400 mt-12">
          © 2025 WorkLife+. All rights reserved.
        </p>
      </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function Feature({ icon, title, desc, link }: any) {
  return (
    <a href={link} className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition">
      <div className="text-indigo-600 mb-4">{icon}</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-sm text-slate-600">{desc}</p>
    </a>
  );
}

function WhyCard({ title, text }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

function Testimonial({ name, role, text }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex gap-1 text-yellow-500 mb-2">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} />)}
      </div>
      <p className="italic text-slate-600">“{text}”</p>
      <p className="mt-4 font-semibold">{name}</p>
      <p className="text-xs text-slate-500">{role}</p>
    </div>
  );
}

function ContactCard({ icon, title, text }: any) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6">
      <div className="text-indigo-400 mb-3">{icon}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm">{text}</p>
    </div>
  );
}
