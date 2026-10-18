// O template remonta a cada navegação (o layout não): dá um fade curto ao trocar de página.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
