'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ARTISTS } from '@/lib/artists-data';
import ArtistCard from '@/components/ArtistCard';
import AISearch from '@/components/AISearch';
import { Suspense } from 'react';

const GENRES = ['Tous', 'Hip-Hop', 'Reggae', 'Trap', 'Dancehall', 'Rap', 'West Coast'];
const ZONES = ['Tous', 'France', 'USA', 'Jamaica', 'Martinique'];

function ArtistsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Tous');
  const [zone, setZone] = useState('Tous');
  const [mode, setMode] = useState<'classic' | 'ai'>('classic');

  // Hydrate search query from URL (e.g. coming from home page)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearch(q);
      setMode('classic');
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return ARTISTS.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(q) ||
        (a.bio?.toLowerCase().includes(q) ?? false) ||
        a.genre.some((g) => g.toLowerCase().includes(q));
      const matchGenre =
        genre === 'Tous' ||
        a.genre.some((g) => g.toLowerCase().includes(genre.toLowerCase()));
      const matchZone =
        zone === 'Tous' ||
        a.country.toLowerCase().includes(zone.toLowerCase()) ||
        a.city.toLowerCase().includes(zone.toLowerCase()) ||
        a.origin.toLowerCase().includes(zone.toLowerCase());
      return matchSearch && matchGenre && matchZone;
    });
  }, [search, genre, zone]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Header ─────────────────────────────────── */}
      <div className="bg-zinc-950/80 border-b border-zinc-900 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-1">
            Les <span className="text-amber-400">Artistes</span>
          </h1>
          <p className="text-zinc-500 text-sm mb-8">
            {ARTISTS.length} artistes · musique, clips, biographies
          </p>

          {/* Mode toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-6">
            <button
              onClick={() => setMode('classic')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'classic'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Filtres
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'ai'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              Recherche IA
            </button>
          </div>

          {/* ── Classic mode ──────────────────────── */}
          {mode === 'classic' && (
            <div className="space-y-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un artiste, un genre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      genre === g
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {ZONES.map((z) => (
                  <button
                    key={z}
                    onClick={() => setZone(z)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      zone === z
                        ? 'bg-zinc-700 text-white'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── AI mode ──────────────────────────── */}
          {mode === 'ai' && (
            <div className="max-w-2xl">
              <AISearch />
            </div>
          )}
        </div>
      </div>

      {/* ── Classic results ──────────────────────── */}
      {mode === 'classic' && (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-zinc-600 text-xs mb-6 uppercase tracking-wider">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            {search && ` pour "${search}"`}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-zinc-500 mb-4">Aucun artiste correspondant.</p>
              <button
                onClick={() => { setSearch(''); setGenre('Tous'); setZone('Tous'); }}
                className="text-amber-400 text-sm hover:text-amber-300 transition-colors"
              >
                Réinitialiser les filtres
              </button>
              <div className="mt-6">
                <button
                  onClick={() => setMode('ai')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm rounded-full hover:bg-amber-500/15 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  Essayer la recherche IA
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ArtistsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ArtistsContent />
    </Suspense>
  );
}
