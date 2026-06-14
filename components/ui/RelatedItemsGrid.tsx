import Image from "next/image";
import Link from "next/link";

export interface RelatedItem {
  id: string;
  name: string;
  smashGameVersion: string | null;
  assetRenderUrl: string | null;
  type: string;
}

export default function RelatedItemsGrid({ items }: { items: RelatedItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full mt-4 max-w-sm mx-auto">
      <div className="grid grid-cols-4 gap-2">
        {items.map(rel => {
          const isFighter = rel.type === "FIGHTER";
          const isSpirit = rel.type === "SPIRIT";
          const href = isFighter
            ? `/fighters/${rel.id}`
            : isSpirit
            ? `/collectibles?type=SPIRIT&trophy=${rel.id}`
            : `/collectibles?type=${rel.type}&game=${rel.smashGameVersion}&trophy=${rel.id}`;

          const typeLabel = isFighter ? "FIGHTER" : rel.smashGameVersion?.replace("SSB4_", "") || rel.type;

          return (
            <Link
              key={rel.id + rel.type}
              href={href}
              className="group flex flex-col items-center bg-slate-900/40 border border-vault-border/30 hover:border-vault-accent/50 hover:bg-slate-800/60 rounded-lg p-1.5 transition-all relative overflow-hidden"
              title={rel.name}
            >
              <div className="relative w-full aspect-square mb-1 rounded bg-slate-950/50 flex items-center justify-center overflow-hidden">
                {rel.assetRenderUrl ? (
                  <Image
                    src={rel.assetRenderUrl}
                    alt={rel.name}
                    fill
                    className="object-contain p-0.5 group-hover:scale-110 transition-transform duration-300"
                    sizes="64px"
                  />
                ) : (
                  <span className="text-xl opacity-20">?</span>
                )}
              </div>
              <p className="text-[9px] font-medium text-slate-300 truncate w-full text-center leading-tight group-hover:text-white transition-colors">
                {rel.name}
              </p>
              <p className="text-[8px] font-mono font-bold text-vault-accent/70 mt-0.5 tracking-wider truncate max-w-full">
                {typeLabel}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
