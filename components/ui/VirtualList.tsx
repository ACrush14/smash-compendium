"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lista com rolagem que só monta as linhas visíveis (+ uma margem), com altura de linha fixa.
 * Com 1.582 itens isso evita criar 1.582 botões/imagens; e quando a lista está escondida (celular),
 * quase nada é montado. Mantém o item ativo à vista ao navegar por teclado/setas.
 */
export default function VirtualList({
  count,
  rowHeight = 48,
  activeIndex,
  className,
  renderRow,
}: {
  count: number;
  rowHeight?: number;
  activeIndex: number;
  className?: string;
  renderRow: (index: number) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(700);
  const first = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.clientHeight || 0);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mantém o item ativo visível (na 1ª vez vai direto, sem animação — ex.: link com ?trophy=<id> no meio da lista).
  useEffect(() => {
    const el = ref.current;
    if (!el || !el.clientHeight) return;
    const top = activeIndex * rowHeight;
    const smooth = first.current ? "auto" : "smooth";
    if (first.current) {
      el.scrollTo({ top: Math.max(0, top - el.clientHeight / 2 + rowHeight / 2), behavior: smooth });
      first.current = false;
    } else if (top < el.scrollTop) {
      el.scrollTo({ top, behavior: smooth });
    } else if (top + rowHeight > el.scrollTop + el.clientHeight) {
      el.scrollTo({ top: top + rowHeight - el.clientHeight, behavior: smooth });
    }
  }, [activeIndex, rowHeight]);

  const OVERSCAN = 8;
  const visibleRows = Math.ceil(height / rowHeight);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
  const end = Math.min(count, start + visibleRows + OVERSCAN * 2);
  const rows: ReactNode[] = [];
  for (let i = start; i < end; i++) {
    rows.push(
      <div key={i} style={{ position: "absolute", top: i * rowHeight, left: 0, right: 0, height: rowHeight }}>
        {renderRow(i)}
      </div>,
    );
  }

  return (
    <div ref={ref} onScroll={e => setScrollTop(e.currentTarget.scrollTop)} className={className}>
      <div style={{ position: "relative", height: count * rowHeight }}>{rows}</div>
    </div>
  );
}
