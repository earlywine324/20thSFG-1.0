export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#c9a128", borderTopColor: "transparent" }} />
        <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: "#6b6a58" }}>Loading</p>
      </div>
    </div>
  );
}
