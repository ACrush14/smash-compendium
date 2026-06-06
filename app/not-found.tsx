export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-700 mb-4">
          404
        </p>
        <h1 className="font-mono text-2xl text-slate-300 tracking-widest uppercase">
          Page in Construction
        </h1>
        <div className="mt-3 h-px w-24 bg-cyan-500/30 mx-auto" />
      </div>
    </div>
  );
}
