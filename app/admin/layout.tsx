import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import AdminNav from "./components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "superadmin"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]" style={{ backgroundColor: "#090b07" }}>
      <AdminNav />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
