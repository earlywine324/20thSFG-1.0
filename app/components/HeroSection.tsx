import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, LockKeyhole } from "lucide-react";
import CommandBriefing from "./CommandBriefing";

const GOLD = "#c9a65a";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-6">
      <Image
        src="/lionheart-hero.webp"
        alt="LIONHEART personnel preparing for a fictional interagency mission"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,8,.98)_0%,rgba(5,6,8,.88)_34%,rgba(5,6,8,.42)_68%,rgba(5,6,8,.65)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_48%,rgba(201,166,90,.11),transparent_38%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070809] to-transparent" />

      <div className="absolute inset-x-0 top-0 z-10 border-b border-[#c9a65a]/20 bg-black/55 px-6 py-2 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between font-mono text-[9px] uppercase tracking-[.22em]">
          <span className="flex items-center gap-2" style={{ color: GOLD }}>
            <LockKeyhole className="h-3 w-3" /> Public release // sanitized
          </span>
          <span className="hidden text-[#6f6a5f] md:block">ISMG // LIONHEART PROGRAM</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center py-24">
        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-4">
            <Image
              src="/lionheart-emblem.webp"
              alt="LIONHEART emblem"
              width={106}
              height={106}
              priority
              className="drop-shadow-[0_10px_28px_rgba(0,0,0,.8)]"
            />
            <div className="border-l border-[#c9a65a]/35 pl-4 font-mono text-[10px] uppercase tracking-[.24em] text-[#91866f]">
              <p>Interagency Special Missions Group</p>
              <p className="mt-2" style={{ color: GOLD }}>Program status // Active</p>
            </div>
          </div>

          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.42em]" style={{ color: GOLD }}>
            One mission. Every authority.
          </p>
          <h1 className="text-6xl font-black leading-[.9] tracking-[-.055em] text-[#f3efe6] sm:text-7xl lg:text-8xl">
            LION<span style={{ color: GOLD }}>HEART</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#aaa395] md:text-lg">
            A fictional Arma realism unit built around intelligence collection, federal investigations,
            counternarcotics operations, and national-level direct action.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/enlist" className="inline-flex items-center justify-center gap-2 bg-[#c9a65a] px-7 py-3.5 text-xs font-black uppercase tracking-[.2em] text-[#090a0c] transition hover:bg-[#e0c27f]">
              Begin screening <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center border border-[#c9a65a]/30 bg-black/30 px-7 py-3.5 text-xs font-black uppercase tracking-[.2em] text-[#e7dfcf] backdrop-blur-sm transition hover:border-[#c9a65a]/70">
              Read the brief
            </Link>
          </div>

          <div className="mt-10 max-w-md"><CommandBriefing /></div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[#6f6a5f]">
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </div>
    </section>
  );
}
