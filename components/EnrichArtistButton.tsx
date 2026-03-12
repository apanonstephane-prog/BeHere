'use client';

import { useState } from 'react';

interface EnrichmentResult {
  photo_url: string | null;
  bio_enriched: string | null;
  sources: string[];
  confidence: number;
  updated_at: string;
  from_cache?: boolean;
}

interface Props {
  slug: string;
  onEnriched: (result: EnrichmentResult) => void;
}

const STEPS = [
  { key: 'wikipedia', label: 'Wikipedia EN & FR…', icon: '📖' },
  { key: 'deezer',    label: 'Deezer — photo officielle…', icon: '🎵' },
  { key: 'music',     label: 'MusicBrainz — métadonnées…', icon: '🎸' },
  { key: 'itunes',    label: 'iTunes — confirmation…', icon: '🍎' },
  { key: 'claude',    label: 'Claude — synthèse & bio…', icon: '✨' },
];

export default function EnrichArtistButton({ slug, onEnriched }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<EnrichmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setState('loading');
    setStepIdx(0);
    setError(null);

    // Simulate step progress while waiting for the actual response
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const res = await fetch('/api/agents/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      clearInterval(interval);

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Enrichissement échoué');
      }

      const data = await res.json() as EnrichmentResult;
      setResult(data);
      setState('done');
      onEnriched(data);
    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setState('error');
    }
  };

  if (state === 'idle') {
    return (
      <button
        onClick={run}
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/15 rounded-full text-xs font-medium transition-all group"
      >
        <svg className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
        Enrichir avec l&apos;IA
      </button>
    );
  }

  if (state === 'loading') {
    return (
      <div className="flex flex-col gap-2 p-4 bg-zinc-900/80 border border-amber-500/20 rounded-xl max-w-xs">
        <p className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Recherche en cours…
        </p>
        <div className="space-y-1.5">
          {STEPS.map((step, i) => (
            <div
              key={step.key}
              className={`flex items-center gap-2 text-xs transition-all ${
                i < stepIdx
                  ? 'text-green-400'
                  : i === stepIdx
                  ? 'text-white'
                  : 'text-zinc-600'
              }`}
            >
              <span>{i < stepIdx ? '✓' : i === stepIdx ? '›' : '·'}</span>
              <span>{step.icon} {step.label}</span>
              {i === stepIdx && (
                <span className="w-3 h-3 border border-amber-400 border-t-transparent rounded-full animate-spin ml-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex items-center gap-3">
        <span className="text-red-400 text-xs">{error}</span>
        <button
          onClick={() => setState('idle')}
          className="text-xs text-zinc-500 hover:text-zinc-300 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Done
  const pct = Math.round((result?.confidence ?? 0) * 100);
  const confidenceColor = pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-amber-400' : 'text-zinc-500';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-400">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        {result?.from_cache ? 'Mis en cache' : 'Enrichissement terminé'}
      </div>
      {result?.sources && result.sources.length > 0 && (
        <span className={`text-xs ${confidenceColor}`}>
          {result.sources.join(' · ')} — {pct}% confiance
        </span>
      )}
      <button
        onClick={run}
        className="text-xs text-zinc-600 hover:text-zinc-400 underline"
      >
        Actualiser
      </button>
    </div>
  );
}
