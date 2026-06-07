import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-gray-400 mb-8">Select a section to manage content:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/fighters" className="p-6 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Fighters</h2>
          <p className="text-gray-500 text-sm">Manage Smash Bros fighters.</p>
        </Link>
        <Link href="/admin/collectibles" className="p-6 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Collectibles</h2>
          <p className="text-gray-500 text-sm">Manage items, spirits, and trophies.</p>
        </Link>
        <Link href="/admin/chronicles" className="p-6 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Chronicles</h2>
          <p className="text-gray-500 text-sm">Manage game history and lore.</p>
        </Link>
        <Link href="/admin/music" className="p-6 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Music (Fighter)</h2>
          <p className="text-gray-500 text-sm">Música icônica por personagem.</p>
        </Link>
        <Link href="/admin/music-tracks" className="p-6 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Music Tracks</h2>
          <p className="text-gray-500 text-sm">1.100+ faixas SSBU — editar, filtrar, YouTube.</p>
        </Link>
        <Link href="/admin/create" className="p-6 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Create New</h2>
          <p className="text-gray-500 text-sm">Add new database entries.</p>
        </Link>
      </div>
    </div>
  );
}
