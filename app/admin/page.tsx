import Link from "next/link";

const SECTIONS = [
  { href: "/admin/fighters",     title: "Lutadores",         desc: "Revisar e aprovar os 90 lutadores.", accent: false },
  { href: "/admin/collectibles", title: "Colecionáveis",     desc: "Troféus, stickers e spirits: ligações e dados.", accent: false },
  { href: "/admin/chronicles",   title: "Chronicles",        desc: "Histórico dos jogos: capas, datas e links.", accent: false },
  { href: "/admin/music",        title: "Músicas (lutador)", desc: "Música icônica de cada personagem.", accent: false },
  { href: "/admin/music-tracks", title: "Faixas de música",  desc: "Mais de 1.100 faixas do SSBU: editar, filtrar, YouTube.", accent: false },
  { href: "/admin/timestamps",   title: "Timestamps",        desc: "Início e fim dos vídeos: Melee, Brawl e Smash 4.", accent: true },
  { href: "/admin/create",       title: "Construtor",        desc: "Criar novos registros no banco.", accent: false },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8">
      <h1 className="mb-2 text-3xl font-bold">Painel do admin</h1>
      <p className="mb-8 text-gray-400">
        Escolha uma seção aqui ou na barra no topo. Nela também ficam os botões <b>Limpar cache</b> (para ver edições feitas fora do painel), <b>Ver site</b> e <b>Sair</b>.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className={`rounded-lg border p-6 transition-colors ${
              s.accent ? "border-cyan-900/40 hover:bg-cyan-950/40" : "border-zinc-800 hover:bg-zinc-900"
            }`}
          >
            <h2 className="mb-2 text-xl font-semibold">{s.title}</h2>
            <p className="text-sm text-gray-400">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
