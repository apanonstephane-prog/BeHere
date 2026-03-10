'use client';

import { useState, useMemo } from 'react';
import { ARTISTS } from '@/lib/artists-data';
import ArtistCard from '@/components/ArtistCard';

const GENRES = ['Tous', 'Hip-Hop', 'Reggae', 'Trap', 'Dancehall', 'Rap', 'West Coast'];
const CITIES = ['Tous', 'France', 'USA', 'Jamaica', 'Martinique'];

export default function ArtistsPage() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Tous');
  const [city, setCity] = useState('Tous');

  const filtered = useMemo(() => {
    return ARTISTS.filter((a) => {
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.bio.toLowerCase().includes(search.toLowerCase()) ||
        a.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()));
      const matchGenre =
        genre === 'Tous' ||
        a.genre.some((g) => g.toLowerCase().includes(genre.toLowerCase()));
      const matchCity =
        city === 'Tous' ||
        a.country.toLowerCase().includes(city.toLowerCase()) ||
        a.city.toLowerCase().includes(city.toLowerCase()) ||
        a.origin.toLowerCase().includes(city.toLowerCase());
      return matchSearch && matchGenre && matchCity;
    });
  }, [search, genre, city]);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-900 pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Les <span className="text-amber-400">Artistes</span>
          </h1>
          <p className="text-zinc-400 mb-8">
            {ARTISTS.length} artistes sur BeHere — musique, clips, biographies
          </p>

          {/* Search */}
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un artiste, un genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          {/* Genre filters */}
          <div className="flex gap-2 flex-wrap mb-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                  genre === g
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* City filters */}
          <div className="flex gap-2 flex-wrap">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  city === c
                    ? 'bg-zinc-700 text-white'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-zinc-500 text-sm mb-6">
          {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          {search && ` pour "${search}"`}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">Aucun artiste trouvé.</p>
            <button
              onClick={() => { setSearch(''); setGenre('Tous'); setCity('Tous'); }}
              className="mt-4 text-amber-400 text-sm hover:text-amber-300"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {filtered.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
