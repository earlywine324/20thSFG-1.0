"use client";

import { useActionState, useState, useRef } from "react";
import { createPost, type PostFormState } from "@/app/lib/actions/news";
import { Loader2, ImagePlus, X } from "lucide-react";
import Image from "next/image";

const CATEGORIES = [
  "SITREP",
  "OPORD",
  "ADMIN",
  "TRAINING",
  "ANNOUNCEMENT",
  "INTEL",
  "AAR",
];

export default function PostForm() {
  const [state, action, pending] = useActionState<PostFormState, FormData>(
    createPost,
    null,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { setPreview(null); return; }
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      {state?.error && (
        <div
          className="px-4 py-3 rounded-lg text-sm font-bold"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171",
          }}
        >
          {state.error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-[10px] font-black tracking-[0.25em] uppercase text-[#8a8870] mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          name="title"
          type="text"
          required
          placeholder="Operation Crimson Tide — After-Action Report"
          className="w-full px-4 py-3 rounded-lg text-sm text-[#e8e4d8] bg-[#0f120a] border border-[#1c2014] focus:outline-none focus:border-[#4db6e0] placeholder:text-[#4a4838] transition-colors"
        />
      </div>

      {/* Category + Author row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black tracking-[0.25em] uppercase text-[#8a8870] mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-full px-4 py-3 rounded-lg text-sm text-[#e8e4d8] bg-[#0f120a] border border-[#1c2014] focus:outline-none focus:border-[#4db6e0] transition-colors"
          >
            <option value="" disabled>Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black tracking-[0.25em] uppercase text-[#8a8870] mb-2">
            Author
          </label>
          <input
            name="author"
            type="text"
            placeholder="S6 PAO"
            className="w-full px-4 py-3 rounded-lg text-sm text-[#e8e4d8] bg-[#0f120a] border border-[#1c2014] focus:outline-none focus:border-[#4db6e0] placeholder:text-[#4a4838] transition-colors"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-[10px] font-black tracking-[0.25em] uppercase text-[#8a8870] mb-2">
          Excerpt <span className="text-red-400">*</span>
        </label>
        <textarea
          name="excerpt"
          required
          rows={2}
          placeholder="Short summary displayed on the news feed card…"
          className="w-full px-4 py-3 rounded-lg text-sm text-[#e8e4d8] bg-[#0f120a] border border-[#1c2014] focus:outline-none focus:border-[#4db6e0] placeholder:text-[#4a4838] transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-[10px] font-black tracking-[0.25em] uppercase text-[#8a8870] mb-2">
          Cover Image
        </label>
        {preview ? (
          <div className="relative rounded-lg overflow-hidden" style={{ border: "1px solid #1c2014" }}>
            <Image src={preview} alt="Preview" width={1200} height={400} className="w-full object-cover max-h-56" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black tracking-wider uppercase"
              style={{ background: "rgba(0,0,0,0.7)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <label
            className="flex flex-col items-center justify-center gap-2 w-full py-10 rounded-lg cursor-pointer transition-colors"
            style={{ border: "2px dashed #1c2014", backgroundColor: "#0f120a" }}
            onDragOver={e => e.preventDefault()}
          >
            <ImagePlus className="w-6 h-6" style={{ color: "#4a4838" }} />
            <span className="text-xs font-bold" style={{ color: "#4a4838" }}>Click to upload image</span>
            <span className="text-[10px]" style={{ color: "#2e3040" }}>PNG, JPG, WEBP up to 5 MB</span>
            <input
              ref={fileRef}
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-[10px] font-black tracking-[0.25em] uppercase text-[#8a8870] mb-2">
          Full Content <span className="text-red-400">*</span>
        </label>
        <textarea
          name="content"
          required
          rows={12}
          placeholder="Full post body. Supports plain text. Each new line will render as a paragraph."
          className="w-full px-4 py-3 rounded-lg text-sm text-[#e8e4d8] bg-[#0f120a] border border-[#1c2014] focus:outline-none focus:border-[#4db6e0] placeholder:text-[#4a4838] transition-colors resize-y leading-relaxed font-mono"
        />
        <p className="text-[10px] text-[#4a4838] mt-1">
          Separate paragraphs with blank lines.
        </p>
      </div>

      {/* Pinned toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer gap-3">
          <input
            type="checkbox"
            name="pinned"
            value="true"
            className="sr-only peer"
          />
          <div
            className="w-10 h-5 rounded-full peer-checked:bg-[#c9a128] transition-colors"
            style={{ backgroundColor: "#1c2014" }}
          />
          <div
            className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-[#4a4838] peer-checked:translate-x-5 peer-checked:bg-white transition-all"
          />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#8a8870]">
            Pin to top of feed
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="pt-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 px-8 py-3 rounded-lg text-xs font-black tracking-widest uppercase transition-all disabled:opacity-50"
          style={{
            backgroundColor: "rgba(77,182,224,0.1)",
            border: "1px solid rgba(77,182,224,0.3)",
            color: "#4db6e0",
          }}
        >
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {pending ? "Publishing…" : "Publish Post"}
        </button>
        <a
          href="/news"
          className="flex items-center px-6 py-3 rounded-lg text-xs font-black tracking-widest uppercase transition-colors"
          style={{ color: "#6b6a58", border: "1px solid #1c2014" }}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
