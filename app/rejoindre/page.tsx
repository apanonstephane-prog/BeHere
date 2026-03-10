'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';

const GENRES = [
  'Hip-Hop', 'Rap', 'Trap', 'Reggae', 'Dancehall', 'R&B', 'Afrobeat',
  'Pop', 'Rock', 'Électro', 'Jazz', 'Classique', 'Autre',
];

export default function RejoindreePage() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    artist_name: '',
    email: '',
    genre: '',
    spotify_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.artist_name) {
      setError('Nom d\'artiste et email sont obligatoires.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur');
      setStep('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setError(message.includes('duplicate') || message.includes('unique')
        ? 'Cet email est déjà inscrit sur la liste d\'attente.'
        : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {step === 'success' ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Tu es sur la liste !
          </h2>
          <p className="text-zinc-400 max-w-md mb-8">
            On te contacte dès que ta page est prête. En attendant, explore les artistes déjà présents sur BeHere.
          </p>
          <Link
            href="/artists"
            className="px-8 py-3 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-colors text-sm uppercase tracking-wider"
          >
            Découvrir les artistes
          </Link>
        </div>
      ) : (
        <div className="max-w-lg mx-auto px-4 pt-20 pb-16">
          {/* Back */}
          <Link href="/" className="text-zinc-500 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 mb-10">
            ← Retour
          </Link>

          {/* Header */}
          <div className="mb-10">
            <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30 uppercase tracking-wider font-bold">
              Bêta — Places limitées
            </span>
            <h1 className="text-4xl font-black text-white mt-4 mb-2">
              Crée ta page<br />
              <span className="text-amber-400">artiste</span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Rejoins la liste d'attente. Dès que c'est ton tour, on construit ta page ensemble — musique, clips, biographie — en quelques minutes.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { icon: '🎵', label: 'Spotify intégré' },
              { icon: '▶️', label: 'Clips YouTube' },
              { icon: '📊', label: 'Stats & booking' },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-center">
                <div className="text-2xl mb-1">{f.icon}</div>
                <p className="text-zinc-400 text-xs">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Form */}
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
                Lien Spotify (facultatif)
              </label>
              <input
                type="url"
                placeholder="https://open.spotify.com/artist/..."
                value={form.spotify_url}
                onChange={(e) => setForm({ ...form, spotify_url: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
              />
              <p className="text-zinc-600 text-xs mt-1">Facultatif — on l&apos;utilise pour construire ta page automatiquement</p>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
            >
              {loading ? 'Inscription en cours...' : 'Rejoindre la liste d\'attente'}
            </button>

            <p className="text-zinc-600 text-xs text-center">
              Gratuit · Pas de spam · Tu peux te désinscrire à tout moment
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
