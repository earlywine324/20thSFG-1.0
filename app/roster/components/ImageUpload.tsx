"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadSoldierImage } from "@/app/lib/actions/upload";
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function ImageUpload({
  soldierId,
  imageType,
  currentUrl,
  width,
  height,
  label,
}: {
  soldierId: string;
  imageType: "photo" | "signature";
  currentUrl: string | null;
  width: number;
  height: number;
  label: string;
}) {
  const [loading, setLoading]   = useState(false);
  const [preview, setPreview]   = useState<string | null>(currentUrl);
  const [error, setError]       = useState<string | null>(null);
  const [saved, setSaved]       = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSaved(false);

    // Show local preview immediately
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadSoldierImage(soldierId, imageType, formData);
    if (result.error) {
      setError(result.error);
      setPreview(currentUrl);
    } else if (result.url) {
      setPreview(result.url);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    }

    setLoading(false);
    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {/* Status banners */}
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 rounded text-xs font-bold"
          style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Upload failed: {error}</span>
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded text-xs font-bold"
          style={{ backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }}>
          <CheckCircle2 className="w-4 h-4" />
          <span>Photo saved successfully.</span>
        </div>
      )}

      <div className="relative group">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        {preview ? (
          <div
            className="relative overflow-hidden rounded-lg cursor-pointer"
            style={{ width, height, border: "1px solid #1c2014" }}
            onClick={() => inputRef.current?.click()}
          >
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <Loader2 className="w-6 h-6 text-[#c9a128] animate-spin mx-auto mb-1" />
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#c9a128]">Uploading…</span>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-5 h-5 text-[#c9a128] mx-auto mb-1" />
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#c9a128]">Replace</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex flex-col items-center justify-center rounded-lg transition-colors"
            style={{
              width,
              height,
              backgroundColor: "#0c0f08",
              border: "2px dashed #1c2014",
              color: "#6b6a58",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c9a128"; e.currentTarget.style.color = "#c9a128"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1c2014"; e.currentTarget.style.color = "#6b6a58"; }}
          >
            {loading ? (
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <span className="text-[9px] font-black tracking-widest uppercase">Uploading…</span>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-[9px] font-black tracking-widest uppercase">{label}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
