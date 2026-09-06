"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2 } from "lucide-react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export default function AddRecordForm({
  soldierId,
  label,
  fields,
  onSubmit,
  onRemove,
  entries,
  renderEntry,
}: {
  soldierId: string;
  label: string;
  fields: Field[];
  onSubmit: (soldierId: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  onRemove: (soldierId: string, index: number) => Promise<{ success?: boolean; error?: string }>;
  entries: Record<string, string | undefined>[];
  renderEntry: (entry: Record<string, string | undefined>, index: number) => React.ReactNode;
}) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await onSubmit(soldierId, formData);
    if (result.error) {
      alert("Error: " + result.error);
    } else {
      setShowForm(false);
    }
    setLoading(false);
    router.refresh();
  }

  async function handleRemove(index: number) {
    if (!confirm("Remove this record?")) return;
    setRemoving(index);
    const result = await onRemove(soldierId, index);
    if (result.error) alert("Error: " + result.error);
    setRemoving(null);
    router.refresh();
  }

  return (
    <div>
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded text-[10px] font-black tracking-widest uppercase transition-colors"
          style={{
            color: "#c9a128",
            backgroundColor: "rgba(201,161,40,0.08)",
            border: "1px solid rgba(201,161,40,0.15)",
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add {label}
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg p-5 mb-4 space-y-3"
          style={{ backgroundColor: "#0f120a", border: "1px solid #c9a128" }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#c9a128" }}>
              New {label}
            </p>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="w-4 h-4" style={{ color: "#6b6a58" }} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                <label className="block text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#8a8870" }}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full px-3 py-2 rounded text-xs outline-none resize-none"
                    style={{ backgroundColor: "#090b07", border: "1px solid #1c2014", color: "#e8e4d8" }}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    required={field.required}
                    defaultValue=""
                    className="w-full px-3 py-2 rounded text-xs outline-none"
                    style={{ backgroundColor: "#090b07", border: "1px solid #1c2014", color: "#e8e4d8" }}
                  >
                    <option value="" disabled style={{ color: "#6b6a58" }}>
                      {field.placeholder || `Select ${field.label}...`}
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded text-xs outline-none"
                    style={{ backgroundColor: "#090b07", border: "1px solid #1c2014", color: "#e8e4d8" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded text-[10px] font-black tracking-widest uppercase disabled:opacity-50"
              style={{ backgroundColor: "#c9a128", color: "#090b07" }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded text-[10px] font-black tracking-widest uppercase"
              style={{ color: "#8a8870", border: "1px solid #1c2014" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Entries with delete buttons */}
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div key={i} className="group relative">
            {renderEntry(entry, i)}
            <button
              onClick={() => handleRemove(i)}
              disabled={removing === i}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
              title="Remove"
            >
              {removing === i ? (
                <span className="text-[9px]">...</span>
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
