import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="bg-[#090b07] min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black mb-4" style={{ color: "#c9a128", fontFamily: "monospace" }}>403</p>
        <h1 className="text-xl font-black tracking-widest uppercase mb-3" style={{ color: "#e8e4d8" }}>
          ACCESS DENIED
        </h1>
        <p className="text-sm mb-2" style={{ color: "#8a8870", fontFamily: "monospace" }}>
          SECURITY CLEARANCE INSUFFICIENT
        </p>
        <p className="text-xs mb-8" style={{ color: "#6b6a58" }}>
          You do not have the required permissions to access this area.
          Contact your chain of command if you believe this is an error.
        </p>
        <Link href="/" className="text-xs font-black tracking-widest uppercase px-6 py-3 rounded inline-block"
          style={{ backgroundColor: "#1c2014", color: "#e8e4d8", border: "1px solid #2a2e1c" }}>
          Return to Base
        </Link>
      </div>
    </div>
  );
}
