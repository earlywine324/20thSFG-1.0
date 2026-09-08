import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import AdminPreviewBar from "./components/AdminPreviewBar";
import { getViewRole } from "./lib/preview";
import { createClient } from "@/app/lib/supabase/server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISMG | LIONHEART Program",
  description:
    "The fictional Interagency Special Missions Group LIONHEART Program, an Arma realism community built around intelligence, investigations, interdiction, and direct action.",
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
          {/* LIONHEART accent stripe */}
          <div style={{
            height: "2px",
            background: "linear-gradient(90deg, #07090e 0%, rgba(201,166,90,0.2) 20%, #c9a65a 50%, rgba(201,166,90,0.2) 80%, #07090e 100%)"
          }} />
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/lionheart-emblem.webp" alt="LIONHEART emblem" width={44} height={44} className="h-11 w-11 object-contain" />
                  <div>
                    <p className="font-black text-sm tracking-widest uppercase" style={{ color: "#e8edf5" }}>Interagency Special Missions Group</p>
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: "#8892a4" }}>LIONHEART Program · Arma Realism</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed max-w-xs" style={{ color: "#8892a4" }}>
                  A fictional realism unit combining intelligence, federal investigations, counternarcotics, and special missions.
                </p>
                <p className="text-xs font-bold tracking-widest uppercase mt-3 italic" style={{ color: "#c9a65a" }}>
                  &quot;One Mission. Every Authority.&quot;
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#8892a4" }}>Navigation</p>
                <ul className="space-y-2">
                  {["Home", "About", "Roster", "Operations", "Enlist"].map((item) => (
                    <li key={item}>
                      <a href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className="text-xs transition-colors hover:text-[#c9a65a]" style={{ color: "#505870" }}>
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
                  <li>Program: <span style={{ color: "#8892a4" }}>LIONHEART</span></li>
                  <li>Platform: <span style={{ color: "#8892a4" }}>Arma + Other Games</span></li>
                  <li>Ops: <span style={{ color: "#8892a4" }}>Fri / Sat</span></li>
                </ul>
              </div>
            </div>
            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
              style={{ borderTop: "1px solid #161b27" }}>
              <p className="text-xs" style={{ color: "#505870" }}>
                © 2026 Interagency Special Missions Group community.
              </p>
              <p className="text-xs" style={{ color: "#505870" }}>
                Fictional gaming community. Not affiliated with any government agency or military organization.
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
