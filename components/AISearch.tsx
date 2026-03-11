'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Artist } from '@/lib/artists-data';

type DiscoveryResult = {
  matches: Artist[];
  explanation: string;
  suggestions: string[];
  mood: string;
};

const EXAMPLES = [
  'reggae fusion avec influences modernes',
  'trap caribéen authentique',
  'hip-hop conscient de la diaspora',
  'dancehall roots nouvelle génération',
  'rap introspectif et technique',
];

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [error, setError] = useState('');
  const [exampleIdx, setExampleIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setExampleIdx((i) => (i + 1) % EXAMPLES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  async function handleSearch(q?: string) {
    const searchQuery = q ?? query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/ai/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Erreur lors de la recherche.');
        return;
      }

      const data: DiscoveryResult = await res.json();
      setResult(data);
    } catch {
      setError('Connexion impossible. Réessaie.');
    } finally {
      setLoading(false);
    }
  }

  function useSuggestion(s: string) {
    setQuery(s);
    handleSearch(s);
  }

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="relative">
        <div
          className={`flex items-center gap-3 bg-zinc-900/80 border rounded-2xl px-5 py-4 transition-all duration-300 ${
            loading
              ? 'border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
              : 'border-zinc-700 hover:border-zinc-500 focus-within:border-amber-500/60 focus-within:shadow-[0_0_30px_rgba(245,158,11,0.12)]'
          }`}
        >
          {/* AI icon */}
          <div className="shrink-0">
            {loading ? (
              <svg
                className="w-5 h-5 text-amber-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={`Ex : "${EXAMPLES[exampleIdx]}"`}
            className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm outline-none"
          />

          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="shrink-0 px-4 py-1.5 bg-amber-500 text-black text-sm font-bold rounded-xl hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Découvrir
          </button>
        </div>

        {/* Powered by */}
        <p className="mt-2 text-xs text-zinc-600 text-right">
          Propulsé par{' '}
          <span className="text-zinc-500 font-medium">Claude AI</span>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 px-4 py-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-5 animate-fade-in">
          {/* AI explanation */}
          <div className="flex gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
            <div>
              {result.mood && (
                <span className="inline-block mb-1 px-2 py-0.5 bg-amber-500/15 text-amber-400 text-xs font-medium rounded-full capitalize">
                  {result.mood}
                </span>
              )}
              <p className="text-zinc-300 text-sm leading-relaxed">{result.explanation}</p>
            </div>
          </div>

          {/* Matched artists */}
          {result.matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.matches.map((artist) => (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}`}
                  className="group flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 rounded-xl transition-all hover:bg-zinc-800/60"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-amber-500/20 to-zinc-800 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {artist.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate group-hover:text-amber-400 transition-colors">
                      {artist.name}
                    </p>
                    <p className="text-zinc-500 text-xs truncate">
                      {artist.genre.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-600 ml-auto shrink-0 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm text-center py-4">
              Aucun artiste correspondant trouvé. Essaie une autre recherche.
            </p>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div>
              <p className="text-zinc-600 text-xs mb-2">Essaie aussi :</p>
              <div className="flex flex-wrap gap-2">
                {result.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => useSuggestion(s)}
                    className="px-3 py-1.5 bg-zinc-800/80 border border-zinc-700 hover:border-amber-500/40 text-zinc-400 hover:text-amber-400 text-xs rounded-full transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
