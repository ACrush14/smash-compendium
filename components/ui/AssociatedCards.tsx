"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface AssociatedCardsProps {
  currentId: string;
  name: string;
  franchiseId: string;
}

type AssocItem = {
  id: string;
  name: string;
  typeLabel: string;
  gameLabel: string;
  url: string | null;
  href: string;
};

export default function AssociatedCards({ currentId, name, franchiseId }: AssociatedCardsProps) {
  const [items, setItems] = useState<AssocItem[] | null>(null);

  useEffect(() => {
    async function fetchAssoc() {
      if (!name || !franchiseId) return;
      try {
        const res = await fetch(`/api/associations?currentId=${encodeURIComponent(currentId)}&name=${encodeURIComponent(name)}&franchiseId=${encodeURIComponent(franchiseId)}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchAssoc();
  }, [currentId, name, franchiseId]);

  if (!items || items.length === 0) return null;

  const baseName = name.replace(/\s*\(.*?\)/g, "").trim();

  return (
    <div className="mt-8 mb-4 border-t border-vault-border/20 pt-6 px-4">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-800 mb-4 px-2 text-center md:text-left">
        Associações · {baseName}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 md:justify-start justify-center">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group shrink-0 flex flex-col items-center w-24 gap-2 transition-all hover:-translate-y-1"
          >
            <div className="relative w-20 h-20 rounded-xl bg-slate-900/40 border border-vault-border/30 overflow-hidden flex items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-slate-900/80 transition-all shadow-md">
              {item.url ? (
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  sizes="80px"
                  unoptimized={item.url.endsWith(".gif")}
                />
              ) : (
                <span className="text-2xl opacity-10 font-bold">?</span>
              )}
            </div>
            <div className="text-center w-full min-w-0">
              <p className="text-[10px] font-bold text-slate-300 truncate leading-tight group-hover:text-cyan-400 transition-colors">
                {item.name}
              </p>
              <p className="text-[9px] text-slate-500 font-mono truncate leading-tight mt-0.5">
                {item.typeLabel}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
