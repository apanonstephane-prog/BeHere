'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const GENRES = [
  'Hip-Hop', 'Rap', 'Trap', 'Reggae', 'Dancehall', 'R&B', 'Afrobeat',
  'Pop', 'Rock', 'Électro', 'Jazz', 'Classique', 'Autre',
];

type AIPreview = {
  bio?: string;
  styleTags?: string[];
  welcomeMessage?: string;
};

export default function RejoindreePage() {
  const [step, setStep] = useState<'form' | 'ai-building' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    artist_name: '',
    email: '',
    genre: '',
    spotify_url: '',
  });

  // AI onboarding state
  const [aiText, setAiText] = useState('');
  const [aiPreview, setAiPreview] = useState<AIPreview | null>(null);
  const [aiStep, setAiStep] = useState(0);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  useEffect(() => {
    return () => { readerRef.current?.cancel(); };
  }, []);

  const AI_STEPS = [
    'Connexion à Spotify...',
    'Analyse de tes données musicales...',
    'Génération de ta biographie avec Claude AI...',
    'Construction de ton profil...',
  ];

  async function runAIOnboarding() {
    if (!form.spotify_url) return false;

    setStep('ai-building');
    setAiStep(0);
    setAiText('');
    setAiPreview(null);

    // Progress through steps
    const stepTimer = setInterval(() => {
      setAiStep((s) => Math.min(s + 1, AI_STEPS.length - 1));
    }, 1500);

    try {
      const res = await fetch('/api/ai/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotifyUrl: form.spotify_url }),
      });

      clearInterval(stepTimer);

      if (!res.ok) {
        // Fallback to regular success
        return false;
      }

      const reader = res.body?.getReader();
      if (!reader) return false;
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                fullText += parsed.delta.text;
                setAiText(fullText);
              }
            } catch { /* skip */ }
          }
        }
      }

      // Try to parse JSON from response
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as AIPreview;
          setAiPreview(parsed);
        }
      } catch { /* not parseable yet */ }

      return true;
    } catch {
      clearInterval(stepTimer);
      return false;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.artist_name) {
      setError("Nom d'artiste et email sont obligatoires.");
      return;
    }

    setLoading(true);

    // If Spotify URL provided, run AI onboarding first
    if (form.spotify_url) {
      await runAIOnboarding();
    }

    // Submit to waitlist
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur');
      if (step !== 'ai-building') setStep('success');
      else setTimeout(() => setStep('success'), 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setError(
        message.includes('duplicate') || message.includes('unique')
          ? "Cet email est déjà inscrit sur la liste d'attente."
          : message
      );
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  // ── AI Building Screen ─────────────────────────────────────────────────────
  if (step === 'ai-building') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          {/* Animated orb */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-amber-500/20 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-amber-500/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-2">L&apos;IA construit ton profil</h2>
          <p className="text-zinc-500 text-sm mb-10">Claude analyse tes données Spotify pour créer ta page</p>

          {/* Steps */}
          <div className="space-y-3 mb-10 text-left">
            {AI_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  i < aiStep
                    ? 'bg-amber-500 border-amber-500'
                    : i === aiStep
                    ? 'border-amber-500/60 bg-amber-500/10'
                    : 'border-zinc-700'
                }`}>
                  {i < aiStep ? (
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i === aiStep ? (
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ) : null}
                </div>
                <span className={`text-sm transition-colors ${
                  i <= aiStep ? 'text-zinc-300' : 'text-zinc-600'
                }`}>{s}</span>
              </div>
            ))}
          </div>

          {/* Streaming preview */}
          {aiText && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Aperçu IA</span>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1 h-1 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed line-clamp-4">{aiText}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Tu es sur la liste !</h2>

        {aiPreview?.welcomeMessage ? (
          <div className="max-w-md mb-6">
            <p className="text-amber-400/80 italic text-sm mb-4">&ldquo;{aiPreview.welcomeMessage}&rdquo;</p>
            {aiPreview.styleTags && aiPreview.styleTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {aiPreview.styleTags.map((t) => (
                  <span key={t} className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-zinc-400 max-w-md mb-8 text-sm">
            On te contacte dès que ta page est prête. En attendant, explore les artistes déjà présents sur BeHere.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/artists"
            className="px-8 py-3 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-colors text-sm uppercase tracking-wider"
          >
            Découvrir les artistes
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-zinc-700 text-zinc-400 rounded-full hover:border-zinc-500 text-sm transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-lg mx-auto px-4 pt-20 pb-16">
        <Link href="/" className="text-zinc-500 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 mb-10">
          ← Retour
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="text-amber-400 text-xs font-medium">Bêta — Places limitées</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Crée ta page<br />
            <span className="text-amber-400">artiste</span>
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Rejoins la liste d&apos;attente. L&apos;agent IA construit ton profil complet — bio, clips, stats — en quelques secondes.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: '🎵', label: 'Spotify intégré' },
            { icon: '🤖', label: 'Bio IA' },
            { icon: '📊', label: 'Stats & booking' },
          ].map((f) => (
            <div key={f.label} className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-zinc-500 text-xs">{f.label}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
              Nom d&apos;artiste <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex : Monstaaa L'Ovni"
              value={form.artist_name}
              onChange={(e) => setForm({ ...form, artist_name: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
              Email <span className="text-amber-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="ton@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
              Genre musical
            </label>
            <select
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50 transition-colors text-sm appearance-none"
            >
              <option value="" className="bg-zinc-900">Choisir un genre...</option>
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-zinc-900">{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
              Lien Spotify
              <span className="ml-2 normal-case text-zinc-600">— l&apos;IA génère ta bio automatiquement</span>
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://open.spotify.com/artist/..."
                value={form.spotify_url}
                onChange={(e) => setForm({ ...form, spotify_url: e.target.value })}
                className={`w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm ${
                  form.spotify_url
                    ? 'border-amber-500/40 focus:border-amber-500/60'
                    : 'border-zinc-800 focus:border-amber-500/50'
                }`}
              />
              {form.spotify_url && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-amber-400/70 text-xs">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  IA activée
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {form.spotify_url ? "L'IA analyse ton profil..." : "Inscription..."}
              </>
            ) : (
              form.spotify_url ? '🤖 Créer ma page avec l\'IA' : 'Rejoindre la liste d\'attente'
            )}
          </button>

          <p className="text-zinc-700 text-xs text-center">
            Gratuit · Sans spam · Désabonnement à tout moment
          </p>
        </form>
      </div>
    </div>
  );
}
