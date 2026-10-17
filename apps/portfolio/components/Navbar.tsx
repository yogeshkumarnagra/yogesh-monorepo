"use client";
import { useState, useEffect } from "react";
import { profile } from "@/lib/data";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <a
        href="#"
        className="font-mono text-sm text-accent-light hover:text-white transition-colors"
      >
        yogesh.dev
      </a>
      <ul className="hidden md:flex gap-8">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href={`mailto:${profile.email}`}
        className="text-xs font-mono border border-border text-text-secondary hover:border-accent hover:text-accent-light px-3 py-1.5 rounded-md transition-all"
      >
        Hire Me
      </a>
    </nav>
  );
}
