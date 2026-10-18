"use client";

import { useState, type ImgHTMLAttributes } from "react";
import { localImageUrl, type ImageTier } from "@/lib/media-config";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  /** URL original (ex.: do wiki). A versão local leve é escolhida pelo `tier`. */
  src: string;
  tier?: ImageTier;
};

/**
 * <img> leve para listas pequenas: usa a versão local WebP e volta para a URL original se faltar.
 * Para servidores (páginas) que não podem ter onError inline.
 */
export default function FallbackImg({ src, tier = "thumb", alt = "", ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  const local = localImageUrl(src, tier);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      loading="lazy"
      decoding="async"
      {...rest}
      alt={alt}
      src={failed ? src : local}
      onError={() => { if (!failed && local !== src) setFailed(true); }}
    />
  );
}
