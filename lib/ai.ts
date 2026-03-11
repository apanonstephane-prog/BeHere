import Anthropic from '@anthropic-ai/sdk';
import { Artist, ARTISTS } from './artists-data';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Artist Discovery ────────────────────────────────────────────────────────

export type DiscoveryResult = {
  matches: Artist[];
  explanation: string;
  suggestions: string[];
  mood: string;
};

export async function discoverArtists(query: string): Promise<DiscoveryResult> {
  const context = ARTISTS.map((a) => ({
    slug: a.slug,
    name: a.name,
    genres: a.genre,
    origin: a.origin,
    bio: a.bio?.slice(0, 300) ?? '',
    stats: a.stats?.spotify ?? 0,
  }));

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Tu es curateur musical pour BeHere — plateforme d'artistes indépendants caribéens, français et internationaux.

Requête: "${query}"

Artistes disponibles:
${JSON.stringify(context)}

Réponds UNIQUEMENT avec un JSON valide (aucun markdown):
{
  "matches": ["slug1", "slug2"],
  "explanation": "Explication courte (1-2 phrases) en français",
  "suggestions": ["autre recherche 1", "autre recherche 2"],
  "mood": "mot unique décrivant l'ambiance (ex: introspectif, festif, rebelle)"
}

Max 5 artistes. Si aucune correspondance, retourne tableau vide.`,
      },
    ],
  });

  const text = message.content[0];
  if (text.type !== 'text') throw new Error('Unexpected AI response type');

  const raw = JSON.parse(text.text) as {
    matches: string[];
    explanation: string;
    suggestions: string[];
    mood: string;
  };

  return {
    matches: raw.matches
      .map((slug) => ARTISTS.find((a) => a.slug === slug))
      .filter(Boolean) as Artist[],
    explanation: raw.explanation,
    suggestions: raw.suggestions ?? [],
    mood: raw.mood ?? '',
  };
}

// ─── Artist Insights (streaming) ─────────────────────────────────────────────

export function streamArtistInsights(artist: Artist): ReadableStream<Uint8Array> {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Tu es un critique musical expert. Analyse cet artiste indépendant pour la plateforme BeHere.

**${artist.name}**
Genres: ${artist.genre.join(', ')}
Origine: ${artist.origin}
Bio: ${artist.bio?.slice(0, 400) ?? 'Non disponible'}
Auditeurs Spotify: ${artist.stats?.spotify?.toLocaleString() ?? 'N/A'}
Sorties: ${artist.releases?.length ?? 0}

Génère une analyse en 4 sections courtes en français:

**Style signature** — Ce qui rend cet artiste unique (1-2 phrases)
**ADN sonore** — Ses influences et ce qui forge son identité musicale
**Public cible** — Profil de l'auditeur idéal (1 phrase)
**Écoute aussi** — 2-3 artistes connus aux sonorités similaires

Ton: authentique, direct, expert. Max 180 mots.`,
      },
    ],
  });

  return stream.toReadableStream();
}

// ─── AI Bio Generation ───────────────────────────────────────────────────────

export type SpotifyProfile = {
  name: string;
  genres: string[];
  followers: number;
  popularity: number;
  topTracks: string[];
};

export async function generateArtistBio(profile: SpotifyProfile): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 350,
    messages: [
      {
        role: 'user',
        content: `Génère une biographie professionnelle pour cet artiste indépendant à intégrer sur BeHere.

Données Spotify:
- Nom: ${profile.name}
- Genres: ${profile.genres.join(', ')}
- Abonnés: ${profile.followers.toLocaleString()}
- Popularité: ${profile.popularity}/100
- Top titres: ${profile.topTracks.slice(0, 5).join(', ')}

Biographie en français, 3-4 phrases, ton authentique. Commence directement par le contenu.`,
      },
    ],
  });

  const text = message.content[0];
  if (text.type !== 'text') throw new Error('Unexpected AI response type');
  return text.text;
}

// ─── Onboarding Agent ────────────────────────────────────────────────────────

export type OnboardingStep = {
  step: 'fetching' | 'analyzing' | 'writing' | 'done';
  message: string;
  data?: Record<string, unknown>;
};

export function streamOnboarding(
  spotifyData: SpotifyProfile
): ReadableStream<Uint8Array> {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `Tu es l'agent d'onboarding de BeHere. Un artiste vient de soumettre son profil.

Données récupérées:
- Nom: ${spotifyData.name}
- Genres: ${spotifyData.genres.join(', ')}
- Abonnés Spotify: ${spotifyData.followers.toLocaleString()}
- Popularité: ${spotifyData.popularity}/100
- Top titres: ${spotifyData.topTracks.slice(0, 5).join(', ')}

Génère:
1. Une biographie artistique (3-4 phrases, première personne)
2. 3-5 tags de style précis (ex: "trap caribéen", "futu-roots", "conscious rap")
3. Un message de bienvenue personnalisé pour l'artiste (1-2 phrases)

Format JSON:
{
  "bio": "...",
  "styleTags": ["...", "..."],
  "welcomeMessage": "..."
}`,
      },
    ],
  });

  return stream.toReadableStream();
}
