import Link from 'next/link';
import { ARTISTS } from '@/lib/artists-data';
import ArtistCard from '@/components/ArtistCard';
import TrendingCard from '@/components/TrendingCard';
import FeaturedArtistPhoto from '@/components/FeaturedArtistPhoto';
import ParticleBackground from '@/components/ParticleBackground';

export default function Home() {
  const featured = ARTISTS[0];
  const trending = ARTISTS.slice(1, 5);
  const rest = ARTISTS.slice(5, 11);

  const stats = [
    { value: `${ARTISTS.length}+`, label: 'Artistes' },
    { value: '6', label: 'Genres' },
    { value: '3', label: 'Continents' },
    { value: '100%', label: 'Indépendants' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated particle background */}
      <ParticleBackground />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,158,11,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-amber-500/5 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">
              AI-Powered · Mars 2026
            </span>
          </div>

          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="BeHere"
            className="w-28 h-28 md:w-36 md:h-36 object-contain mx-auto mb-4"
          />

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 leading-none">
            Be<span className="text-amber-400">Here</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-xl tracking-widest uppercase mb-3">
            Sois là où tu dois être
          </p>
          <p className="text-zinc-500 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            La première plateforme d&apos;artistes indépendants alimentée par l&apos;intelligence artificielle.
            Découverte sémantique, profils auto-générés, insights en temps réel.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/artists"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-all text-sm tracking-wider uppercase"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              Explorer avec l&apos;IA
            </Link>
            <Link
              href="/rejoindre"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-zinc-700 text-white font-medium rounded-full hover:border-amber-500/50 hover:text-amber-400 transition-all text-sm tracking-wider uppercase"
            >
              Créer ma page
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-amber-400">{s.value}</div>
                <div className="text-zinc-600 text-xs uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── AI DISCOVERY TEASER ───────────────────────────────── */}
      <section className="border-t border-zinc-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
            <span className="text-amber-400 text-sm font-medium uppercase tracking-widest">
              Découverte sémantique
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Décris ce que tu veux entendre
          </h2>
          <p className="text-zinc-500 mb-8 text-sm md:text-base">
            Pas de filtres, pas de catégories figées. Dis à l&apos;IA ce que tu cherches en langage naturel.
          </p>

          {/* Example queries */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              '"reggae fusion moderne"',
              '"trap caribéen authentique"',
              '"rap conscient diaspora"',
              '"dancehall nouvelle génération"',
            ].map((q) => (
              <Link
                key={q}
                href={`/artists?q=${encodeURIComponent(q.replace(/"/g, ''))}`}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-400 hover:text-amber-400 text-sm rounded-full transition-all"
              >
                {q}
              </Link>
            ))}
          </div>

          <Link
            href="/artists"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/15 rounded-full text-sm font-medium transition-all"
          >
            Ouvrir la recherche IA
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FEATURED ARTIST ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-medium uppercase tracking-widest">Sélection IA</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">Artiste à la une</h2>
          </div>
          <Link href="/artists" className="text-zinc-500 hover:text-amber-400 text-sm transition-colors">
            Tous les artistes →
          </Link>
        </div>

        <Link href={`/artists/${featured.slug}`} className="group block">
          <div className="relative rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 transition-all duration-300 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-8">
              {/* Avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden border border-amber-500/20">
                <FeaturedArtistPhoto artist={featured} className="rounded-2xl" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {featured.genre.slice(0, 3).map((g) => (
                    <span key={g} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-2 group-hover:text-amber-400 transition-colors">
                  {featured.name}
                </h3>
                <p className="text-zinc-500 text-sm mb-4 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {featured.city} · {featured.origin}
                </p>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-5 max-w-xl">{featured.bio}</p>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {featured.stats?.spotify && (
                    <div className="flex items-center gap-1.5 text-green-400/80 text-xs">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      <span>{featured.stats.spotify.toLocaleString()} auditeurs mensuels</span>
                    </div>
                  )}
                  {featured.youtube_channel && (
                    <a
                      href={`https://youtube.com/${featured.youtube_channel}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-red-400/80 hover:text-red-400 text-xs transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                      </svg>
                      Voir les clips
                    </a>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 group-hover:border-amber-500/50 group-hover:text-amber-400 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ── TRENDING ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black">Tendances</h2>
          <span className="text-zinc-600 text-xs uppercase tracking-widest">Classement IA</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((artist, i) => (
            <TrendingCard key={artist.id} artist={artist} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* ── ALL ARTISTS GRID ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-black mb-8">Tous les artistes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rest.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 px-8 py-3 border border-zinc-800 text-zinc-400 hover:border-amber-500/40 hover:text-amber-400 rounded-full text-sm transition-all"
          >
            Voir tous les artistes
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="border-t border-zinc-900 bg-zinc-950/50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-xs font-medium uppercase tracking-widest block mb-3">
              Architecture IA
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Comment ça fonctionne
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm">
              BeHere utilise Claude AI pour comprendre la musique en profondeur, pas juste la cataloguer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                ),
                title: 'Découverte sémantique',
                desc: 'Décris en langage naturel ce que tu cherches. L\'IA comprend le contexte, les émotions, les influences.',
              },
              {
                step: '02',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                ),
                title: 'Profils auto-générés',
                desc: 'Colle ton lien Spotify. L\'agent IA récupère tout, génère ta bio et construit ton profil complet.',
              },
              {
                step: '03',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
                    />
                  </svg>
                ),
                title: 'Insights en temps réel',
                desc: 'Analyse de style, influences clés, public cible — streamés par Claude directement sur la page artiste.',
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
                <div className="absolute top-4 right-4 text-zinc-800 text-2xl font-black">{item.step}</div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BEHERE ────────────────────────────────────────── */}
      <section className="border-t border-zinc-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Pourquoi <span className="text-amber-400">BeHere</span> ?
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm">
              Un artiste indépendant mérite des outils de niveau major. C&apos;est exactement ce qu&apos;on construit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                    />
                  </svg>
                ),
                title: 'Musique intégrée',
                desc: 'Spotify, SoundCloud, YouTube — directement sur ta page, sans redirection.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                ),
                title: 'Agent IA intégré',
                desc: 'Lien Spotify → profil complet en secondes. Bio générée, style analysé, stats importées.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                ),
                title: 'Visibilité mondiale',
                desc: 'Ton public local te trouve. Le monde te découvre. Géolocalisation intelligente incluse.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1.5">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────── */}
      <section className="border-t border-zinc-900 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="BeHere" className="w-10 h-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Prêt à être <span className="text-amber-400">là où tu dois être</span> ?
          </h2>
          <p className="text-zinc-500 mb-8 text-sm">
            Rejoins les artistes qui ont déjà leur page BeHere. L&apos;IA construit ton profil en quelques secondes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rejoindre"
              className="px-8 py-3.5 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-colors text-sm tracking-wider uppercase"
            >
              Créer ma page gratuitement
            </Link>
            <Link
              href="/artists"
              className="px-8 py-3.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 rounded-full text-sm transition-all"
            >
              Explorer les artistes
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="BeHere" className="w-8 h-8" />
            <div>
              <span className="text-white font-bold">Be<span className="text-amber-400">Here</span></span>
              <p className="text-zinc-600 text-xs">Plateforme des artistes indépendants</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <Link href="/artists" className="hover:text-zinc-400 transition-colors">Artistes</Link>
            <Link href="/rejoindre" className="hover:text-zinc-400 transition-colors">Rejoindre</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-700 text-xs">Propulsé par</span>
            <span className="text-xs font-medium text-zinc-500">Claude AI</span>
            <span className="text-zinc-800 text-xs">·</span>
            <span className="text-zinc-700 text-xs">© {new Date().getFullYear()} BeHere</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
