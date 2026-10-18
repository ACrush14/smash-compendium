import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { gzipSync, gunzipSync } from "node:zlib";

/** Tag única de todos os dados em cache do site; revalidateSite() limpa tudo de uma vez. */
export const CACHE_TAG = "site-data";

/**
 * Guarda o resultado de uma consulta ao banco por `revalidate` segundos (padrão 1 h), para que visitas
 * seguintes não esperem o banco. O resultado precisa ser serializável em JSON (Date vira string).
 * Páginas que usam `searchParams` são dinâmicas e não passam pelo cache de página — este cache de dados as acelera.
 */
export function cachedQuery<T>(key: string[], fn: () => Promise<T>, revalidate = 3600): Promise<T> {
  return unstable_cache(fn, ["q", ...key], { revalidate, tags: [CACHE_TAG] })();
}

/** Descarta o cache de dados e de páginas — chamado depois de edições no admin. */
export function revalidateSite() {
  revalidateTag(CACHE_TAG);
  revalidatePath("/", "layout");
}

/**
 * Igual a cachedQuery, mas guarda o resultado comprimido (gzip+base64). O cache de dados do Next ignora
 * entradas acima de 2 MB; resultados grandes (spirits ≈ 5,7 MB em JSON) ficam em ~1 MB comprimidos.
 */
export async function cachedQueryZ<T>(key: string[], fn: () => Promise<T>, revalidate = 3600): Promise<T> {
  const packed = await unstable_cache(
    async () => gzipSync(JSON.stringify(await fn())).toString("base64"),
    ["qz", ...key],
    { revalidate, tags: [CACHE_TAG] },
  )();
  return JSON.parse(gunzipSync(Buffer.from(packed, "base64")).toString("utf8")) as T;
}
