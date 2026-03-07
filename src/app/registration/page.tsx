"use client";

import { useState } from "react";
import Link from "next/link";

// List your events here — edit as needed
const EVENTS = [
  "HackRush 2025 (36-Hour Hackathon)",
  "Cloud Study Jam",
  "Web Dev Bootcamp",
  "AI/ML Workshop",
  "DevOps Workshop",
  "Gen AI Sprint",
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  regNumber: string;
  year: string;
  branch: string;
  event: string;
  experience: string;
  linkedin: string;
  whyJoin: string;
};

const INITIAL: FormData = {
  name: "",
  email: "",
  phone: "",
  regNumber: "",
  year: "",
  branch: "",
  event: "",
  experience: "",
  linkedin: "",
  whyJoin: "",
};

export default function RegistrationPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      setForm(INITIAL);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-6 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Event Registration
          </h1>
          <p className="text-gray-500 text-base">
            Register for upcoming QDC SRMIST events. Fill in your details and we&apos;ll be in touch!
          </p>
        </div>

        {/* Success State */}
        {status === "success" && (
          <div className="mb-8 rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-semibold text-green-800 mb-1">
              Registration Successful!
            </h2>
            <p className="text-green-700 text-sm">
              Thanks for registering! We&apos;ll send confirmation details to your email shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-green-700 underline text-sm hover:text-green-900"
            >
              Register for another event
            </button>
          </div>
        )}

        {/* Form */}
        {status !== "success" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-100 p-8 space-y-6"
          >
            {/* Event Selection — most important, at top */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Select Event <span className="text-red-500">*</span>
              </label>
              <select
                name="event"
                value={form.event}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">-- Choose an event --</option>
                {EVENTS.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-100 pt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Personal Details
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@srmist.edu.in"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="regNumber"
                    value={form.regNumber}
                    onChange={handleChange}
                    required
                    placeholder="RA2211003010XXX"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">-- Select year --</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    required
                    placeholder="e.g. CSE, ECE, IT..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Optional fields */}
            <div className="border-t border-dashed border-gray-100 pt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Additional Info (Optional)
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">-- Select level --</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Why do you want to attend?
                  </label>
                  <textarea
                    name="whyJoin"
                    value={form.whyJoin}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us a bit about what you hope to learn or build..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {status === "error" && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm tracking-wide shadow-lg shadow-blue-200"
            >
              {loading ? "Submitting..." : "Register Now →"}
            </button>

            <p className="text-center text-xs text-gray-400">
              Questions? Reach us at{" "}
              <a href="mailto:admin@qdcsrmist.in" className="text-blue-500 hover:underline">
                admin@qdcsrmist.in
              </a>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
