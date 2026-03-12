/**
 * Agent d'enrichissement multi-sources pour les profils artistes.
 *
 * Sources (aucune clé API requise) :
 *  - Wikipedia EN + FR  — biographie + photo
 *  - Deezer API         — photo haute-résolution + stats fans
 *  - MusicBrainz API    — métadonnées vérifiées (MBID, pays, tags)
 *  - iTunes Search API  — confirmation du nom + genre
 *
 * Claude Sonnet synthétise toutes les données en :
 *  - photo_url        : meilleure photo trouvée
 *  - bio_enriched     : biographie étoffée en français (200-300 mots)
 *  - sources          : liste des sources utilisées
 *  - confidence       : score de confiance 0-1
 */

import Anthropic from '@anthropic-ai/sdk';
import { Artist } from './artists-data';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EnrichmentResult {
  photo_url: string | null;
  bio_enriched: string | null;
  sources: string[];
  confidence: number;
  raw: {
    wikipedia_en?: WikipediaData | null;
    wikipedia_fr?: WikipediaData | null;
    deezer?: DeezerData | null;
    musicbrainz?: MusicBrainzData | null;
    itunes?: ItunesData | null;
  };
  updated_at: string;
}

interface WikipediaData {
  title: string;
  extract: string;
  photo: string | null;
}

interface DeezerData {
  id: number;
  name: string;
  picture_xl: string;
  fans: number;
}

interface MusicBrainzData {
  id: string;
  name: string;
  country?: string;
  disambiguation?: string;
  genres: string[];
}

interface ItunesData {
  artistName: string;
  primaryGenreName: string;
  artistLinkUrl: string;
}

// ─── Source Fetchers ──────────────────────────────────────────────────────────

async function fetchWikipedia(name: string, lang: 'en' | 'fr'): Promise<WikipediaData | null> {
  try {
    const url =
      `https://${lang}.wikipedia.org/w/api.php?` +
      new URLSearchParams({
        action: 'query',
        prop: 'pageimages|extracts',
        titles: name,
        exintro: 'true',
        piprop: 'original',
        pithumbsize: '500',
        format: 'json',
        origin: '*',
        exsentences: '8',
        redirects: '1',
      });
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    const pages = data.query?.pages ?? {};
    const page = Object.values(pages)[0] as Record<string, unknown>;
    if (!page || page.missing !== undefined) return null;
    const extract = (page.extract as string) ?? '';
    if (!extract || extract.length < 50) return null;
    const original = (page.original as { source?: string }) ?? {};
    const thumbnail = (page.thumbnail as { source?: string }) ?? {};
    return {
      title: page.title as string,
      extract: extract.replace(/<[^>]+>/g, '').slice(0, 1500),
      photo: original.source ?? thumbnail.source ?? null,
    };
  } catch {
    return null;
  }
}

async function fetchDeezer(name: string): Promise<DeezerData | null> {
  try {
    const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=5&output=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    // Pick the result whose name most closely matches
    const results: DeezerData[] = data.data ?? [];
    const exact = results.find(
      (r) => r.name.toLowerCase() === name.toLowerCase()
    );
    const best = exact ?? results[0] ?? null;
    if (!best?.picture_xl) return null;
    return {
      id: best.id,
      name: best.name,
      picture_xl: best.picture_xl,
      fans: best.fans ?? 0,
    };
  } catch {
    return null;
  }
}

async function fetchMusicBrainz(name: string): Promise<MusicBrainzData | null> {
  try {
    const url =
      `https://musicbrainz.org/ws/2/artist/?` +
      new URLSearchParams({
        query: `artist:"${name}"`,
        fmt: 'json',
        limit: '3',
      });
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BeHere/1.0 (contact@behere.fr)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });
    const data = await res.json();
    const artist = data.artists?.[0];
    if (!artist) return null;
    return {
      id: artist.id,
      name: artist.name,
      country: artist.country,
      disambiguation: artist.disambiguation,
      genres: (artist.tags ?? []).slice(0, 8).map((t: { name: string }) => t.name),
    };
  } catch {
    return null;
  }
}

async function fetchItunes(name: string): Promise<ItunesData | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicArtist&limit=3`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;
    return {
      artistName: result.artistName,
      primaryGenreName: result.primaryGenreName,
      artistLinkUrl: result.artistLinkUrl,
    };
  } catch {
    return null;
  }
}

// ─── Claude Synthesis ─────────────────────────────────────────────────────────

async function synthesize(
  artist: Artist,
  sources: EnrichmentResult['raw']
): Promise<{ photo_url: string | null; bio_enriched: string; sources: string[]; confidence: number }> {

  const sourceSummary: string[] = [];

  if (sources.wikipedia_en) sourceSummary.push(`=== WIKIPEDIA EN ===\n${sources.wikipedia_en.extract}`);
  if (sources.wikipedia_fr) sourceSummary.push(`=== WIKIPEDIA FR ===\n${sources.wikipedia_fr.extract}`);
  if (sources.deezer) sourceSummary.push(`=== DEEZER ===\nNom: ${sources.deezer.name}, Fans: ${sources.deezer.fans.toLocaleString()}`);
  if (sources.musicbrainz) {
    const mb = sources.musicbrainz;
    sourceSummary.push(`=== MUSICBRAINZ ===\nNom officiel: ${mb.name}${mb.country ? `, Pays: ${mb.country}` : ''}${mb.disambiguation ? `, Note: ${mb.disambiguation}` : ''}\nTags: ${mb.genres.join(', ')}`);
  }
  if (sources.itunes) sourceSummary.push(`=== ITUNES ===\nNom: ${sources.itunes.artistName}, Genre principal: ${sources.itunes.primaryGenreName}`);

  // Photos candidates
  const photoCandidates: string[] = [];
  if (sources.deezer?.picture_xl) photoCandidates.push(`Deezer XL: ${sources.deezer.picture_xl}`);
  if (sources.wikipedia_en?.photo) photoCandidates.push(`Wikipedia EN: ${sources.wikipedia_en.photo}`);
  if (sources.wikipedia_fr?.photo) photoCandidates.push(`Wikipedia FR: ${sources.wikipedia_fr.photo}`);

  const prompt = `Tu es un expert en biographies musicales pour la plateforme BeHere.

ARTISTE: ${artist.name}
Genres: ${artist.genre.join(', ')}
Origine: ${artist.origin}
Bio actuelle (courte): ${artist.bio?.slice(0, 300) ?? 'Non renseignée'}

SOURCES TROUVÉES SUR LE WEB:
${sourceSummary.length > 0 ? sourceSummary.join('\n\n') : 'Aucune source trouvée.'}

PHOTOS DISPONIBLES:
${photoCandidates.length > 0 ? photoCandidates.join('\n') : 'Aucune'}

Ta mission:
1. Rédige une biographie officielle enrichie EN FRANÇAIS, 200-250 mots, ton professionnel mais humain. Commence directement. Intègre: origines, style musical, parcours, accomplissements, particularités artistiques. Si les sources sont limitées, base-toi sur ce que tu sais de cet artiste.
2. Choisis la MEILLEURE photo (préfère Deezer XL pour la qualité, sinon Wikipedia).
3. Évalue ta confiance (0.0 à 1.0) selon la quantité/fiabilité des sources trouvées.

Réponds UNIQUEMENT avec ce JSON (pas de markdown):
{
  "bio_enriched": "...",
  "best_photo_url": "url ou null",
  "sources_used": ["Wikipedia EN", "Deezer"],
  "confidence": 0.85
}`;

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content[0];
  if (text.type !== 'text') throw new Error('Unexpected AI response');

  const raw = JSON.parse(text.text) as {
    bio_enriched: string;
    best_photo_url: string | null;
    sources_used: string[];
    confidence: number;
  };

  return {
    photo_url: raw.best_photo_url ?? null,
    bio_enriched: raw.bio_enriched,
    sources: raw.sources_used ?? [],
    confidence: raw.confidence ?? 0.5,
  };
}

// ─── Main Enrichment Function ─────────────────────────────────────────────────

export async function enrichArtistProfile(artist: Artist): Promise<EnrichmentResult> {
  // Fetch all sources in parallel (max 6s each, failures are silent)
  const [wikiEn, wikiFr, deezer, musicbrainz, itunes] = await Promise.all([
    fetchWikipedia(artist.name, 'en'),
    fetchWikipedia(artist.name, 'fr'),
    fetchDeezer(artist.name),
    fetchMusicBrainz(artist.name),
    fetchItunes(artist.name),
  ]);

  const raw: EnrichmentResult['raw'] = {
    wikipedia_en: wikiEn,
    wikipedia_fr: wikiFr,
    deezer,
    musicbrainz,
    itunes,
  };

  const synthesis = await synthesize(artist, raw);

  return {
    photo_url: synthesis.photo_url,
    bio_enriched: synthesis.bio_enriched,
    sources: synthesis.sources,
    confidence: synthesis.confidence,
    raw,
    updated_at: new Date().toISOString(),
  };
}
