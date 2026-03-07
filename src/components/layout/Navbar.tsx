"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";

const navItems = [
  { name: "Home",         path: "/" },
  { name: "Events",       path: "/events" },
  { name: "Team",         path: "/team" },
  { name: "Registration", path: "/registration" },
  { name: "Contact",      path: "/contact" },
];

const Navbar = () => {
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [activeItem,       setActiveItem]        = useState("/");
  const [isMobileMenuOpen, setIsMobileMenuOpen]  = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") setActiveItem(window.location.pathname);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white/90 backdrop-blur-sm"
      )}
    >
      {/* ── Main bar ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-16 gap-6">

          {/* ── LEFT: Logo cluster ──────────────────────────── */}
          {/* flex-shrink-0 prevents logos from squishing into nav links */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* QDC wordmark + logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src="/images/qdc.png"
                alt="QDC Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>

            {/* Thin vertical rule */}
            <div className="w-px h-8 bg-gray-200 mx-1" />

            {/* SRM logo — explicit width caps it */}
            <Image
              src="/images/srmlogo.png"
              alt="SRM"
              width={80}
              height={36}
              className="object-contain"
            />

            {/* SOC logo */}
            <Image
              src="/images/soc.png"
              alt="SOC"
              width={32}
              height={32}
              className="object-contain"
            />

            {/* NWC logo */}
            <Image
              src="/images/nwc.png"
              alt="NWC"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>

          {/* ── CENTRE: Nav links — flex-1 pushes logos & button apart ── */}
          <nav className="hidden md:flex items-center justify-center gap-1 flex-1">
            {navItems.map((item) => {
              const isActive = activeItem === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setActiveItem(item.path)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-blue-200 bg-blue-50"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT: Follow Us button ──────────────────────── */}
          <div className="hidden md:block flex-shrink-0">
            <a
              href="https://www.instagram.com/qdc_srmist/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-blue-200"
            >
              Follow Us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* ── Mobile burger ───────────────────────────────── */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              }
            </svg>
          </button>

        </div>
      </div>

      {/* ── Mobile dropdown ───────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white/98 backdrop-blur-md"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => { setActiveItem(item.path); setIsMobileMenuOpen(false); }}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    activeItem === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <a
                  href="https://www.instagram.com/qdc_srmist/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Follow Us →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
