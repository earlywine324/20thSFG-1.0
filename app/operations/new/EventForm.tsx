"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, type EventFormState } from "@/app/lib/actions/events";
import { Calendar, Clock, Target, Users, Radio, MapPin, FileText, ChevronLeft } from "lucide-react";

const EVENT_TYPES = [
  "FTX / Operation",
  "Squad Drill",
  "Selection Training",
  "Course / School",
  "Ceremony",
] as const;

const ELEMENTS = [
  "All Elements",
  "Platoon HQ",
  "1st Squad",
  "2nd Squad",
  "Weapons Squad",
  "1st Squad / 2nd Squad",
  "All Qualified Personnel",
  "Selection Candidates",
];

function Field({
  label,
  icon,
  required,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#8a8870] mb-2">
        {icon}
        {label}
        {required && <span className="text-[#c9a128]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-[#0a0d08] border border-[#1c2014] rounded-lg px-4 py-3 text-sm text-[#e8e4d8] placeholder-[#4a4838] focus:outline-none focus:border-[#c9a128]/50 transition-colors";

export default function EventForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    createEvent,
    null
  );

  return (
    <form action={formAction} className="space-y-6">

      {/* Error banner */}
      {state?.error && (
        <div className="bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3 text-red-400 text-sm font-bold">
          {state.error}
        </div>
      )}

      {/* Row 1: Title */}
      <Field label="Event Title" icon={<FileText className="w-3 h-3" />} required>
        <input
          name="title"
          type="text"
          placeholder="Operation Mountain Ghost"
          required
          className={inputClass}
        />
      </Field>

      {/* Row 2: Type + Date + Time */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Event Type" icon={<Target className="w-3 h-3" />} required>
          <select name="type" required className={inputClass}>
            <option value="">— Select —</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Date" icon={<Calendar className="w-3 h-3" />} required>
          <input
            name="event_date"
            type="date"
            required
            className={inputClass}
            style={{ colorScheme: "dark" }}
          />
        </Field>

        <Field label="Time (e.g. 2000 EST)" icon={<Clock className="w-3 h-3" />}>
          <input
            name="time"
            type="text"
            placeholder="2000 EST"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Row 3: Lead + Element */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Lead / OIC" icon={<Radio className="w-3 h-3" />}>
          <input
            name="lead"
            type="text"
            placeholder="1st Plt Cadre"
            className={inputClass}
          />
        </Field>

        <Field label="Element / Who Attends" icon={<Users className="w-3 h-3" />}>
          <input
            name="element"
            type="text"
            placeholder="All Elements"
            list="elements-list"
            className={inputClass}
          />
          <datalist id="elements-list">
            {ELEMENTS.map((e) => <option key={e} value={e} />)}
          </datalist>
        </Field>
      </div>

      {/* Row 4: Theatre */}
      <Field label="Theatre / Location (operations only)" icon={<MapPin className="w-3 h-3" />}>
        <input
          name="theatre"
          type="text"
          placeholder="Altis, Takistan, Malden…"
          className={inputClass}
        />
      </Field>

      {/* Row 5: Description */}
      <Field label="Description / Brief" icon={<FileText className="w-3 h-3" />}>
        <textarea
          name="description"
          rows={4}
          placeholder="Weapons familiarization, zeroing, and introduction to CQB fundamentals…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 rounded-lg text-xs font-black tracking-widest uppercase transition-all"
          style={{
            backgroundColor: pending ? "rgba(201,161,40,0.3)" : "#c9a128",
            color: pending ? "#8a8870" : "#090b07",
            cursor: pending ? "not-allowed" : "pointer",
          }}
        >
          {pending ? "Creating…" : "Create Event"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-black tracking-widest uppercase text-[#6b6a58] hover:text-[#8a8870] transition-colors"
          style={{ border: "1px solid #1c2014" }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>

    </form>
  );
}
