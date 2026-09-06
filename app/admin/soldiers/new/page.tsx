import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SoldierForm from "../../components/SoldierForm";

interface Props {
  searchParams: Promise<{
    role?: string;
    unit?: string;
    team?: string;
    billetId?: string;
  }>;
}

export default async function NewSoldierPage({ searchParams }: Props) {
  const params = await searchParams;

  // Pre-fill from billet link (when clicking "Create Soldier for This Billet")
  const prefill = params.role
    ? {
        role: params.role,
        unit: params.unit,
        team: params.team,
        billetId: params.billetId,
      }
    : undefined;

  return (
    <div className="p-8">
      <Link
        href="/admin/soldiers"
        className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-6"
        style={{ color: "#8a8870" }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Roster
      </Link>
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-2" style={{ color: "#c9a128" }}>
          Personnel Management
        </p>
        <h1 className="text-3xl font-black" style={{ color: "#e8e4d8" }}>Add New Soldier</h1>
        {prefill?.role && (
          <p className="text-xs mt-2" style={{ color: "#8a8870" }}>
            Pre-filling for billet:{" "}
            <span style={{ color: "#c9a128" }}>{prefill.role}</span>
            {prefill.unit && (
              <span style={{ color: "#6b6a58" }}> · {prefill.unit}</span>
            )}
          </p>
        )}
      </div>
      <SoldierForm isNew prefill={prefill} />
    </div>
  );
}
