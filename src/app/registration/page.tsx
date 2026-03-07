"use client";

import { useState } from "react";
import Link from "next/link";

const TRACKS = [
  { id: "fintech",    icon: "💳", name: "FinTech",    tagline: "Redefine Money",   color: "#f59e0b", bg: "#fef3c7", desc: "Reimagine financial systems, payments, and economic inclusion through bold technology.", locked: false },
  { id: "healthtech", icon: "🧬", name: "HealthTech", tagline: "Heal Smarter",     color: "#10b981", bg: "#d1fae5", desc: "Tackle healthcare accessibility, diagnostics, and wellness with human-centred innovation.", locked: false },
  { id: "edtech",     icon: "📚", name: "EdTech",     tagline: "Learn Different",  color: "#6366f1", bg: "#e0e7ff", desc: "Transform learning experiences and bridge the educational gap with emerging technology.",   locked: false },
  { id: "tbd1",       icon: "⏳", name: "Track 4",    tagline: "Reveal Soon",      color: "#9ca3af", bg: "#f3f4f6", desc: "Being finalised — follow our Instagram for the announcement!", locked: true  },
  { id: "tbd2",       icon: "⏳", name: "Track 5",    tagline: "Reveal Soon",      color: "#9ca3af", bg: "#f3f4f6", desc: "Being finalised — follow our Instagram for the announcement!", locked: true  },
];

const TIMELINE = [
  { date: "Mar 15",  title: "Registrations Open",  sub: "Teams open for signup",   done: true  },
  { date: "Apr 01",  title: "Submission Deadline", sub: "Close your team & idea",  done: false },
  { date: "Apr 10",  title: "Shortlist Announced", sub: "Top teams move forward",  done: false },
  { date: "Apr 20",  title: "QwikInnovate Day",    sub: "Pitch. Compete. Win.",     done: false },
];

type F = {
  teamName: string;
  leaderName: string; leaderEmail: string; leaderPhone: string;
  leaderReg: string;  leaderYear: string;  leaderBranch: string;
  member2: string; member2Reg: string;
  member3: string; member3Reg: string;
  member4: string; member4Reg: string;
  track: string; ideaTitle: string; ideaDesc: string;
};
const BLANK: F = { teamName:"", leaderName:"", leaderEmail:"", leaderPhone:"", leaderReg:"", leaderYear:"", leaderBranch:"", member2:"", member2Reg:"", member3:"", member3Reg:"", member4:"", member4Reg:"", track:"", ideaTitle:"", ideaDesc:"" };

export default function QwikInnovatePage() {
  const [form, setForm]       = useState<F>(BLANK);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState<"idle"|"success"|"error">("idle");
  const [errMsg, setErrMsg]   = useState("");

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Nunito:wght@300;400;500;600;700&display=swap');
        .qi-syne  { font-family: 'Syne', sans-serif; }
        .qi-body  { font-family: 'Nunito', sans-serif; }
        html { scroll-behavior: smooth; }

        .qi-blob-gold {
          position: absolute; border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%;
          background: radial-gradient(ellipse, rgba(253,230,138,.5) 0%, transparent 70%);
          filter: blur(48px);
          animation: qiBlob 9s ease-in-out infinite;
          pointer-events: none;
        }
        .qi-blob-indigo {
          position: absolute; border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%;
          background: radial-gradient(ellipse, rgba(165,180,252,.3) 0%, transparent 70%);
          filter: blur(56px);
          animation: qiBlob 11s ease-in-out infinite reverse;
          pointer-events: none;
        }
        @keyframes qiBlob {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(18px,-18px) scale(1.04); }
        }

        @keyframes qiFadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .qi-fu   { animation: qiFadeUp .65s cubic-bezier(.22,.68,0,1.2) both; }
        .qi-d1   { animation-delay:.1s; }
        .qi-d2   { animation-delay:.22s; }
        .qi-d3   { animation-delay:.34s; }
        .qi-d4   { animation-delay:.48s; }

        .qi-track-card { transition: transform .22s ease, box-shadow .22s ease; }
        .qi-track-card:not(.locked):hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,.12); }

        .qi-highlight-card { transition: transform .2s ease, box-shadow .2s ease; }
        .qi-highlight-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,.1); }

        @keyframes qiPing { 75%,100% { transform:scale(1.9); opacity:0; } }
        .qi-ping { animation: qiPing 1.5s ease-out infinite; }

        .qi-input {
          width: 100%; background: #fafaf9;
          border: 1.5px solid #e7e5e4; border-radius: 10px;
          padding: 11px 14px; font-size: 14px; color: #1c1917;
          font-family: 'Nunito', sans-serif;
          transition: border-color .2s, box-shadow .2s;
          outline: none;
        }
        .qi-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245,158,11,.14);
        }
        .qi-input::placeholder { color: #c7c3bd; }

        .qi-btn-primary {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff; border: none; cursor: pointer;
          padding: 14px 32px; border-radius: 12px;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
          box-shadow: 0 8px 28px rgba(245,158,11,.38);
          transition: transform .2s, box-shadow .2s;
          letter-spacing: .02em;
        }
        .qi-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(245,158,11,.45); }
        .qi-btn-secondary {
          background: rgba(255,255,255,.1); color: rgba(255,255,255,.75);
          border: 1px solid rgba(255,255,255,.2); cursor: pointer;
          padding: 14px 32px; border-radius: 12px;
          font-family: 'Nunito', sans-serif; font-weight: 600; font-size: 15px;
          transition: background .2s;
        }
        .qi-btn-secondary:hover { background: rgba(255,255,255,.16); }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f5f0e8; }
        ::-webkit-scrollbar-thumb { background: #d6a84e; border-radius: 99px; }
      `}</style>

      <div className="qi-body" style={{ background: "#fffbf0", color: "#1c1917" }}>

        {/* ══════════════════════════════════════
            HERO  — deep indigo + gold
        ══════════════════════════════════════ */}
        <section
          id="home"
          style={{
            position: "relative", overflow: "hidden", minHeight: "100vh",
            background: "linear-gradient(150deg, #1e1b4b 0%, #2d2a6e 45%, #1e1b4b 100%)",
            display: "flex", alignItems: "center",
          }}
        >
          <div className="qi-blob-gold"  style={{ width: 580, height: 580, top: -80, right: -100 }} />
          <div className="qi-blob-indigo" style={{ width: 440, height: 440, bottom: -60, left: -60 }} />
          {/* Decorative ring */}
          <div style={{ position:"absolute", top:"50%", right:"6%", transform:"translateY(-50%)", width: 380, height: 380, borderRadius:"50%", border:"1px solid rgba(245,158,11,.15)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"50%", right:"6%", transform:"translateY(-50%)", width: 260, height: 260, borderRadius:"50%", border:"1px solid rgba(245,158,11,.08)", pointerEvents:"none" }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px 80px", position: "relative", zIndex: 1, width: "100%" }}>
            {/* Badge */}
            <div className="qi-fu" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(245,158,11,.14)", border: "1px solid rgba(245,158,11,.28)",
              borderRadius: 99, padding: "6px 18px", marginBottom: 36,
            }}>
              <span style={{ width: 6, height: 6, background: "#f59e0b", borderRadius: "50%", display: "block" }} />
              <span className="qi-syne" style={{ fontSize: 11, color: "#fde68a", letterSpacing: ".12em", fontWeight: 700 }}>
                QDC SRMIST · IDEATHON 2025
              </span>
            </div>

            {/* Title */}
            <h1 className="qi-syne qi-fu qi-d1" style={{
              fontSize: "clamp(60px, 9vw, 108px)", fontWeight: 800,
              color: "#fff", lineHeight: .9, letterSpacing: "-.025em", marginBottom: 6,
            }}>
              QWIK
            </h1>
            <h1 className="qi-syne qi-fu qi-d2" style={{
              fontSize: "clamp(60px, 9vw, 108px)", fontWeight: 800,
              background: "linear-gradient(135deg, #f59e0b 0%, #fde68a 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              lineHeight: .9, letterSpacing: "-.025em", marginBottom: 36,
            }}>
              INNOVATE
            </h1>

            <p className="qi-fu qi-d3" style={{
              fontSize: 18, color: "rgba(255,255,255,.62)", lineHeight: 1.75,
              maxWidth: 480, marginBottom: 40, fontWeight: 400,
            }}>
              The ideathon where bold thinking meets real impact. Compete across 5 tracks, pitch to mentors, and build the future — right here at SRMIST.
            </p>

            <div className="qi-fu qi-d4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#register">
                <button className="qi-btn-primary">Register Your Team →</button>
              </a>
              <a href="#tracks">
                <button className="qi-btn-secondary">Explore Tracks</button>
              </a>
            </div>

            {/* Stats */}
            <div className="qi-fu qi-d4" style={{
              display: "flex", gap: 48, marginTop: 64,
              paddingTop: 40, borderTop: "1px solid rgba(255,255,255,.1)",
              flexWrap: "wrap",
            }}>
              {[["5","Innovation Tracks"],["2–4","Members / Team"],["🏆","Prizes & Recognition"]].map(([n,l]) => (
                <div key={l}>
                  <div className="qi-syne" style={{ fontSize: 30, fontWeight: 800, color: "#f59e0b" }}>{n}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            ABOUT  — warm cream
        ══════════════════════════════════════ */}
        <section id="about" style={{ padding: "96px 40px", background: "#fffbf0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p className="qi-syne" style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: ".25em", textTransform: "uppercase", marginBottom: 16 }}>
                About the Event
              </p>
              <h2 className="qi-syne" style={{ fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 800, color: "#1e1b4b", lineHeight: 1.1, marginBottom: 24 }}>
                Ideas that can<br />change the world.
              </h2>
              <p style={{ fontSize: 17, color: "#57534e", lineHeight: 1.8, marginBottom: 18 }}>
                QwikInnovate is QDC SRMIST&apos;s premier ideathon — where creative thinkers, problem solvers, and future founders come together to pitch ideas that matter.
              </p>
              <p style={{ fontSize: 15, color: "#78716c", lineHeight: 1.8 }}>
                We judge the <strong style={{ color: "#1e1b4b" }}>depth, originality, and real-world impact</strong> of your idea — not just the code. Research it, design it, present it.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                ["👥","2–4 Members","Form your dream team"],
                ["🎤","Pitch Live","Present to industry mentors"],
                ["🏆","Win Prizes","Across all 5 tracks"],
                ["📍","On Campus","SRM Kattankulathur"],
              ].map(([ico,title,sub]) => (
                <div
                  key={title}
                  className="qi-highlight-card"
                  style={{
                    background: "#fff", borderRadius: 16, padding: "24px 20px",
                    border: "1px solid #ede9e3",
                    boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{ico}</div>
                  <div className="qi-syne" style={{ fontSize: 15, fontWeight: 700, color: "#1c1917", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#a8a29e" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <style>{`@media(max-width:768px){#about > div{grid-template-columns:1fr!important; gap:48px!important;}}`}</style>
        </section>

        {/* ══════════════════════════════════════
            TRACKS  — deep indigo
        ══════════════════════════════════════ */}
        <section id="tracks" style={{
          padding: "96px 40px",
          background: "linear-gradient(155deg, #1e1b4b 0%, #312e81 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position:"absolute", top:-200, right:-200, width:600, height:600, borderRadius:"50%", border:"1px solid rgba(245,158,11,.08)", pointerEvents:"none" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: 56, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
              <div>
                <p className="qi-syne" style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: ".25em", textTransform: "uppercase", marginBottom: 16 }}>
                  Innovation Domains
                </p>
                <h2 className="qi-syne" style={{ fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                  Choose your<br />battleground.
                </h2>
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.45)", maxWidth: 300, lineHeight: 1.7 }}>
                Five tracks. Five opportunities. Pick the domain where your idea creates the most change.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 18 }}>
              {TRACKS.map(t => (
                <div
                  key={t.id}
                  className={`qi-track-card ${t.locked ? "locked" : ""}`}
                  style={{
                    background: t.locked ? "rgba(255,255,255,.04)" : "#fff",
                    borderRadius: 20, padding: "28px 22px",
                    border: t.locked ? "1px dashed rgba(255,255,255,.1)" : "2px solid transparent",
                    opacity: t.locked ? 0.45 : 1,
                    cursor: t.locked ? "default" : "pointer",
                  }}
                >
                  <div style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: t.locked ? "rgba(255,255,255,.06)" : t.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, marginBottom: 18,
                  }}>
                    {t.icon}
                  </div>
                  <div className="qi-syne" style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: t.locked ? "rgba(255,255,255,.25)" : t.color, marginBottom: 6 }}>
                    {t.tagline}
                  </div>
                  <div className="qi-syne" style={{ fontSize: 17, fontWeight: 800, color: t.locked ? "rgba(255,255,255,.18)" : "#1c1917", marginBottom: 10 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 13, color: t.locked ? "rgba(255,255,255,.18)" : "#78716c", lineHeight: 1.6 }}>
                    {t.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            TIMELINE  — cream
        ══════════════════════════════════════ */}
        <section id="timeline" style={{ padding: "96px 40px", background: "#fffbf0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <p className="qi-syne" style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: ".25em", textTransform: "uppercase", marginBottom: 16 }}>
                Key Dates
              </p>
              <h2 className="qi-syne" style={{ fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 800, color: "#1e1b4b", lineHeight: 1.1 }}>
                Mark your calendar.
              </h2>
            </div>

            <div style={{ position: "relative" }}>
              {/* Connecting line */}
              <div style={{
                position: "absolute", top: 28, left: "12%", right: "12%", height: 2,
                background: "linear-gradient(90deg, #f59e0b, #6366f1)",
                borderRadius: 2,
              }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
                {TIMELINE.map((item, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                      <div style={{ position: "relative" }}>
                        {item.done && (
                          <div className="qi-ping" style={{
                            position: "absolute", inset: -5,
                            borderRadius: "50%", background: "rgba(245,158,11,.28)",
                          }} />
                        )}
                        <div style={{
                          width: 56, height: 56, borderRadius: "50%", position: "relative", zIndex: 1,
                          background: item.done ? "linear-gradient(135deg,#f59e0b,#d97706)" : "#fff",
                          border: item.done ? "none" : "2px solid #e7e5e4",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: item.done ? "0 8px 24px rgba(245,158,11,.38)" : "0 2px 12px rgba(0,0,0,.06)",
                        }}>
                          <span className="qi-syne" style={{ fontWeight: 800, fontSize: 16, color: item.done ? "#fff" : "#c7c3bd" }}>
                            {i + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="qi-syne" style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: ".1em", marginBottom: 8 }}>{item.date}</div>
                    <div className="qi-syne" style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#a8a29e" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <style>{`@media(max-width:640px){#timeline > div > div:last-child{grid-template-columns:1fr 1fr!important;}}`}</style>
        </section>

        {/* ══════════════════════════════════════
            REGISTRATION FORM  — gold-tinted cream
        ══════════════════════════════════════ */}
        <section id="register" style={{
          padding: "96px 40px 120px",
          background: "linear-gradient(160deg, #fffbf0 0%, #fef3c7 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position:"absolute", bottom:-200, right:-200, width:600, height:600, borderRadius:"50%", background:"rgba(245,158,11,.06)", pointerEvents:"none" }} />

          <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p className="qi-syne" style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: ".25em", textTransform: "uppercase", marginBottom: 16 }}>
                Join Us
              </p>
              <h2 className="qi-syne" style={{ fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 800, color: "#1e1b4b", lineHeight: 1.1, marginBottom: 14 }}>
                Register Your Team
              </h2>
              <p style={{ fontSize: 16, color: "#78716c" }}>
                2–4 members per team · Filled by the team leader
              </p>
            </div>

            {/* SUCCESS */}
            {status === "success" && (
              <div style={{
                background: "#fff", borderRadius: 24, padding: "56px 40px", textAlign: "center",
                border: "2px solid #fde68a", boxShadow: "0 20px 64px rgba(245,158,11,.14)",
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h3 className="qi-syne" style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", marginBottom: 10 }}>You&apos;re In!</h3>
                <p style={{ color: "#78716c", fontSize: 16, marginBottom: 28 }}>
                  Registration submitted. We&apos;ll confirm to your email shortly. Get ready to innovate!
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  style={{
                    background: "none", border: "2px solid #f59e0b", color: "#d97706",
                    padding: "10px 28px", borderRadius: 10, cursor: "pointer",
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                  }}
                >
                  Register Another Team
                </button>
              </div>
            )}

            {/* FORM */}
            {status !== "success" && (
              <form
                onSubmit={onSubmit}
                style={{
                  background: "#fff", borderRadius: 24, padding: "48px 40px",
                  boxShadow: "0 20px 80px rgba(0,0,0,.09)",
                  border: "1px solid rgba(245,158,11,.18)",
                }}
              >
                {/* Track */}
                <FLabel>Select Track <Req /></FLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
                  {TRACKS.filter(t => !t.locked).map(t => (
                    <label
                      key={t.id}
                      style={{
                        cursor: "pointer", borderRadius: 14, padding: "16px 12px",
                        border: `2px solid ${form.track === t.id ? t.color : "#e7e5e4"}`,
                        background: form.track === t.id ? t.bg : "#fafaf9",
                        transition: "all .2s", textAlign: "center",
                        boxShadow: form.track === t.id ? `0 4px 20px ${t.color}28` : "none",
                      }}
                    >
                      <input type="radio" name="track" value={t.id} checked={form.track === t.id} onChange={onChange} required className="sr-only" />
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                      <div className="qi-syne" style={{ fontSize: 12, fontWeight: 700, color: form.track === t.id ? t.color : "#44403c" }}>{t.name}</div>
                    </label>
                  ))}
                </div>

                <HR />

                {/* Team name */}
                <FLabel>Team Info</FLabel>
                <div style={{ marginBottom: 32 }}>
                  <QI label="Team Name" name="teamName" value={form.teamName} onChange={onChange} ph="e.g. Team Nebula" req />
                </div>

                <HR />

                {/* Team leader */}
                <FLabel accent>Team Leader</FLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                  <QI label="Full Name"    name="leaderName"   value={form.leaderName}   onChange={onChange} ph="Your name"          req />
                  <QI label="Email"        name="leaderEmail"  value={form.leaderEmail}  onChange={onChange} ph="name@srmist.edu.in" req type="email" />
                  <QI label="Phone"        name="leaderPhone"  value={form.leaderPhone}  onChange={onChange} ph="+91 98765 43210"    req type="tel" />
                  <QI label="Reg. Number"  name="leaderReg"    value={form.leaderReg}    onChange={onChange} ph="RA2211003XXXXXX"    req />
                  <QS label="Year"         name="leaderYear"   value={form.leaderYear}   onChange={onChange} req opts={["1st Year","2nd Year","3rd Year","4th Year"]} />
                  <QI label="Branch"       name="leaderBranch" value={form.leaderBranch} onChange={onChange} ph="CSE, ECE, IT…"     req />
                </div>

                <HR />

                {/* Other members */}
                <FLabel>Other Members <span style={{ fontSize:11, fontWeight:400, color:"#a8a29e" }}>(optional)</span></FLabel>
                <div style={{ marginBottom: 32 }}>
                  {([
                    { nk:"member2" as keyof F, rk:"member2Reg" as keyof F, lbl:"Member 2" },
                    { nk:"member3" as keyof F, rk:"member3Reg" as keyof F, lbl:"Member 3" },
                    { nk:"member4" as keyof F, rk:"member4Reg" as keyof F, lbl:"Member 4" },
                  ]).map(({ nk, rk, lbl }) => (
                    <div key={nk} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                      <QI label={`${lbl} — Name`}   name={nk} value={form[nk]} onChange={onChange} ph="Full name" />
                      <QI label={`${lbl} — Reg. No`} name={rk} value={form[rk]} onChange={onChange} ph="Reg. number" />
                    </div>
                  ))}
                </div>

                <HR />

                {/* Idea */}
                <FLabel accent>Your Idea</FLabel>
                <div style={{ marginBottom: 32 }}>
                  <QI label="Idea Title" name="ideaTitle" value={form.ideaTitle} onChange={onChange} ph="Give your idea a punchy name" req />
                  <div style={{ marginTop: 16 }}>
                    <label style={{ display:"block", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#9ca3af", letterSpacing:".18em", textTransform:"uppercase", marginBottom:8 }}>
                      Brief Description <Req />
                    </label>
                    <textarea
                      name="ideaDesc" value={form.ideaDesc} onChange={onChange} required rows={4}
                      placeholder="Problem you're solving + your proposed solution (100–300 words)…"
                      className="qi-input"
                      style={{ resize: "none" }}
                    />
                  </div>
                </div>

                {/* Error */}
                {status === "error" && (
                  <div style={{
                    marginBottom: 24, background: "#fef2f2", border: "1px solid #fca5a5",
                    borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#dc2626",
                  }}>
                    ⚠️ {errMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className={loading ? "" : "qi-btn-primary"}
                  style={{
                    width: "100%",
                    ...(loading ? {
                      background: "#e7e5e4", color: "#9ca3af", border: "none", cursor: "not-allowed",
                      padding: "16px 32px", borderRadius: 12,
                      fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16,
                    } : { padding: "16px 32px", fontSize: 16 }),
                  }}
                >
                  {loading ? "Submitting…" : "Submit Registration →"}
                </button>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#c7c3bd" }}>
                  Questions?{" "}
                  <a href="mailto:admin@qdcsrmist.in" style={{ color: "#d97706", textDecoration: "none", fontWeight: 600 }}>
                    admin@qdcsrmist.in
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────── */}
        <footer style={{
          background: "#1e1b4b", padding: "36px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div className="qi-syne" style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              QWIK<span style={{ color: "#f59e0b" }}>INNOVATE</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>Qwiklabs Developer Club SRMIST</div>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,.4)", textDecoration: "none" }}>← QDC Website</Link>
            <a href="https://www.instagram.com/qdc_srmist/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Instagram</a>
            <a href="mailto:admin@qdcsrmist.in" style={{ fontSize: 13, color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Contact</a>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.22)", width: "100%", margin: 0 }}>
            © 2025 Qwiklabs Developer Club SRMIST · All rights reserved
          </p>
        </footer>
      </div>
    </>
  );
}

/* ── Tiny helper atoms ─────────────────────────────────────── */
function Req() { return <span style={{ color:"#ef4444" }}>*</span>; }
function HR()  { return <div style={{ height:1, background:"#f3f0eb", margin:"28px 0" }} />; }

function FLabel({ children, accent=false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{
      fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10,
      color: accent ? "#d97706" : "#9ca3af",
      letterSpacing:".2em", textTransform:"uppercase", marginBottom:14,
    }}>
      {children}
    </div>
  );
}

function QI({ label, name, value, onChange, ph, type="text", req=false }: {
  label:string; name:string; value:string;
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  ph?:string; type?:string; req?:boolean;
}) {
  return (
    <div>
      <label style={{ display:"block", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#9ca3af", letterSpacing:".15em", textTransform:"uppercase", marginBottom:8 }}>
        {label} {req && <Req />}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} required={req} placeholder={ph} className="qi-input" />
    </div>
  );
}

function QS({ label, name, value, onChange, opts, req=false }: {
  label:string; name:string; value:string;
  onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;
  opts:string[]; req?:boolean;
}) {
  return (
    <div>
      <label style={{ display:"block", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#9ca3af", letterSpacing:".15em", textTransform:"uppercase", marginBottom:8 }}>
        {label} {req && <Req />}
      </label>
      <select name={name} value={value} onChange={onChange} required={req} className="qi-input" style={{ appearance:"none", cursor:"pointer" }}>
        <option value="">-- Select --</option>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
