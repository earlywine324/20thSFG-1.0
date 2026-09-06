import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { ChevronLeft, Plus } from "lucide-react";
import EventForm from "./EventForm";

export default async function NewEventPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "superadmin"].includes(profile.role)) {
    redirect("/operations");
  }

  return (
    <div className="bg-[#090b07] text-[#e8e4d8] min-h-screen">

      {/* Header */}
      <section
        className="relative py-16 px-6 overflow-hidden bg-black-mc grain"
        style={{ borderBottom: "1px solid #1c2014" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#c9a128 1px, transparent 1px), linear-gradient(90deg, #c9a128 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <Link
            href="/operations"
            className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#6b6a58] hover:text-[#c9a128] transition-colors mb-6"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Operations
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(201,161,40,0.1)", border: "1px solid rgba(201,161,40,0.2)" }}
            >
              <Plus className="w-4 h-4 text-[#c9a128]" />
            </div>
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c9a128]">
              Admin · Operations
            </p>
          </div>
          <h1 className="text-4xl font-black text-[#e8e4d8]">Create Event</h1>
          <p className="text-[#8a8870] text-sm mt-2">
            Add a new operation, training event, or course to the unit schedule.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <EventForm />
      </div>

    </div>
  );
}
