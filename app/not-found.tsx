import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
      <p className="text-amber-400 text-sm uppercase tracking-widest font-bold mb-4">404</p>
      <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
        Pas trouvé
      </h1>
      <p className="text-zinc-400 max-w-md mb-10">
        Cette page n&apos;existe pas ou a été déplacée. Retourne à l&apos;accueil ou explore les artistes.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-colors text-sm"
        >
          Accueil
        </Link>
        <Link
          href="/artists"
          className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-full hover:border-amber-500/50 hover:text-amber-400 transition-colors text-sm"
        >
          Les artistes
        </Link>
      </div>
    </div>
  );
}
