"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Update these once the last 2 tracks are decided ──────────────────────────
const TRACKS = [
  {
    id: "fintech",
    icon: "💳",
    name: "FinTech",
    tagline: "Redefine Money",
    color: "#f59e0b",
    bg: "#fef3c7",
    desc: "Reimagine financial systems, payments, and economic inclusion through bold technology.",
  },
  {
    id: "healthtech",
    icon: "🧬",
    name: "HealthTech",
    tagline: "Heal Smarter",
    color: "#10b981",
    bg: "#d1fae5",
    desc: "Tackle healthcare accessibility, diagnostics, and wellness with human-centred innovation.",
  },
  {
    id: "edtech",
    icon: "📚",
    name: "EdTech",
    tagline: "Learn Different",
    color: "#6366f1",
    bg: "#e0e7ff",
    desc: "Transform learning experiences and bridge the educational gap with emerging technology.",
  },
  {
    id: "tbd1",
    icon: "⏳",
    name: "Track 4",
    tagline: "Reveal Soon",
    color: "#9ca3af",
    bg: "#f3f4f6",
    desc: "A new track is being finalised. Watch our Instagram for the announcement!",
    locked: true,
  },
  {
    id: "tbd2",
    icon: "⏳",
    name: "Track 5",
    tagline: "Reveal Soon",
    color: "#9ca3af",
    bg: "#f3f4f6",
    desc: "A new track is being finalised. Watch our Instagram for the announcement!",
    locked: true,
  },
];

const NAV_LINKS = [
  { label: "Home",     href: "#home" },
  { label: "About",    href: "#about" },
  { label: "Tracks",   href: "#tracks" },
  { label: "Timeline", href: "#timeline" },
  { label: "Register", href: "#register" },
];

const TIMELINE = [
  { date: "Mar 15",  title: "Registrations Open",    sub: "Teams open for signup",           done: true  },
  { date: "Apr 01",  title: "Submission Deadline",   sub: "Close your team & idea",          done: false },
  { date: "Apr 10",  title: "Shortlist Announced",   sub: "Top teams move forward",          done: false },
  { date: "Apr 20",  title: "QwikInnovate Day",      sub: "Pitch. Compete. Innovate.",        done: false },
];

type FormData = {
  teamName: string;
  leaderName: string; leaderEmail: string; leaderPhone: string;
  leaderReg: string;  leaderYear: string;  leaderBranch: string;
  member2: string; member2Reg: string;
  member3: string; member3Reg: string;
  member4: string; member4Reg: string;
  track: string; ideaTitle: string; ideaDesc: string;
};

const BLANK: FormData = {
  teamName:"", leaderName:"", leaderEmail:"", leaderPhone:"",
  leaderReg:"", leaderYear:"", leaderBranch:"",
  member2:"", member2Reg:"", member3:"", member3Reg:"",
  member4:"", member4Reg:"", track:"", ideaTitle:"", ideaDesc:"",
};

export default function QwikInnovatePage() {
  const [form, setForm]       = useState<FormData>(BLANK);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState<"idle"|"success"|"error">("idle");
  const [errMsg, setErrMsg]   = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goto = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setStatus("idle"); setErrMsg("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, event: "QwikInnovate Ideathon 2025" }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      setStatus("success"); setForm(BLANK);
    } catch (err: unknown) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Submission failed. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* ── Fonts & Global Styles ──────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Nunito:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --gold:    #f59e0b;
          --gold-lt: #fde68a;
          --indigo:  #1e1b4b;
          --indigo2: #312e81;
          --cream:   #fffbf0;
          --ink:     #1c1917;
          --muted:   #78716c;
          --border:  #e7e5e4;
        }

        body { font-family: 'Nunito', sans-serif; background: var(--cream); color: var(--ink); }
        .syne { font-family: 'Syne', sans-serif; }

        /* Diagonal section divider */
        .clip-diagonal { clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%); }
        .clip-diagonal-r { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 88%); }

        /* Hero blob shapes */
        .blob-gold {
          position: absolute; border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%;
          background: radial-gradient(ellipse, #fde68a88 0%, transparent 70%);
          filter: blur(40px);
          animation: blobFloat 8s ease-in-out infinite;
        }
        .blob-indigo {
          position: absolute; border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%;
          background: radial-gradient(ellipse, #a5b4fc44 0%, transparent 70%);
          filter: blur(50px);
          animation: blobFloat 10s ease-in-out infinite reverse;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(20px,-20px) scale(1.05); }
        }

        /* Stagger fade-up */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up  { animation: fadeUp .65s cubic-bezier(.22,.68,0,1.2) both; }
        .d1 { animation-delay:.1s; } .d2 { animation-delay:.22s; }
        .d3 { animation-delay:.34s; } .d4 { animation-delay:.46s; }

        /* Track card */
        .track-card {
          transition: transform .25s ease, box-shadow .25s ease;
          border: 2px solid transparent;
        }
        .track-card:hover:not(.locked) {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px -10px rgba(0,0,0,.12);
        }
        .track-card.active-track { border-color: var(--gold) !important; }

        /* Timeline dot pulse */
        @keyframes ping { 75%,100% { transform:scale(1.8); opacity:0; } }
        .ping { animation: ping 1.4s cubic-bezier(0,0,.2,1) infinite; }

        /* Input focus ring */
        .qi-input:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(245,158,11,.15);
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background: #f5f0e8; }
        ::-webkit-scrollbar-thumb { background: #d6a84e; border-radius:99px; }

        /* Noise overlay */
        .noise::after {
          content:''; position:absolute; inset:0; pointer-events:none; opacity:.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* ╔═══════════════════════════════════╗
          ║            NAVBAR                 ║
          ╚═══════════════════════════════════╝ */}
      <header
        style={{
          position:"fixed", top:0, left:0, right:0, zIndex:100,
          transition:"all .3s ease",
          background: scrolled ? "rgba(255,251,240,.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid #e7e5e4" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.06)" : "none",
        }}
      >
        <div style={{
          maxWidth:1200, margin:"0 auto",
          padding:"0 32px", height:72,
          display:"flex", alignItems:"center",
          gap:32,
        }}>

          {/* ── Logo cluster ────────────────────────── */}
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none", flexShrink:0 }}>
            <div style={{ width:36, height:36, position:"relative" }}>
              <Image src="/images/qdc.png" alt="QDC" fill style={{ objectFit:"contain" }} />
            </div>
            <div style={{ lineHeight:1.2 }}>
              <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:13, color:"#1e1b4b", letterSpacing:".02em" }}>
                QWIK<span style={{ color:"#f59e0b" }}>INNOVATE</span>
              </div>
              <div style={{ fontSize:10, color:"#78716c", letterSpacing:".08em" }}>by QDC SRMIST</div>
            </div>
          </Link>

          {/* ── Spacer ──────────────────────────────── */}
          <div style={{ flex:1 }} />

          {/* ── Desktop nav ─────────────────────────── */}
          <nav style={{ display:"flex", alignItems:"center", gap:4 }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <button
                key={l.label}
                onClick={() => goto(l.href)}
                style={{
                  background:"none", border:"none", cursor:"pointer",
                  padding:"8px 16px", borderRadius:8,
                  fontFamily:"Nunito, sans-serif", fontWeight:600, fontSize:14,
                  color:"#44403c",
                  transition:"color .2s, background .2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color="#f59e0b"; (e.currentTarget as HTMLElement).style.background="rgba(245,158,11,.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color="#44403c"; (e.currentTarget as HTMLElement).style.background="none"; }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* ── CTA ─────────────────────────────────── */}
          <button
            onClick={() => goto("#register")}
            className="desktop-nav"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color:"#fff", border:"none", cursor:"pointer",
              padding:"10px 22px", borderRadius:10,
              fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:13,
              letterSpacing:".03em", flexShrink:0,
              boxShadow:"0 4px 16px rgba(245,158,11,.35)",
              transition:"transform .2s, box-shadow .2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(245,158,11,.45)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(245,158,11,.35)"; }}
          >
            Register Now ↗
          </button>

          {/* ── Mobile burger ──────────────────────── */}
          <button
            className="mobile-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display:"none", background:"none", border:"none", cursor:"pointer", padding:4 }}
          >
            <svg width="24" height="24" fill="none" stroke="#1e1b4b" strokeWidth="2">
              {menuOpen
                ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
                : <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>}
            </svg>
          </button>
        </div>

        {/* ── Mobile dropdown ─────────────────────── */}
        {menuOpen && (
          <div style={{
            background:"rgba(255,251,240,.98)", backdropFilter:"blur(20px)",
            borderTop:"1px solid #e7e5e4", padding:"16px 24px 24px",
          }}>
            {NAV_LINKS.map(l => (
              <button
                key={l.label}
                onClick={() => goto(l.href)}
                style={{
                  display:"block", width:"100%", textAlign:"left",
                  background:"none", border:"none", cursor:"pointer",
                  padding:"12px 16px", borderRadius:8, marginBottom:4,
                  fontFamily:"Nunito, sans-serif", fontWeight:600, fontSize:15,
                  color:"#44403c",
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => goto("#register")}
              style={{
                display:"block", width:"100%", marginTop:8,
                background:"linear-gradient(135deg,#f59e0b,#d97706)",
                color:"#fff", border:"none", cursor:"pointer",
                padding:"13px 20px", borderRadius:10,
                fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:14,
              }}
            >
              Register Now ↗
            </button>
          </div>
        )}

        {/* Responsive styles */}
        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-burger { display: block !important; }
          }
        `}</style>
      </header>

      {/* ╔═══════════════════════════════════╗
          ║              HERO                 ║
          ╚═══════════════════════════════════╝ */}
      <section
        id="home"
        className="noise clip-diagonal"
        style={{
          position:"relative", overflow:"hidden", minHeight:"100vh",
          background:"linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)",
          display:"flex", alignItems:"center", paddingTop:72,
        }}
      >
        {/* Blobs */}
        <div className="blob-gold" style={{ width:600, height:600, top:-100, right:-100 }} />
        <div className="blob-indigo" style={{ width:500, height:500, bottom:-50, left:-80 }} />
        {/* Gold circle accent */}
        <div style={{
          position:"absolute", top:120, right:"8%",
          width:320, height:320, borderRadius:"50%",
          border:"1px solid rgba(245,158,11,.2)",
        }} />
        <div style={{
          position:"absolute", top:160, right:"11%",
          width:220, height:220, borderRadius:"50%",
          border:"1px solid rgba(245,158,11,.12)",
        }} />

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 32px", position:"relative", zIndex:1 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"center" }}>

            {/* Left — text */}
            <div>
              {/* Badge */}
              <div
                className="fade-up"
                style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"rgba(245,158,11,.15)", border:"1px solid rgba(245,158,11,.3)",
                  borderRadius:99, padding:"6px 16px", marginBottom:32,
                }}
              >
                <span style={{ width:6, height:6, background:"#f59e0b", borderRadius:"50%", display:"block" }} />
                <span style={{ fontFamily:"Nunito, sans-serif", fontWeight:600, fontSize:12, color:"#fde68a", letterSpacing:".1em" }}>
                  QDC SRMIST · IDEATHON 2025
                </span>
              </div>

              {/* Title */}
              <h1
                className="syne fade-up d1"
                style={{
                  fontSize:"clamp(52px, 8vw, 96px)",
                  fontWeight:800, lineHeight:.95,
                  color:"#fff", marginBottom:8,
                  letterSpacing:"-.02em",
                }}
              >
                QWIK
              </h1>
              <h1
                className="syne fade-up d2"
                style={{
                  fontSize:"clamp(52px, 8vw, 96px)",
                  fontWeight:800, lineHeight:.95,
                  background:"linear-gradient(135deg, #f59e0b, #fde68a)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  marginBottom:32, letterSpacing:"-.02em",
                }}
              >
                INNOVATE
              </h1>

              <p
                className="fade-up d3"
                style={{
                  fontFamily:"Nunito, sans-serif", fontSize:18, fontWeight:400,
                  color:"rgba(255,255,255,.65)", lineHeight:1.7,
                  maxWidth:480, marginBottom:40,
                }}
              >
                The ideathon where bold thinking meets real impact. Compete across 5 tracks, pitch to mentors, and build the future — right here at SRMIST.
              </p>

              {/* Buttons */}
              <div className="fade-up d4" style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                <button
                  onClick={() => goto("#register")}
                  style={{
                    background:"linear-gradient(135deg, #f59e0b, #d97706)",
                    color:"#fff", border:"none", cursor:"pointer",
                    padding:"14px 32px", borderRadius:12,
                    fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:15,
                    boxShadow:"0 8px 32px rgba(245,158,11,.4)",
                    transition:"transform .2s, box-shadow .2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="none"; }}
                >
                  Register Your Team →
                </button>
                <button
                  onClick={() => goto("#tracks")}
                  style={{
                    background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.8)",
                    border:"1px solid rgba(255,255,255,.2)", cursor:"pointer",
                    padding:"14px 32px", borderRadius:12,
                    fontFamily:"Nunito, sans-serif", fontWeight:600, fontSize:15,
                    transition:"background .2s, border-color .2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.14)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.08)"; }}
                >
                  Explore Tracks
                </button>
              </div>

              {/* Stats */}
              <div className="fade-up d4" style={{ display:"flex", gap:40, marginTop:56, paddingTop:40, borderTop:"1px solid rgba(255,255,255,.1)", flexWrap:"wrap" }}>
                {[["5","Innovation Tracks"],["2–4","Members/Team"],["🏆","Prizes & Recognition"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:28, color:"#f59e0b" }}>{n}</div>
                    <div style={{ fontFamily:"Nunito, sans-serif", fontSize:13, color:"rgba(255,255,255,.5)", marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — decorative card */}
            <div style={{ display:"none" }} className="hero-deco" />
          </div>
        </div>

        <style>{`@media(min-width:900px){.hero-deco{display:block!important;}}`}</style>
      </section>

      {/* ╔═══════════════════════════════════╗
          ║              ABOUT                ║
          ╚═══════════════════════════════════╝ */}
      <section id="about" style={{ padding:"100px 32px", background:"#fffbf0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>

          {/* Left */}
          <div>
            <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:11, color:"#f59e0b", letterSpacing:".25em", textTransform:"uppercase", marginBottom:16 }}>
              About the Event
            </div>
            <h2 className="syne" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:800, color:"#1e1b4b", lineHeight:1.1, marginBottom:24 }}>
              Ideas that can<br />change the world.
            </h2>
            <p style={{ fontFamily:"Nunito, sans-serif", fontSize:17, color:"#57534e", lineHeight:1.8, marginBottom:20 }}>
              QwikInnovate is QDC SRMIST&apos;s premier ideathon — a space where creative thinkers, problem solvers, and future founders come together to pitch ideas that matter.
            </p>
            <p style={{ fontFamily:"Nunito, sans-serif", fontSize:16, color:"#78716c", lineHeight:1.8 }}>
              Unlike a hackathon, we judge the <strong style={{ color:"#1e1b4b" }}>depth, originality, and impact</strong> of your idea — not just the code. Research it, design it, and present it to a panel of industry experts.
            </p>
          </div>

          {/* Right — highlights */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              ["👥","2–4 Members","Form your dream team"],
              ["🎤","Pitch Live","Present to industry mentors"],
              ["🏆","Win Prizes","Across all 5 tracks"],
              ["📍","On Campus","SRM Kattankulathur"],
            ].map(([ico,title,sub]) => (
              <div
                key={title}
                style={{
                  background:"#fff", borderRadius:16, padding:"24px 20px",
                  border:"1px solid #e7e5e4",
                  boxShadow:"0 2px 12px rgba(0,0,0,.04)",
                  transition:"transform .2s, box-shadow .2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 12px 40px rgba(0,0,0,.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.boxShadow="0 2px 12px rgba(0,0,0,.04)"; }}
              >
                <div style={{ fontSize:28, marginBottom:12 }}>{ico}</div>
                <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:15, color:"#1c1917", marginBottom:4 }}>{title}</div>
                <div style={{ fontFamily:"Nunito, sans-serif", fontSize:13, color:"#9ca3af" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive */}
        <style>{`@media(max-width:768px){#about > div{grid-template-columns:1fr!important;gap:48px!important;}}`}</style>
      </section>

      {/* ╔═══════════════════════════════════╗
          ║             TRACKS                ║
          ╚═══════════════════════════════════╝ */}
      <section
        id="tracks"
        style={{
          padding:"100px 32px",
          background:"linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)",
          position:"relative", overflow:"hidden",
        }}
      >
        {/* Gold arc decoration */}
        <div style={{
          position:"absolute", top:-200, right:-200,
          width:600, height:600, borderRadius:"50%",
          border:"1px solid rgba(245,158,11,.1)",
          pointerEvents:"none",
        }}/>

        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ marginBottom:64, display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:24 }}>
            <div>
              <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:11, color:"#f59e0b", letterSpacing:".25em", textTransform:"uppercase", marginBottom:16 }}>
                Innovation Domains
              </div>
              <h2 className="syne" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:800, color:"#fff", lineHeight:1.1 }}>
                Choose your<br />battleground.
              </h2>
            </div>
            <p style={{ fontFamily:"Nunito, sans-serif", fontSize:15, color:"rgba(255,255,255,.5)", maxWidth:320, lineHeight:1.7 }}>
              Five tracks. Five opportunities. Pick the domain where your idea can create the most change.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:20 }}>
            {TRACKS.map((t) => (
              <div
                key={t.id}
                className={`track-card ${t.locked ? "locked" : ""}`}
                style={{
                  background: t.locked ? "rgba(255,255,255,.04)" : "#fff",
                  borderRadius:20, padding:"28px 24px",
                  border: t.locked ? "1px dashed rgba(255,255,255,.1)" : "2px solid transparent",
                  opacity: t.locked ? 0.5 : 1,
                  cursor: t.locked ? "default" : "pointer",
                }}
              >
                <div
                  style={{
                    width:52, height:52, borderRadius:14,
                    background: t.locked ? "rgba(255,255,255,.06)" : t.bg,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:24, marginBottom:20,
                  }}
                >
                  {t.icon}
                </div>
                <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:11, color: t.locked ? "rgba(255,255,255,.3)" : t.color, letterSpacing:".15em", textTransform:"uppercase", marginBottom:6 }}>
                  {t.tagline}
                </div>
                <div style={{ fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:18, color: t.locked ? "rgba(255,255,255,.2)" : "#1c1917", marginBottom:10 }}>
                  {t.name}
                </div>
                <div style={{ fontFamily:"Nunito, sans-serif", fontSize:13, color: t.locked ? "rgba(255,255,255,.2)" : "#78716c", lineHeight:1.6 }}>
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`@media(max-width:640px){#tracks .track-card{border-radius:16px;padding:22px 18px;}}`}</style>
      </section>

      {/* ╔═══════════════════════════════════╗
          ║            TIMELINE               ║
          ╚═══════════════════════════════════╝ */}
      <section id="timeline" style={{ padding:"100px 32px", background:"#fffbf0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:11, color:"#f59e0b", letterSpacing:".25em", textTransform:"uppercase", marginBottom:16 }}>
              Key Dates
            </div>
            <h2 className="syne" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:800, color:"#1e1b4b", lineHeight:1.1 }}>
              Mark your calendar.
            </h2>
          </div>

          {/* Horizontal timeline */}
          <div style={{ position:"relative" }}>
            {/* Connecting line */}
            <div style={{
              position:"absolute", top:28, left:"12.5%", right:"12.5%", height:2,
              background:"linear-gradient(90deg, #f59e0b, #6366f1)",
              borderRadius:2,
            }}/>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ textAlign:"center", paddingTop:0 }}>
                  {/* Dot */}
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
                    <div style={{ position:"relative" }}>
                      {item.done && (
                        <div
                          className="ping"
                          style={{
                            position:"absolute", inset:-4,
                            borderRadius:"50%", background:"rgba(245,158,11,.3)",
                          }}
                        />
                      )}
                      <div
                        style={{
                          width:56, height:56, borderRadius:"50%",
                          background: item.done
                            ? "linear-gradient(135deg, #f59e0b, #d97706)"
                            : "#fff",
                          border: item.done ? "none" : "2px solid #e7e5e4",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          boxShadow: item.done ? "0 8px 24px rgba(245,158,11,.4)" : "0 2px 12px rgba(0,0,0,.06)",
                          fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:16,
                          color: item.done ? "#fff" : "#c7c3bd",
                          position:"relative", zIndex:1,
                        }}
                      >
                        {i + 1}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:12, color:"#f59e0b", letterSpacing:".1em", marginBottom:8 }}>
                    {item.date}
                  </div>
                  <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:15, color:"#1e1b4b", marginBottom:6 }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily:"Nunito, sans-serif", fontSize:13, color:"#9ca3af" }}>
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`@media(max-width:640px){#timeline > div > div:last-child{grid-template-columns:1fr 1fr!important;} #timeline > div > div > div:first-child{display:none!important;}}`}</style>
      </section>

      {/* ╔═══════════════════════════════════╗
          ║        REGISTRATION FORM          ║
          ╚═══════════════════════════════════╝ */}
      <section
        id="register"
        style={{
          padding:"100px 32px",
          background:"linear-gradient(160deg, #fffbf0 0%, #fef3c7 100%)",
          position:"relative", overflow:"hidden",
        }}
      >
        {/* Decorative circle */}
        <div style={{
          position:"absolute", bottom:-200, right:-200,
          width:600, height:600, borderRadius:"50%",
          background:"rgba(245,158,11,.06)", pointerEvents:"none",
        }}/>

        <div style={{ maxWidth:720, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:11, color:"#f59e0b", letterSpacing:".25em", textTransform:"uppercase", marginBottom:16 }}>
              Join Us
            </div>
            <h2 className="syne" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:"#1e1b4b", lineHeight:1.1, marginBottom:16 }}>
              Register Your Team
            </h2>
            <p style={{ fontFamily:"Nunito, sans-serif", fontSize:16, color:"#78716c" }}>
              2–4 members per team. Filled by the team leader.
            </p>
          </div>

          {/* ── SUCCESS ── */}
          {status === "success" && (
            <div style={{
              background:"#fff", borderRadius:24, padding:"56px 40px", textAlign:"center",
              border:"2px solid #fde68a", boxShadow:"0 20px 60px rgba(245,158,11,.12)",
            }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
              <h3 className="syne" style={{ fontSize:28, fontWeight:800, color:"#1e1b4b", marginBottom:10 }}>
                You&apos;re In!
              </h3>
              <p style={{ fontFamily:"Nunito, sans-serif", color:"#78716c", fontSize:16, marginBottom:28 }}>
                Registration submitted. We&apos;ll confirm to your email shortly. Get ready to innovate!
              </p>
              <button
                onClick={() => setStatus("idle")}
                style={{
                  background:"none", border:"2px solid #f59e0b", color:"#d97706",
                  padding:"10px 28px", borderRadius:10, cursor:"pointer",
                  fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:14,
                }}
              >
                Register Another Team
              </button>
            </div>
          )}

          {/* ── FORM ── */}
          {status !== "success" && (
            <form
              onSubmit={onSubmit}
              style={{
                background:"#fff", borderRadius:24, padding:"48px 40px",
                boxShadow:"0 20px 80px rgba(0,0,0,.08)",
                border:"1px solid rgba(245,158,11,.15)",
              }}
            >
              {/* Track radios */}
              <FormSection label="Select Track" accent>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
                  {TRACKS.filter(t => !t.locked).map(t => (
                    <label
                      key={t.id}
                      style={{
                        cursor:"pointer", borderRadius:14, padding:"16px 14px",
                        border:`2px solid ${form.track === t.id ? t.color : "#e7e5e4"}`,
                        background: form.track === t.id ? t.bg : "#fafaf9",
                        transition:"all .2s", textAlign:"center",
                        boxShadow: form.track === t.id ? `0 4px 20px ${t.color}25` : "none",
                      }}
                    >
                      <input type="radio" name="track" value={t.id} checked={form.track === t.id} onChange={onChange} required className="sr-only" />
                      <div style={{ fontSize:22, marginBottom:6 }}>{t.icon}</div>
                      <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:13, color: form.track === t.id ? t.color : "#44403c" }}>{t.name}</div>
                    </label>
                  ))}
                </div>
              </FormSection>

              <Divider />

              {/* Team name */}
              <FormSection label="Team Name">
                <QInput label="Team Name" name="teamName" value={form.teamName} onChange={onChange} placeholder="e.g. Team Nebula" required />
              </FormSection>

              <Divider />

              {/* Team leader */}
              <FormSection label="Team Leader" accent>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <QInput label="Full Name"       name="leaderName"   value={form.leaderName}   onChange={onChange} placeholder="Your name"           required />
                  <QInput label="Email"            name="leaderEmail"  value={form.leaderEmail}  onChange={onChange} placeholder="name@srmist.edu.in"  required type="email" />
                  <QInput label="Phone"            name="leaderPhone"  value={form.leaderPhone}  onChange={onChange} placeholder="+91 98765 43210"      required type="tel" />
                  <QInput label="Reg. Number"      name="leaderReg"    value={form.leaderReg}    onChange={onChange} placeholder="RA2211003XXXXXX"      required />
                  <QSelect label="Year"            name="leaderYear"   value={form.leaderYear}   onChange={onChange} required options={["1st Year","2nd Year","3rd Year","4th Year"]} />
                  <QInput label="Branch"           name="leaderBranch" value={form.leaderBranch} onChange={onChange} placeholder="e.g. CSE, ECE, IT"   required />
                </div>
              </FormSection>

              <Divider />

              {/* Other members */}
              <FormSection label="Other Members (Optional)">
                {([
                  { nk:"member2" as keyof FormData, rk:"member2Reg" as keyof FormData, label:"Member 2" },
                  { nk:"member3" as keyof FormData, rk:"member3Reg" as keyof FormData, label:"Member 3" },
                  { nk:"member4" as keyof FormData, rk:"member4Reg" as keyof FormData, label:"Member 4" },
                ]).map(({ nk, rk, label }) => (
                  <div key={nk} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                    <QInput label={`${label} — Name`}    name={nk} value={form[nk]} onChange={onChange} placeholder="Full name" />
                    <QInput label={`${label} — Reg. No`} name={rk} value={form[rk]} onChange={onChange} placeholder="Reg. number" />
                  </div>
                ))}
              </FormSection>

              <Divider />

              {/* Idea */}
              <FormSection label="Your Idea" accent>
                <QInput label="Idea Title" name="ideaTitle" value={form.ideaTitle} onChange={onChange} placeholder="Give your idea a punchy name" required />
                <div style={{ marginTop:16 }}>
                  <label style={{ display:"block", fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:11, color:"#9ca3af", letterSpacing:".15em", textTransform:"uppercase", marginBottom:8 }}>
                    Brief Description <span style={{ color:"#ef4444" }}>*</span>
                  </label>
                  <textarea
                    name="ideaDesc" value={form.ideaDesc} onChange={onChange} required rows={4}
                    placeholder="Problem you're solving + your proposed solution (100–300 words)…"
                    className="qi-input"
                    style={{
                      width:"100%", background:"#fafaf9",
                      border:"1.5px solid #e7e5e4", borderRadius:10,
                      padding:"12px 14px", fontSize:14, color:"#1c1917",
                      fontFamily:"Nunito, sans-serif", resize:"none",
                    }}
                  />
                </div>
              </FormSection>

              {/* Error */}
              {status === "error" && (
                <div style={{
                  marginTop:24, background:"#fef2f2", border:"1px solid #fca5a5",
                  borderRadius:10, padding:"12px 16px",
                  fontFamily:"Nunito, sans-serif", fontSize:14, color:"#dc2626",
                }}>
                  ⚠️ {errMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop:32, width:"100%",
                  background: loading ? "#e7e5e4" : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: loading ? "#9ca3af" : "#fff",
                  border:"none", cursor: loading ? "not-allowed" : "pointer",
                  padding:"16px 32px", borderRadius:12,
                  fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:16,
                  boxShadow: loading ? "none" : "0 8px 32px rgba(245,158,11,.35)",
                  transition:"all .2s", letterSpacing:".03em",
                }}
                onMouseEnter={e => { if(!loading)(e.currentTarget as HTMLElement).style.transform="translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="none"; }}
              >
                {loading ? "Submitting…" : "Submit Registration →"}
              </button>

              <p style={{ textAlign:"center", marginTop:20, fontFamily:"Nunito, sans-serif", fontSize:13, color:"#c7c3bd" }}>
                Questions?{" "}
                <a href="mailto:admin@qdcsrmist.in" style={{ color:"#d97706", textDecoration:"none", fontWeight:600 }}>
                  admin@qdcsrmist.in
                </a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{
        background:"#1e1b4b", padding:"40px 32px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:16,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, position:"relative" }}>
            <Image src="/images/qdc.png" alt="QDC" fill style={{ objectFit:"contain" }} />
          </div>
          <div>
            <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:13, color:"#fff" }}>
              QWIK<span style={{ color:"#f59e0b" }}>INNOVATE</span>
            </div>
            <div style={{ fontFamily:"Nunito, sans-serif", fontSize:11, color:"rgba(255,255,255,.35)" }}>
              Qwiklabs Developer Club SRMIST
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
          <Link href="/" style={{ fontFamily:"Nunito, sans-serif", fontSize:13, color:"rgba(255,255,255,.4)", textDecoration:"none" }}>← QDC Website</Link>
          <a href="https://www.instagram.com/qdc_srmist/" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"Nunito, sans-serif", fontSize:13, color:"rgba(255,255,255,.4)", textDecoration:"none" }}>Instagram</a>
          <a href="mailto:admin@qdcsrmist.in" style={{ fontFamily:"Nunito, sans-serif", fontSize:13, color:"rgba(255,255,255,.4)", textDecoration:"none" }}>Contact</a>
        </div>
        <div style={{ fontFamily:"Nunito, sans-serif", fontSize:12, color:"rgba(255,255,255,.25)", width:"100%" }}>
          © 2025 Qwiklabs Developer Club SRMIST · All rights reserved
        </div>
      </footer>
    </>
  );
}

// ─── Helper sub-components ────────────────────────────────────────────────────

function FormSection({ label, accent = false, children }: { label: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <div style={{
        fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:10,
        color: accent ? "#d97706" : "#9ca3af",
        letterSpacing:".2em", textTransform:"uppercase", marginBottom:16,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height:1, background:"#f3f0eb", margin:"28px 0" }} />;
}

function QInput({ label, name, value, onChange, placeholder, type="text", required=false }:{
  label:string; name:string; value:string;
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  placeholder?:string; type?:string; required?:boolean;
}) {
  return (
    <div>
      <label style={{ display:"block", fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:10, color:"#9ca3af", letterSpacing:".15em", textTransform:"uppercase", marginBottom:8 }}>
        {label} {required && <span style={{ color:"#ef4444" }}>*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        className="qi-input"
        style={{
          width:"100%", background:"#fafaf9",
          border:"1.5px solid #e7e5e4", borderRadius:10,
          padding:"11px 14px", fontSize:14, color:"#1c1917",
          fontFamily:"Nunito, sans-serif",
        }}
      />
    </div>
  );
}

function QSelect({ label, name, value, onChange, options, required=false }:{
  label:string; name:string; value:string;
  onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;
  options:string[]; required?:boolean;
}) {
  return (
    <div>
      <label style={{ display:"block", fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:10, color:"#9ca3af", letterSpacing:".15em", textTransform:"uppercase", marginBottom:8 }}>
        {label} {required && <span style={{ color:"#ef4444" }}>*</span>}
      </label>
      <select
        name={name} value={value} onChange={onChange} required={required}
        className="qi-input"
        style={{
          width:"100%", background:"#fafaf9",
          border:"1.5px solid #e7e5e4", borderRadius:10,
          padding:"11px 14px", fontSize:14, color: value ? "#1c1917" : "#9ca3af",
          fontFamily:"Nunito, sans-serif", appearance:"none",
        }}
      >
        <option value="">-- Select --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
