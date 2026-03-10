import Link from 'next/link';
import { ARTISTS } from '@/lib/artists-data';

export default function Home() {
  const featured = ARTISTS[0]; // Monstaaa L'Ovni
  const trending = ARTISTS.slice(1, 5);
  const grid = ARTISTS.slice(5, 11);

  return (
    <div className="min-h-screen bg-black">

      {/* HERO — Logo plein écran */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />
        <div className="relative z-20 text-center px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://raw.githubusercontent.com/apanonstephane-prog/BeHere/main/BeHere_Logo_transparent.png"
            alt="BeHere"
            className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto mb-8"
          />
          <p className="text-zinc-400 text-lg md:text-xl tracking-widest uppercase mb-2">
            Sois là où tu dois être
          </p>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-6">
            Be<span className="text-amber-400">Here</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10">
            La plateforme qui rassemble tous les artistes indépendants en un seul endroit.
            Musique, clips, biographie — tout est là.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/artists"
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-colors text-sm tracking-wider uppercase"
            >
              Découvrir les artistes
            </Link>
            <Link
              href="/rejoindre"
              className="px-8 py-3 border border-zinc-700 text-white rounded-full hover:border-amber-500/50 transition-colors text-sm tracking-wider uppercase"
            >
              Créer ma page
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* FEATURED ARTIST */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Artiste à la une
          </h2>
          <Link href="/artists" className="text-amber-400 text-sm hover:text-amber-300 transition-colors">
            Voir tous →
          </Link>
        </div>
        <Link href={`/artists/${featured.slug}`} className="group block">
          <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 transition-all p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="relative z-20 max-w-lg">
              <span className="inline-block px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                ● En ce moment
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-3 group-hover:text-amber-400 transition-colors">
                {featured.name}
              </h3>
              <p className="text-zinc-400 mb-4 flex items-center gap-2">
                <span>🎵</span> {featured.genre.join(' · ')}
                <span className="text-zinc-600">·</span>
                <span>{featured.city}</span>
              </p>
              <p className="text-zinc-500 text-sm line-clamp-3 mb-6">{featured.bio}</p>
              <div className="flex flex-wrap gap-3">
                {featured.releases?.slice(0, 3).map((r) => (
                  <span key={r.id} className="text-xs px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">
                    {r.title} ({r.year})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* TRENDING */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">Tendances</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.slug}`} className="group block">
              <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all p-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-zinc-800 flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-amber-400">
                    {artist.name[0]}
                  </span>
                </div>
                <h4 className="text-white text-sm font-bold truncate group-hover:text-amber-400 transition-colors">
                  {artist.name}
                </h4>
                <p className="text-zinc-500 text-xs mt-0.5">{artist.genre[0]}</p>
                {artist.stats?.spotify && (
                  <p className="text-green-500/70 text-xs mt-1">{artist.stats.spotify}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ARTIST GRID */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-black text-white mb-8">Tous les artistes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {grid.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.slug}`} className="group block">
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 transition-all p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-amber-400">{artist.name[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white text-sm font-bold truncate group-hover:text-amber-400 transition-colors">
                      {artist.name}
                    </h4>
                    <p className="text-zinc-500 text-xs truncate">{artist.origin}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {artist.genre.slice(0, 2).map((g) => (
                    <span key={g} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/artists"
            className="inline-block px-8 py-3 border border-zinc-700 text-zinc-300 rounded-full hover:border-amber-500/50 hover:text-amber-400 transition-all text-sm"
          >
            Voir tous les artistes →
          </Link>
        </div>
      </section>

      {/* WHY BEHERE */}
      <section className="bg-zinc-950 border-t border-zinc-900 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Pourquoi <span className="text-amber-400">BeHere</span> ?
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-14">
            Un artiste mérite une présence en ligne qui lui ressemble vraiment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎵',
                title: 'Musique intégrée',
                desc: 'Tes sons Spotify, SoundCloud et YouTube directement sur ta page — sans redirection.',
              },
              {
                icon: '🤖',
                title: 'Agent IA',
                desc: 'Entre ton lien Spotify ou Instagram, l\'agent récupère tout automatiquement et construit ta page.',
              },
              {
                icon: '🌍',
                title: 'Visibilité internationale',
                desc: 'Géolocalisation intelligente — ton public local te trouve, le monde te découvre.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-left">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-zinc-900 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">
              Be<span className="text-amber-400">Here</span>
            </span>
            <span className="text-zinc-600 text-sm">— La plateforme des artistes indépendants</span>
          </div>
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} BeHere. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
