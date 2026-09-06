import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/lib/supabase/server";
import { checkAdmin } from "@/app/lib/dal";
import { Pin, Plus, Newspaper, Clock } from "lucide-react";

/* ─── TYPES ─── */
type NewsPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  pinned: boolean;
  published: boolean;
  created_at: string;
  image_url: string | null;
};

/* ─── HELPERS ─── */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "JAN","FEB","MAR","APR","MAY","JUN",
    "JUL","AUG","SEP","OCT","NOV","DEC",
  ];
  return `${String(d.getUTCDate()).padStart(2,"0")} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return formatDate(iso);
}

const CATEGORY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  SITREP:       { color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.2)"  },
  OPORD:        { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  AAR:          { color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)"  },
  TRAINING:     { color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)"  },
  INTEL:        { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  ADMIN:        { color: "#4db6e0", bg: "rgba(77,182,224,0.08)",  border: "rgba(77,182,224,0.2)"  },
  ANNOUNCEMENT: { color: "#c9a128", bg: "rgba(201,161,40,0.08)",  border: "rgba(201,161,40,0.2)"  },
};

function CategoryBadge({ cat }: { cat: string }) {
  const s = CATEGORY_STYLES[cat] ?? CATEGORY_STYLES.ANNOUNCEMENT;
  return (
    <span
      className="text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded"
      style={{ color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}` }}
    >
      {cat}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default async function NewsPage() {
  const supabase = await createClient();
  const admin = await checkAdmin();

  const { data: allPosts } = await supabase
    .from("news_posts")
    .select("*")
    .eq("published", true)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const posts: NewsPost[] = allPosts || [];
  const pinned = posts.filter((p) => p.pinned);
  const feed   = posts.filter((p) => !p.pinned);

  return (
    <div className="bg-[#07090e] text-[#e8edf5] min-h-screen">

      {/* ── PAGE HEADER ── */}
      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{ borderBottom: "1px solid #161b27" }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#4db6e0 1px, transparent 1px), linear-gradient(90deg, #4db6e0 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, #07090e, transparent)" }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Classification bar */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded mb-6"
            style={{ backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid rgba(77,182,224,0.15)" }}
          >
            <span className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: "#4db6e0" }}>
              UNCLASSIFIED // PUBLIC RELEASE
            </span>
            <span className="w-px h-3" style={{ backgroundColor: "rgba(77,182,224,0.2)" }} />
            <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: "#505870", fontFamily: "monospace" }}>
              S6 PUBLIC AFFAIRS OFFICE
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-3" style={{ color: "#e8edf5" }}>
                Unit News
              </h1>
              <p className="text-[#8892a4] text-sm leading-relaxed max-w-lg">
                SITREPs, AARs, announcements, and operational updates from ODA 2011, 20th Special Forces Group.
              </p>
            </div>
            {admin && (
              <Link
                href="/news/new"
                className="flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-black tracking-widest uppercase shrink-0 transition-all"
                style={{
                  backgroundColor: "rgba(77,182,224,0.08)",
                  border: "1px solid rgba(77,182,224,0.25)",
                  color: "#4db6e0",
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                New Post
              </Link>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "Total Posts",   value: String(posts.length) },
              { label: "Pinned Updates", value: String(pinned.length) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-black" style={{ color: "#e8edf5" }}>{value}</p>
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#505870" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-14 space-y-16">

        {/* ── PINNED UPDATES ── */}
        {pinned.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Pin className="w-4 h-4" style={{ color: "#c9a128" }} />
              <p className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: "#c9a128" }}>
                Pinned Updates
              </p>
              <div className="flex-1 h-px" style={{ backgroundColor: "#161b27" }} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {pinned.map((post) => (
                <PinnedCard key={post.id} post={post} admin={admin} />
              ))}
            </div>
          </section>
        )}

        {/* ── LATEST UPDATES ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Newspaper className="w-4 h-4" style={{ color: "#4db6e0" }} />
            <p className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: "#4db6e0" }}>
              Latest Updates
            </p>
            <div className="flex-1 h-px" style={{ backgroundColor: "#161b27" }} />
          </div>

          {feed.length === 0 && pinned.length === 0 ? (
            <div
              className="rounded-lg p-14 text-center"
              style={{ backgroundColor: "#0b0e15", border: "1px dashed #161b27" }}
            >
              <Newspaper className="w-8 h-8 mx-auto mb-3" style={{ color: "#1e2535" }} />
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#2e3650" }}>
                No Posts Yet
              </p>
              {admin && (
                <Link href="/news/new" className="text-[#4db6e0] text-xs font-bold hover:underline">
                  + Publish the first post
                </Link>
              )}
            </div>
          ) : feed.length === 0 ? (
            <p className="text-xs text-[#505870] tracking-wider uppercase">No additional posts.</p>
          ) : (
            <div className="space-y-px">
              {feed.map((post, i) => (
                <FeedRow key={post.id} post={post} admin={admin} last={i === feed.length - 1} />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Footer classification bar */}
      <div
        className="py-3 px-6 text-center"
        style={{ borderTop: "1px solid #161b27" }}
      >
        <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "#2e3650", fontFamily: "monospace" }}>
          ODA 2011 · 20TH SFG // ALL INFORMATION UNCLASSIFIED // PUBLIC RELEASE AUTHORIZED
        </p>
      </div>
    </div>
  );
}

/* ─── PINNED CARD ─── */
function PinnedCard({ post, admin }: { post: NewsPost; admin: boolean }) {
  return (
    <article
      className="relative rounded-lg overflow-hidden group transition-all"
      style={{
        backgroundColor: "#0b0e15",
        border: "1px solid #1a2035",
      }}
    >
      {/* Gold top accent */}
      <div className="h-0.5 w-full" style={{ backgroundColor: "#c9a128" }} />

      {/* Cover image */}
      {post.image_url && (
        <div className="relative w-full h-44 overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            style={{ filter: "brightness(0.85)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0b0e15 0%, transparent 60%)" }} />
        </div>
      )}

      <div className="p-6">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CategoryBadge cat={post.category} />
            <span
              className="text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5 rounded"
              style={{ color: "#c9a128", backgroundColor: "rgba(201,161,40,0.08)", border: "1px solid rgba(201,161,40,0.2)" }}
            >
              ⊕ PINNED
            </span>
          </div>
          <span className="text-[10px]" style={{ color: "#505870", fontFamily: "monospace" }}>
            {formatDate(post.created_at)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-black leading-snug mb-3" style={{ color: "#e8edf5" }}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#8892a4" }}>
          {post.excerpt}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid #161b27" }}
        >
          <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "#505870" }}>
            {post.author}
          </span>
          {admin && (
            <AdminActions postId={post.id} pinned={post.pinned} />
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── FEED ROW ─── */
function FeedRow({ post, admin, last }: { post: NewsPost; admin: boolean; last: boolean }) {
  return (
    <article
      className="flex flex-col sm:flex-row sm:items-start gap-4 py-5 transition-colors"
      style={{
        borderBottom: last ? "none" : "1px solid #161b27",
      }}
    >
      {/* Date sidebar */}
      <div className="sm:w-32 shrink-0">
        {/* Thumbnail */}
        {post.image_url && (
          <div className="relative w-full h-16 rounded overflow-hidden mb-2" style={{ border: "1px solid #161b27" }}>
            <Image src={post.image_url} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <p
          className="text-[10px] font-black tracking-wider uppercase"
          style={{ color: "#505870", fontFamily: "monospace" }}
        >
          {formatDate(post.created_at)}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-2.5 h-2.5" style={{ color: "#2e3650" }} />
          <span className="text-[9px]" style={{ color: "#2e3650" }}>
            {timeAgo(post.created_at)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge cat={post.category} />
          <span className="text-[10px]" style={{ color: "#505870" }}>
            by {post.author}
          </span>
        </div>
        <h3 className="text-sm font-black mb-1.5 leading-snug" style={{ color: "#e8edf5" }}>
          {post.title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "#8892a4" }}>
          {post.excerpt}
        </p>
      </div>

      {/* Admin actions */}
      {admin && (
        <div className="shrink-0">
          <AdminActions postId={post.id} pinned={post.pinned} />
        </div>
      )}
    </article>
  );
}

/* ─── ADMIN ACTIONS (minimal, client-less) ─── */
function AdminActions({ postId, pinned }: { postId: string; pinned: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <form action={`/api/news/pin`} method="POST">
        <input type="hidden" name="id" value={postId} />
        <input type="hidden" name="pinned" value={String(pinned)} />
        <button
          type="submit"
          className="text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded transition-colors"
          style={{
            color: pinned ? "#c9a128" : "#505870",
            backgroundColor: pinned ? "rgba(201,161,40,0.08)" : "transparent",
            border: `1px solid ${pinned ? "rgba(201,161,40,0.2)" : "#1a2035"}`,
          }}
          title={pinned ? "Unpin post" : "Pin post"}
        >
          {pinned ? "Unpin" : "Pin"}
        </button>
      </form>
    </div>
  );
}
