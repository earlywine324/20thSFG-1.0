import Image from "next/image";
import { Users, Tv, ExternalLink } from "lucide-react";
import { fetchStreams, fetchUsers, type TwitchStream, type TwitchUser } from "@/app/lib/twitch";
import { STREAMERS, type StreamerEntry } from "./streamers-config";

export const revalidate = 60;

// ─── helpers ────────────────────────────────────────────────────────────────

function thumbnailUrl(raw: string, w = 640, h = 360) {
  return raw.replace("{width}", String(w)).replace("{height}", String(h));
}

function formatViewers(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

// ─── Twitch SVG icon ─────────────────────────────────────────────────────────

function TwitchIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

// ─── Live badge ──────────────────────────────────────────────────────────────

function LiveBadge({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        backgroundColor: "rgba(239,68,68,0.2)",
        border: "1px solid rgba(239,68,68,0.5)",
        borderRadius: "2px",
        padding: size === "lg" ? "3px 10px" : "2px 7px",
      }}
    >
      <span
        style={{
          width: size === "lg" ? 7 : 5,
          height: size === "lg" ? 7 : 5,
          borderRadius: "50%",
          backgroundColor: "#ef4444",
          boxShadow: "0 0 8px #ef4444",
          display: "inline-block",
          animation: "livepulse 1.4s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          color: "#fca5a5",
          fontFamily: "monospace",
          fontWeight: 900,
          fontSize: size === "lg" ? "11px" : "9px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        LIVE
      </span>
    </span>
  );
}

// ─── Featured live card (first streamer when live) ───────────────────────────

function FeaturedCard({ entry, stream, user }: { entry: StreamerEntry; stream: TwitchStream; user: TwitchUser | null }) {
  return (
    <a
      href={`https://twitch.tv/${entry.twitch}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col lg:flex-row overflow-hidden"
      style={{
        backgroundColor: "#0c0f17",
        border: "1px solid rgba(239,68,68,0.4)",
        borderRadius: "6px",
        boxShadow: "0 0 60px rgba(239,68,68,0.12), 0 0 0 1px rgba(239,68,68,0.1)",
      }}
    >
      {/* Thumbnail — takes up left 60% on desktop */}
      <div className="relative w-full lg:w-[60%] shrink-0" style={{ aspectRatio: "16/9" }}>
        <Image
          src={thumbnailUrl(stream.thumbnail_url, 960, 540)}
          alt={`${entry.name} live stream`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, transparent 60%, #0c0f17 100%), linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)",
          }}
        />
        {/* LIVE badge top-left */}
        <div className="absolute top-3 left-3">
          <LiveBadge size="lg" />
        </div>
        {/* Viewer count bottom-left */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5"
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "2px",
            backdropFilter: "blur(4px)",
          }}
        >
          <Users className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
          <span className="text-sm font-black" style={{ color: "#e8edf5", fontFamily: "monospace" }}>
            {formatViewers(stream.viewer_count)}
          </span>
          <span className="text-[10px] tracking-wider" style={{ color: "#505870", fontFamily: "monospace" }}>
            viewers
          </span>
        </div>
      </div>

      {/* Info panel — right side */}
      <div className="flex flex-col justify-between p-6 lg:p-8 flex-1">
        {/* Top */}
        <div>
          {/* Profile + name */}
          <div className="flex items-center gap-3 mb-5">
            {user?.profile_image_url ? (
              <div
                className="relative shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: "2px solid rgba(239,68,68,0.5)",
                  boxShadow: "0 0 16px rgba(239,68,68,0.3)",
                }}
              >
                <Image
                  src={user.profile_image_url}
                  alt={entry.name}
                  fill
                  sizes="52px"
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "rgba(239,68,68,0.1)",
                  border: "2px solid rgba(239,68,68,0.3)",
                }}
              >
                <TwitchIcon style={{ width: 22, height: 22, color: "#ef4444" }} />
              </div>
            )}
            <div>
              <p
                className="text-[10px] font-black tracking-[0.25em] uppercase mb-0.5"
                style={{ color: "#4db6e0", fontFamily: "monospace" }}
              >
                {entry.rank}
              </p>
              <p className="text-xl font-black" style={{ color: "#e8edf5" }}>
                {entry.name}
              </p>
            </div>
          </div>

          {/* Stream title */}
          {stream.title && (
            <p
              className="text-sm leading-relaxed mb-3 line-clamp-2"
              style={{ color: "#8892a4" }}
            >
              {stream.title}
            </p>
          )}

          {/* Game */}
          {stream.game_name && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-5"
              style={{
                backgroundColor: "rgba(77,182,224,0.06)",
                border: "1px solid rgba(77,182,224,0.15)",
                borderRadius: "2px",
              }}
            >
              <span
                className="text-[10px] font-black tracking-[0.2em] uppercase"
                style={{ color: "#4db6e0", fontFamily: "monospace" }}
              >
                {stream.game_name}
              </span>
            </div>
          )}
        </div>

        {/* Watch button */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-5 py-2.5 transition-all"
            style={{
              backgroundColor: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: "2px",
            }}
          >
            <TwitchIcon style={{ width: 14, height: 14, color: "#ef4444" }} />
            <span
              className="text-[11px] font-black tracking-[0.2em] uppercase"
              style={{ color: "#fca5a5" }}
            >
              Watch Live
            </span>
          </div>
          <span
            className="text-[10px] tracking-wider"
            style={{ color: "#2e3650", fontFamily: "monospace" }}
          >
            twitch.tv/{entry.twitch}
          </span>
        </div>
      </div>
    </a>
  );
}

// ─── Regular live card ───────────────────────────────────────────────────────

function LiveCard({ entry, stream, user }: { entry: StreamerEntry; stream: TwitchStream; user: TwitchUser | null }) {
  return (
    <a
      href={`https://twitch.tv/${entry.twitch}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "#0c0f17",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "4px",
        boxShadow: "0 0 30px rgba(239,68,68,0.08)",
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src={thumbnailUrl(stream.thumbnail_url)}
          alt={`${entry.name} stream`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }}
        />
        <div className="absolute top-2 left-2"><LiveBadge /></div>
        <div
          className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "2px",
          }}
        >
          <Users className="w-3 h-3" style={{ color: "#ef4444" }} />
          <span className="text-[10px] font-black" style={{ color: "#e8edf5", fontFamily: "monospace" }}>
            {formatViewers(stream.viewer_count)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-start gap-3 p-4">
        {user?.profile_image_url ? (
          <div
            className="relative shrink-0 mt-0.5"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1.5px solid rgba(239,68,68,0.4)",
            }}
          >
            <Image
              src={user.profile_image_url}
              alt={entry.name}
              fill
              sizes="36px"
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1.5px solid rgba(239,68,68,0.3)",
            }}
          >
            <TwitchIcon style={{ width: 16, height: 16, color: "#ef4444" }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "#4db6e0", fontFamily: "monospace" }}>
              {entry.rank}
            </span>
            <span className="text-sm font-black truncate" style={{ color: "#e8edf5" }}>
              {entry.name}
            </span>
          </div>
          {stream.title && (
            <p className="text-xs line-clamp-1 mb-1" style={{ color: "#8892a4" }}>{stream.title}</p>
          )}
          {stream.game_name && (
            <p className="text-[10px] font-bold tracking-widest uppercase truncate" style={{ color: "#505870", fontFamily: "monospace" }}>
              {stream.game_name}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

// ─── Offline card (compact horizontal) ──────────────────────────────────────

function OfflineCard({ entry, user }: { entry: StreamerEntry; user: TwitchUser | null }) {
  return (
    <a
      href={`https://twitch.tv/${entry.twitch}`}
      target="_blank"
      rel="noopener noreferrer"
      className="offline-card group flex items-center gap-4 p-4 transition-all duration-200"
      style={{
        backgroundColor: "#0c0f17",
        border: "1px solid #161b27",
        borderRadius: "4px",
      }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {user?.profile_image_url ? (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1.5px solid #1e2535",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              src={user.profile_image_url}
              alt={entry.name}
              fill
              sizes="44px"
              className="object-cover"
              style={{ filter: "grayscale(60%)", opacity: 0.7 }}
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              width: 44, height: 44, borderRadius: "50%",
              backgroundColor: "#0a0d14",
              border: "1.5px solid #161b27",
            }}
          >
            <Tv className="w-4 h-4" style={{ color: "#2e3650" }} />
          </div>
        )}
        {/* Offline dot */}
        <span
          className="absolute bottom-0 right-0"
          style={{
            width: 10, height: 10,
            borderRadius: "50%",
            backgroundColor: "#2e3650",
            border: "2px solid #0c0f17",
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "#505870", fontFamily: "monospace" }}>
            {entry.rank}
          </span>
          <span className="text-sm font-bold truncate" style={{ color: "#8892a4" }}>
            {entry.name}
          </span>
        </div>
        <p className="text-[10px] mt-0.5 truncate" style={{ color: "#2e3650", fontFamily: "monospace" }}>
          twitch.tv/{entry.twitch}
        </p>
      </div>

      {/* External link icon */}
      <ExternalLink
        className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "#505870" }}
      />
    </a>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function StreamersPage() {
  const logins = STREAMERS.map((s) => s.twitch);

  const [streams, users] = await Promise.all([
    fetchStreams(logins),
    fetchUsers(logins),
  ]);

  const streamMap = new Map(streams.map((s) => [s.user_login.toLowerCase(), s]));
  const userMap   = new Map(users.map((u)  => [u.login.toLowerCase(), u]));

  const annotated = STREAMERS.map((entry) => ({
    entry,
    stream: streamMap.get(entry.twitch.toLowerCase()) ?? null,
    user:   userMap.get(entry.twitch.toLowerCase())   ?? null,
  }));

  const liveEntries    = annotated.filter((e) => e.stream !== null);
  const offlineEntries = annotated.filter((e) => e.stream === null);
  const liveCount      = liveEntries.length;

  const [featured, ...restLive] = liveEntries;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#07090e", color: "#e8edf5" }}>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{ borderBottom: "1px solid #161b27" }}
      >
        {/* Purple glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-60px", left: "50%", transform: "translateX(-50%)",
            width: "600px", height: "300px",
            background: "radial-gradient(ellipse at center, rgba(239,68,68,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(239,68,68,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, transparent 40%, #07090e 100%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">

            {/* Classification bar */}
            <div
              className="inline-flex items-center gap-3 px-4 py-1.5 mb-8"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "2px",
              }}
            >
              <TwitchIcon style={{ width: 10, height: 10, color: "#ef4444" }} />
              <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "#ef4444", fontFamily: "monospace" }}>
                Unit Broadcast Feed
              </span>
              <span className="w-px h-3" style={{ backgroundColor: "rgba(239,68,68,0.3)" }} />
              <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "#505870", fontFamily: "monospace" }}>
                1st PLT · A CO · 1/75th RGR
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4" style={{ color: "#e8edf5" }}>
              Unit{" "}
              <span style={{ color: "#ef4444", textShadow: "0 0 40px rgba(239,68,68,0.4)" }}>
                Streamers
              </span>
            </h1>

            <p
              className="text-sm max-w-md mb-8"
              style={{ color: "#505870" }}
            >
              Watch Rangers from 1st Platoon live on Twitch. Support the unit — follow, subscribe, tune in.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {liveCount > 0 ? (
                  <>
                    <span
                      style={{
                        width: 8, height: 8, borderRadius: "50%",
                        backgroundColor: "#ef4444",
                        boxShadow: "0 0 10px #ef4444",
                        display: "inline-block",
                        animation: "livepulse 1.4s ease-in-out infinite",
                      }}
                    />
                    <span className="text-sm font-black" style={{ color: "#fca5a5", fontFamily: "monospace" }}>
                      {liveCount} Live
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#2e3650", display: "inline-block" }} />
                    <span className="text-sm font-black" style={{ color: "#505870", fontFamily: "monospace" }}>
                      All Offline
                    </span>
                  </>
                )}
              </div>
              {STREAMERS.length > 0 && (
                <>
                  <span style={{ color: "#1e2535" }}>·</span>
                  <span className="text-sm" style={{ color: "#505870", fontFamily: "monospace" }}>
                    {STREAMERS.length} Streamer{STREAMERS.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-14 space-y-16">

        {STREAMERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className="flex items-center justify-center mb-6"
              style={{
                width: 72, height: 72, borderRadius: "50%",
                backgroundColor: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <TwitchIcon style={{ width: 30, height: 30, color: "#2e3650" }} />
            </div>
            <p className="text-sm font-black tracking-[0.2em] uppercase mb-2" style={{ color: "#505870", fontFamily: "monospace" }}>
              No streamers registered
            </p>
            <p className="text-xs" style={{ color: "#2e3650" }}>
              Add handles to{" "}
              <code style={{ color: "#ef4444" }}>app/streamers/streamers-config.ts</code>
            </p>
          </div>
        ) : (
          <>
            {/* ── LIVE NOW ── */}
            {liveEntries.length > 0 && (
              <section>
                {/* Section label */}
                <div className="flex items-center gap-3 mb-7">
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      backgroundColor: "#ef4444",
                      boxShadow: "0 0 10px #ef4444",
                      flexShrink: 0,
                      animation: "livepulse 1.4s ease-in-out infinite",
                    }}
                  />
                  <h2
                    className="text-[11px] font-black tracking-[0.35em] uppercase"
                    style={{ color: "#ef4444", fontFamily: "monospace" }}
                  >
                    Live Now
                  </h2>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(239,68,68,0.3), transparent)" }} />
                </div>

                {/* Featured card */}
                {featured && (
                  <div className="mb-6">
                    <FeaturedCard
                      entry={featured.entry}
                      stream={featured.stream!}
                      user={featured.user}
                    />
                  </div>
                )}

                {/* Rest of live streamers */}
                {restLive.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {restLive.map(({ entry, stream, user }) => (
                      <LiveCard key={entry.twitch} entry={entry} stream={stream!} user={user} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── OFFLINE ── */}
            {offlineEntries.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-7">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#2e3650", flexShrink: 0 }} />
                  <h2
                    className="text-[11px] font-black tracking-[0.35em] uppercase"
                    style={{ color: "#505870", fontFamily: "monospace" }}
                  >
                    Offline
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: "#161b27" }} />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {offlineEntries.map(({ entry, user }) => (
                    <OfflineCard key={entry.twitch} entry={entry} user={user} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes livepulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.5); }
        }
        .offline-card:hover {
          background-color: #0e1119 !important;
          border-color: #1e2535 !important;
        }
      `}</style>
    </div>
  );
}
