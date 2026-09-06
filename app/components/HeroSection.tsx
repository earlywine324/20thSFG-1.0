import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import CommandBriefing from "./CommandBriefing";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Image
          src="/bg-main.png"
          alt="1st Ranger Battalion"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 1 }} />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 2,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 2,
        background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)",
      }} />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none" style={{
        zIndex: 2,
        background: "linear-gradient(to top, #07090e 0%, transparent 100%)",
      }} />

      {/* HUD — Classification Bar */}
      <div className="absolute top-0 inset-x-0" style={{ zIndex: 20 }}>
        <div className="flex items-center justify-between px-6 py-2" style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          borderBottom: "1px solid rgba(77,182,224,0.15)",
        }}>
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#4db6e0", fontFamily: "monospace" }}>
            UNCLASSIFIED // PUBLIC RELEASE
          </span>
          <span className="text-[10px] tracking-[0.15em] uppercase hidden md:block" style={{ color: "#505870", fontFamily: "monospace" }}>
            1ST PLT, A CO, 1/75TH RGR — OUTLAWS
          </span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative text-center max-w-4xl mx-auto" style={{ zIndex: 10 }}>

        {/* Emblem */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-new.png"
            alt="1/75th RGR Crest"
            width={170}
            height={170}
            priority
            style={{ filter: "drop-shadow(0 0 30px rgba(77,182,224,0.25)) drop-shadow(0 4px 20px rgba(0,0,0,0.8))" }}
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-4" style={{ color: "#e8edf5" }}>
          1<span style={{ color: "#4db6e0" }}>st</span> Platoon · Outlaws
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl tracking-[0.25em] uppercase mb-3" style={{ color: "#8892a4", fontFamily: "monospace" }}>
          Alpha Company · 1/75th Ranger Regiment · Bellum
        </p>

        {/* Divider */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-px" style={{ backgroundColor: "#e8edf5" }} />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/enlist"
            className="flex items-center gap-2 font-black text-sm tracking-widest uppercase px-10 py-4"
            style={{ backgroundColor: "#e8edf5", color: "#07090e" }}
          >
            Enlist Now <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 font-black text-sm tracking-widest uppercase px-10 py-4"
            style={{ border: "1px solid rgba(232,237,245,0.3)", color: "#e8edf5" }}
          >
            About Us
          </Link>
        </div>

        {/* Command Briefing audio */}
        <div className="flex justify-center mb-10">
          <CommandBriefing />
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center animate-bounce">
          <ChevronDown className="w-6 h-6" style={{ color: "#505870" }} />
        </div>
      </div>

    </section>
  );
}
