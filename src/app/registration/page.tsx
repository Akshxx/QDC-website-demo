"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── TRACKS ──────────────────────────────────────────────────────────────────
const TRACKS = [
  {
    id: "fintech",
    emoji: "💳",
    name: "FinTech",
    color: "#22d3ee",
    desc: "Reimagine financial systems, payments, and economic inclusion through technology.",
    locked: false,
  },
  {
    id: "healthtech",
    emoji: "🧬",
    name: "HealthTech",
    color: "#34d399",
    desc: "Solve healthcare accessibility, diagnostics, and wellness challenges with innovation.",
    locked: false,
  },
  {
    id: "edtech",
    emoji: "📚",
    name: "EdTech",
    color: "#f59e0b",
    desc: "Transform learning experiences and bridge educational gaps using emerging tech.",
    locked: false,
  },
  {
    id: "tbd1",
    emoji: "🔒",
    name: "Coming Soon",
    color: "#6b7280",
    desc: "A new track is being finalised. Stay tuned for the announcement!",
    locked: true,
  },
  {
    id: "tbd2",
    emoji: "🔒",
    name: "Coming Soon",
    color: "#6b7280",
    desc: "A new track is being finalised. Stay tuned for the announcement!",
    locked: true,
  },
];

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Tracks", href: "#tracks" },
  { name: "Timeline", href: "#timeline" },
  { name: "Register", href: "#register" },
];

const TIMELINE = [
  { date: "Mar 15, 2025", label: "Registrations Open", done: true },
  { date: "Apr 01, 2025", label: "Team Submission Deadline", done: false },
  { date: "Apr 10, 2025", label: "Shortlist Announced", done: false },
  { date: "Apr 20, 2025", label: "QwikInnovate D-Day", done: false },
];

type FormData = {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderReg: string;
  leaderYear: string;
  leaderBranch: string;
  member2: string;
  member2Reg: string;
  member3: string;
  member3Reg: string;
  member4: string;
  member4Reg: string;
  track: string;
  ideaTitle: string;
  ideaDesc: string;
};

const INITIAL: FormData = {
  teamName: "",
  leaderName: "",
  leaderEmail: "",
  leaderPhone: "",
  leaderReg: "",
  leaderYear: "",
  leaderBranch: "",
  member2: "",
  member2Reg: "",
  member3: "",
  member3Reg: "",
  member4: "",
  member4Reg: "",
  track: "",
  ideaTitle: "",
  ideaDesc: "",
};

export default function QwikInnovatePage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const registerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMsg("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, event: "QwikInnovate Ideathon" }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Something went wrong");
      }
      setStatus("success");
      setForm(INITIAL);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Submission failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Outfit:wght@300;400;500;600;700&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .font-body  { font-family: 'Outfit', sans-serif; }
        html { scroll-behavior: smooth; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glow-cyan { text-shadow: 0 0 20px rgba(34,211,238,0.7), 0 0 60px rgba(34,211,238,0.3); }
        .glow-box  { box-shadow: 0 0 0 1px rgba(34,211,238,0.12), 0 8px 40px rgba(34,211,238,0.06); }
        .glow-box:hover { box-shadow: 0 0 0 1px rgba(34,211,238,0.4), 0 8px 60px rgba(34,211,238,0.12); }
        .track-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .track-card:hover:not(.locked) { transform: translateY(-4px); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.45s; }
      `}</style>

      <div className="font-body bg-[#080c14] text-white min-h-screen overflow-x-hidden">

        {/* ─── NAVBAR ─────────────────────────────────────────────── */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "bg-[#080c14]/95 backdrop-blur-md border-b border-cyan-500/10 shadow-lg shadow-black/40"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 relative">
                <Image src="/images/qdc.png" alt="QDC" fill className="object-contain" />
              </div>
              <span className="text-sm font-semibold text-white/70 group-hover:text-cyan-400 transition-colors hidden sm:block">
                Qwiklabs Developer Club
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.name}
                  onClick={() => scrollTo(l.href)}
                  className="px-4 py-2 text-sm text-white/60 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-400/5"
                >
                  {l.name}
                </button>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={() => scrollTo("#register")}
              className="hidden md:block bg-cyan-400 hover:bg-cyan-300 text-[#080c14] font-bold text-sm px-5 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-400/25"
            >
              Register Now
            </button>

            {/* Mobile burger */}
            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden bg-[#0d1117]/98 backdrop-blur-md border-t border-cyan-500/10 px-6 py-4 space-y-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.name}
                  onClick={() => scrollTo(l.href)}
                  className="w-full text-left px-4 py-3 text-sm text-white/70 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-colors"
                >
                  {l.name}
                </button>
              ))}
              <button
                onClick={() => scrollTo("#register")}
                className="w-full mt-2 bg-cyan-400 text-[#080c14] font-bold text-sm px-4 py-3 rounded-xl"
              >
                Register Now
              </button>
            </div>
          )}
        </nav>

        {/* ─── HERO ───────────────────────────────────────────────── */}
        <section
          id="home"
          className="relative min-h-screen grid-bg flex flex-col items-center justify-center text-center px-6 pt-20"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-400/4 blur-3xl pointer-events-none" />

          <p className="fade-up text-cyan-400 text-xs tracking-[0.4em] uppercase mb-6 font-semibold">
            Qwiklabs Developer Club SRMIST presents
          </p>

          <h1 className="font-pixel fade-up delay-1 text-5xl sm:text-7xl leading-tight glow-cyan text-cyan-400 mb-4">
            QWIK
            <br />
            INNOVATE
          </h1>

          <p className="fade-up delay-2 text-white/40 text-sm tracking-[0.3em] uppercase mb-6">
            — The Ideathon —
          </p>

          <p className="fade-up delay-3 text-white/55 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Pitch bold ideas. Build the future. Compete across 5 innovation tracks at SRM Institute of Science and Technology.
          </p>

          <div className="fade-up delay-3 flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => scrollTo("#register")}
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-[#080c14] font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-cyan-400/30 text-sm"
            >
              Register Now →
            </button>
            <button
              onClick={() => scrollTo("#about")}
              className="px-8 py-4 border border-white/15 hover:border-cyan-400/40 text-white/60 hover:text-white rounded-xl transition-all text-sm"
            >
              Learn More
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <span className="text-xs tracking-widest">SCROLL</span>
            <div className="w-px h-8 bg-white/30" />
          </div>
        </section>

        {/* ─── ABOUT ──────────────────────────────────────────────── */}
        <section id="about" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-cyan-400 text-xs tracking-[0.35em] uppercase mb-3 font-semibold">About</p>
            <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-10 leading-relaxed">
              What is
              <br />
              QwikInnovate?
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <p className="text-white/55 leading-relaxed text-base">
                QwikInnovate is QDC SRMIST&apos;s flagship ideathon where teams pitch innovative ideas across cutting-edge domains. Unlike a hackathon, we focus on the{" "}
                <span className="text-cyan-400">depth and impact of your idea</span> — backed by research, feasibility, and creativity.
              </p>
              <div className="space-y-4">
                {[
                  ["👥", "Teams of 2–4 members"],
                  ["🏆", "Prizes across all tracks"],
                  ["🎤", "Pitch to industry mentors"],
                  ["📍", "SRM Kattankulathur Campus"],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3 text-white/65 text-sm">
                    <span className="text-lg">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRACKS ─────────────────────────────────────────────── */}
        <section id="tracks" className="py-24 px-6 bg-[#0a0f1a]">
          <div className="max-w-5xl mx-auto">
            <p className="text-cyan-400 text-xs tracking-[0.35em] uppercase mb-3 font-semibold">Domains</p>
            <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-12 leading-relaxed">
              Innovation
              <br />
              Tracks
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRACKS.map((t) => (
                <div
                  key={t.id}
                  className={`track-card rounded-2xl border p-6 bg-[#0d1421] ${
                    t.locked
                      ? "border-white/5 opacity-40 locked"
                      : "border-white/8 glow-box"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{
                      backgroundColor: t.locked ? "#1a2030" : `${t.color}12`,
                      border: `1px solid ${t.color}25`,
                    }}
                  >
                    {t.emoji}
                  </div>
                  <h3
                    className="font-semibold text-base mb-2"
                    style={{ color: t.locked ? "#4b5563" : t.color }}
                  >
                    {t.name}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TIMELINE ───────────────────────────────────────────── */}
        <section id="timeline" className="py-24 px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-cyan-400 text-xs tracking-[0.35em] uppercase mb-3 font-semibold">Schedule</p>
            <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-12 leading-relaxed">Timeline</h2>

            <div className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-px bg-white/8" />
              <div className="space-y-8">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div
                      className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        item.done
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/15 bg-white/4"
                      }`}
                    >
                      {item.done && (
                        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-cyan-400/60 mb-1">{item.date}</p>
                      <p className={`text-sm font-medium ${item.done ? "text-white" : "text-white/45"}`}>
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── REGISTRATION FORM ──────────────────────────────────── */}
        <section id="register" ref={registerRef} className="py-24 px-6 bg-[#0a0f1a]">
          <div className="max-w-2xl mx-auto">
            <p className="text-cyan-400 text-xs tracking-[0.35em] uppercase mb-3 font-semibold">Join Us</p>
            <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-4 leading-relaxed">
              Register
              <br />
              Your Team
            </h2>
            <p className="text-white/45 text-sm mb-10">Teams of 2–4 members. One registration per team by the leader.</p>

            {/* Success */}
            {status === "success" && (
              <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-10 text-center">
                <div className="font-pixel text-cyan-400 text-2xl mb-4">GG!</div>
                <p className="text-white font-semibold text-lg mb-2">Registration Submitted 🎉</p>
                <p className="text-white/45 text-sm">
                  We&apos;ll send confirmation to your email. Get ready to innovate!
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-cyan-400 text-sm hover:underline"
                >
                  Register another team
                </button>
              </div>
            )}

            {/* Form */}
            {status !== "success" && (
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Track selection */}
                <div>
                  <label className="block text-xs font-semibold text-cyan-400/70 uppercase tracking-widest mb-3">
                    Select Track <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TRACKS.filter((t) => !t.locked).map((t) => (
                      <label
                        key={t.id}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          form.track === t.id
                            ? "border-cyan-400 bg-cyan-400/8"
                            : "border-white/8 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="track"
                          value={t.id}
                          checked={form.track === t.id}
                          onChange={handleChange}
                          className="sr-only"
                          required
                        />
                        <div className="text-xl mb-2">{t.emoji}</div>
                        <div className="text-sm font-semibold" style={{ color: t.color }}>
                          {t.name}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Team info */}
                <Fieldset legend="Team Info">
                  <InputField
                    label="Team Name"
                    name="teamName"
                    value={form.teamName}
                    onChange={handleChange}
                    placeholder="e.g. Team Nebula"
                    required
                  />
                </Fieldset>

                {/* Team leader */}
                <Fieldset legend="Team Leader" accent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="Full Name" name="leaderName" value={form.leaderName} onChange={handleChange} placeholder="Your full name" required />
                    <InputField label="Email" name="leaderEmail" type="email" value={form.leaderEmail} onChange={handleChange} placeholder="name@srmist.edu.in" required />
                    <InputField label="Phone" name="leaderPhone" type="tel" value={form.leaderPhone} onChange={handleChange} placeholder="+91 98765 43210" required />
                    <InputField label="Reg. Number" name="leaderReg" value={form.leaderReg} onChange={handleChange} placeholder="RA2211003XXXXXX" required />
                    <SelectField
                      label="Year"
                      name="leaderYear"
                      value={form.leaderYear}
                      onChange={handleChange}
                      required
                      options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
                    />
                    <InputField label="Branch" name="leaderBranch" value={form.leaderBranch} onChange={handleChange} placeholder="e.g. CSE, ECE, IT…" required />
                  </div>
                </Fieldset>

                {/* Other members */}
                <Fieldset legend="Other Members (optional)">
                  <div className="space-y-4">
                    {(
                      [
                        { nameKey: "member2" as keyof FormData, regKey: "member2Reg" as keyof FormData, label: "Member 2" },
                        { nameKey: "member3" as keyof FormData, regKey: "member3Reg" as keyof FormData, label: "Member 3" },
                        { nameKey: "member4" as keyof FormData, regKey: "member4Reg" as keyof FormData, label: "Member 4" },
                      ]
                    ).map(({ nameKey, regKey, label }) => (
                      <div key={nameKey} className="grid sm:grid-cols-2 gap-4">
                        <InputField
                          label={`${label} — Name`}
                          name={nameKey}
                          value={form[nameKey]}
                          onChange={handleChange}
                          placeholder="Full name"
                        />
                        <InputField
                          label={`${label} — Reg. No.`}
                          name={regKey}
                          value={form[regKey]}
                          onChange={handleChange}
                          placeholder="Registration number"
                        />
                      </div>
                    ))}
                  </div>
                </Fieldset>

                {/* Idea */}
                <Fieldset legend="Your Idea" accent>
                  <div className="space-y-4">
                    <InputField
                      label="Idea Title"
                      name="ideaTitle"
                      value={form.ideaTitle}
                      onChange={handleChange}
                      placeholder="Give your idea a name"
                      required
                    />
                    <div>
                      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                        Brief Description <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="ideaDesc"
                        value={form.ideaDesc}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Describe the problem you're solving and your proposed solution (100–300 words)…"
                        className="w-full bg-[#0d1421] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/75 placeholder-white/18 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition resize-none"
                      />
                    </div>
                  </div>
                </Fieldset>

                {/* Error */}
                {status === "error" && (
                  <div className="rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#080c14] font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-cyan-400/20 text-sm tracking-wide"
                >
                  {loading ? "Submitting…" : "Submit Registration →"}
                </button>

                <p className="text-center text-xs text-white/25">
                  Questions?{" "}
                  <a href="mailto:admin@qdcsrmist.in" className="text-cyan-400/60 hover:text-cyan-400 underline">
                    admin@qdcsrmist.in
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ─── FOOTER ─────────────────────────────────────────────── */}
        <footer className="border-t border-white/5 py-8 px-6 text-center space-y-2">
          <p className="text-white/25 text-xs">
            © 2025 Qwiklabs Developer Club SRMIST · QwikInnovate Ideathon
          </p>
          <Link
            href="/"
            className="text-cyan-400/40 hover:text-cyan-400 text-xs inline-block transition-colors"
          >
            ← Back to QDC Website
          </Link>
        </footer>
      </div>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Fieldset({
  legend,
  accent = false,
  children,
}: {
  legend: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border border-white/8 rounded-2xl p-6">
      <legend
        className={`text-xs font-semibold uppercase tracking-widest px-2 ${
          accent ? "text-cyan-400/60" : "text-white/35"
        }`}
      >
        {legend}
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-[#0d1421] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/75 placeholder-white/18 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-[#0d1421] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/75 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition appearance-none"
      >
        <option value="">-- Select --</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
