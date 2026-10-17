import { Skeleton } from "./SkeletonImage";

/** Skeleton da grade de cards (roster, coleções, franquias). */
export function GridSkeleton({ items = 18 }: { items?: number }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8" aria-busy="true" aria-label="Carregando">
      <Skeleton className="mb-6 h-8 w-64 rounded" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: items }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
    </main>
  );
}

/** Skeleton da lista cronológica do Chronicles. */
export function ListSkeleton({ rows = 12 }: { rows?: number }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8" aria-busy="true" aria-label="Carregando">
      <Skeleton className="mb-6 h-8 w-56 rounded" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-md" />
        ))}
      </div>
    </main>
  );
}

/** Skeleton da página do lutador: vault à esquerda, ficha à direita. */
export function FighterPageSkeleton() {
  return (
    <main className="grid min-h-screen grid-cols-1 gap-4 p-4 lg:grid-cols-12" aria-busy="true" aria-label="Carregando">
      <div className="flex flex-col gap-3 lg:col-span-5">
        <Skeleton className="aspect-square w-full rounded-md" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-11 rounded-sm" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:col-span-7">
        <Skeleton className="h-10 w-2/3 rounded" />
        <Skeleton className="h-5 w-1/3 rounded" />
        <Skeleton className="h-44 w-full rounded-md" />
        <Skeleton className="h-44 w-full rounded-md" />
        <Skeleton className="h-44 w-full rounded-md" />
      </div>
    </main>
  );
}
