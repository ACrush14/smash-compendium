"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FilterX } from "lucide-react";

export interface FighterItem {
  id: string;
  name: string;
  slug: string;
  rosterNumber: string;
  imageUrl: string | null;
  franchise: string;
  debutGame: string;
  debutVersion: string;
}

const DEBUT_VERSIONS = [
  { id: "SSB64", label: "Smash 64" },
  { id: "SSBM",  label: "Melee" },
  { id: "SSBB",  label: "Brawl" },
  { id: "SSB4",  label: "Smash 4" },
  { id: "SSBU",  label: "Ultimate" },
];

export default function FighterGrid({ fighters }: { fighters: FighterItem[] }) {
  const [search, setSearch] = useState("");
  const [activeFranchise, setActiveFranchise] = useState<string | null>(null);
  const [activeDebut, setActiveDebut] = useState<string | null>(null);

  // Extrair franquias únicas e ordenar
  const franchises = useMemo(() => {
    const set = new Set(fighters.map((f) => f.franchise));
    return Array.from(set).sort((a, b) => {
      // Deixar Smash Bros no topo (Mii Fighters)
      if (a === "Super Smash Bros.") return -1;
      if (b === "Super Smash Bros.") return 1;
      return a.localeCompare(b);
    });
  }, [fighters]);

  // Filtragem
  const filtered = useMemo(() => {
    return fighters.filter((f) => {
      if (activeFranchise && f.franchise !== activeFranchise) return false;
      if (activeDebut && f.debutVersion !== activeDebut) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!f.name.toLowerCase().includes(q) && !f.franchise.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [fighters, activeFranchise, activeDebut, search]);

  return (
    <div className="space-y-8">
      {/* ─── FILTROS ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-6 xl:items-start bg-zinc-900/40 p-4 md:p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative flex-shrink-0 w-full xl:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar lutador..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Era Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold mr-2">Era</span>
            <button
              onClick={() => setActiveDebut(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!activeDebut ? "bg-white text-black" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
            >
              All
            </button>
            {DEBUT_VERSIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveDebut(v.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDebut === v.id ? "bg-white text-black" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Franchise Filter */}
          <div className="flex flex-wrap items-center gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-2 pb-2">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold mr-2">Franchise</span>
            <button
              onClick={() => setActiveFranchise(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!activeFranchise ? "bg-white text-black" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
            >
              All
            </button>
            {franchises.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFranchise(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeFranchise === f ? "border-white bg-white/10 text-white" : "border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Clear All */}
        {(search || activeFranchise || activeDebut) && (
          <button 
            onClick={() => { setSearch(""); setActiveFranchise(null); setActiveDebut(null); }}
            className="flex items-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-2xl transition-colors flex-shrink-0 text-sm font-bold uppercase tracking-wider"
          >
            <FilterX className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* ─── GRID ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-zinc-500 font-mono text-sm uppercase tracking-widest px-2">
        <span>Showing {filtered.length} Fighters</span>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
      >
        <AnimatePresence>
          {filtered.map((fighter) => (
            <motion.div
              key={fighter.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/fighters/${fighter.slug}`} className="block group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-800/50 to-zinc-950 border border-white/5 group-hover:border-white/20 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  
                  {/* Roster Number Background */}
                  <div className="absolute -top-4 -right-2 text-[100px] font-black text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors duration-500">
                    {fighter.rosterNumber.replace(/e$/, "")}
                  </div>

                  {/* Echo Fighter Indicator */}
                  {fighter.rosterNumber.endsWith("e") && (
                    <div className="absolute top-3 left-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.5)] z-10">
                      ε
                    </div>
                  )}

                  {/* Fighter Image */}
                  <div className="absolute inset-x-2 bottom-12 top-6 flex items-center justify-center">
                    {fighter.imageUrl ? (
                      <Image
                        src={fighter.imageUrl}
                        alt={fighter.name}
                        fill
                        className="object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-600 font-medium">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay for Text */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

                  {/* Info */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1 line-clamp-1">
                      {fighter.franchise}
                    </span>
                    <h3 className="font-black text-lg leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-colors">
                      {fighter.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-zinc-500">
            <FilterX className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-xl font-light">Nenhum lutador encontrado.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
