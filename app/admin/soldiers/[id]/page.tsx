import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SoldierForm from "../../components/SoldierForm";
import DeleteButton from "./delete";
import DischargeButton from "./DischargeButton";
import PromoteButton from "./PromoteButton";

export default async function EditSoldierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: soldier } = await supabase.from("soldiers").select("*").eq("id", id).single();

  if (!soldier) notFound();

  // Fetch all auth users for the account-linking dropdown
  const admin = createAdminClient();
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const userOptions = (authUsers ?? []).map((u) => ({
    id:    u.id,
    label: (u.user_metadata?.display_name as string | undefined) ?? u.email ?? u.id,
    email: u.email ?? "",
  })).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="p-8">
      <Link href="/admin/soldiers" className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "#8a8870" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Roster
      </Link>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-2" style={{ color: "#c9a128" }}>
            Edit Soldier Profile
          </p>
          <h1 className="text-3xl font-black" style={{ color: "#e8e4d8" }}>
            {soldier.rank} {soldier.name}
          </h1>
        </div>
        <DeleteButton id={soldier.id} name={`${soldier.rank} ${soldier.name}`} />
      </div>

      {/* Discharge Panel */}
      {soldier.status !== "DISCHARGED" && (
        <div className="rounded-lg p-6 mb-6 max-w-3xl" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
          <h3 className="text-xs font-black tracking-widest uppercase mb-4 pb-3" style={{ color: "#8a8870", borderBottom: "1px solid #1c2014" }}>
            Discharge Soldier
          </h3>
          <p className="text-[10px] mb-4" style={{ color: "#484f58" }}>
            Discharging will set status to DISCHARGED, log a service entry, and open the vacant billet.
          </p>
          <DischargeButton id={soldier.id} name={`${soldier.rank} ${soldier.name}`} />
        </div>
      )}

      {/* Promotion Panel */}
      {soldier.status === "ACTIVE DUTY" && (
        <div className="rounded-lg p-6 mb-8 max-w-3xl" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
          <h3 className="text-xs font-black tracking-widest uppercase mb-4 pb-3" style={{ color: "#8a8870", borderBottom: "1px solid #1c2014" }}>
            Promotion
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#6b6a58" }}>Current Rank</p>
              <p className="text-lg font-black" style={{ color: "#e8e4d8" }}>{soldier.rank_full} ({soldier.rank})</p>
            </div>
            {soldier.last_promotion && (
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#6b6a58" }}>Last Promotion</p>
                <p className="text-sm font-bold" style={{ color: "#c9a128" }}>{soldier.last_promotion}</p>
              </div>
            )}
          </div>
          <PromoteButton
            soldierId={soldier.id}
            currentRank={soldier.rank}
            lastPromotion={soldier.last_promotion}
          />
        </div>
      )}

      <SoldierForm soldier={soldier} userOptions={userOptions} />
    </div>
  );
}
