import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import AdminPreviewBar from "./components/AdminPreviewBar";
import { getViewRole } from "./lib/preview";
import { createClient } from "@/app/lib/supabase/server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "20th Special Forces Group | Arma Realism Unit",
  description:
    "20th Special Forces Group milsim community featuring ODA and special operations aviation structure.",
};

async function AdminBar() {
  // Check if the current user is a real admin before rendering the bar
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  const isRealAdmin = !!(profile && ["admin", "superadmin"].includes(profile.role));
  if (!isRealAdmin) return null;

  const viewRole = await getViewRole();
  return <AdminPreviewBar current={viewRole} />;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#07090e", color: "#e8edf5" }}>
        <Nav />
        <main className="flex-1 pt-16">{children}</main>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #161b27", backgroundColor: "#07090e" }}>
          {/* Blue accent stripe */}
          <div style={{
            height: "2px",
            background: "linear-gradient(90deg, #07090e 0%, rgba(77,182,224,0.2) 20%, #4db6e0 50%, rgba(77,182,224,0.2) 80%, #07090e 100%)"
          }} />
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{
                    border: "2px solid rgba(77,182,224,0.35)",
                    background: "radial-gradient(circle, #0c0f17, #07090e)",
                  }}>
                    <span className="text-xs font-black" style={{ color: "#4db6e0" }}>20</span>
                  </div>
                  <div>
                    <p className="font-black text-sm tracking-widest uppercase" style={{ color: "#e8edf5" }}>20th Special Forces Group</p>
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: "#8892a4" }}>Arma Realism Unit · ODA 2011</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed max-w-xs" style={{ color: "#8892a4" }}>
                  A milsim unit organized around an Operational Detachment Alpha and supporting special operations aviation crew.
                </p>
                <p className="text-xs font-bold tracking-widest uppercase mt-3 italic" style={{ color: "#4db6e0" }}>
                  &quot;De Oppresso Liber&quot;
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#8892a4" }}>Navigation</p>
                <ul className="space-y-2">
                  {["Home", "About", "Roster", "Operations", "Enlist"].map((item) => (
                    <li key={item}>
                      <a href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className="text-xs transition-colors hover:text-[#4db6e0]" style={{ color: "#505870" }}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#8892a4" }}>Unit Info</p>
                <ul className="space-y-2 text-xs" style={{ color: "#505870" }}>
                  <li>Game: <span style={{ color: "#8892a4" }}>Arma + others</span></li>
                  <li>Type: <span style={{ color: "#8892a4" }}>Milsim Realism</span></li>
                  <li>Modeled: <span style={{ color: "#8892a4" }}>20th SFG</span></li>
                  <li>Platform: <span style={{ color: "#8892a4" }}>Arma + Other Games</span></li>
                  <li>Ops: <span style={{ color: "#8892a4" }}>Fri / Sat</span></li>
                </ul>
              </div>
            </div>
            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
              style={{ borderTop: "1px solid #161b27" }}>
              <p className="text-xs" style={{ color: "#505870" }}>
                © 2026 20th Special Forces Group community. Not affiliated with the U.S. Army.
              </p>
              <p className="text-xs" style={{ color: "#505870" }}>
                Fictional gaming community for entertainment purposes only.
              </p>
            </div>
          </div>
        </footer>

        {/* Admin preview mode toggle — only renders for real admins */}
        <AdminBar />
      </body>
    </html>
  );
}
