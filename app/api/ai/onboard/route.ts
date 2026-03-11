import { NextRequest } from 'next/server';
import { streamOnboarding } from '@/lib/ai';
import { getSpotifyToken } from '@/lib/spotify';

async function extractSpotifyId(url: string): Promise<string | null> {
  const match = url.match(/spotify\.com\/artist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('AI non configurée.', { status: 503 });
  }

  try {
    const { spotifyUrl } = await req.json();

    if (!spotifyUrl) {
      return new Response('URL Spotify manquante.', { status: 400 });
    }

    const artistId = await extractSpotifyId(spotifyUrl);
    if (!artistId) {
      return new Response('URL Spotify invalide.', { status: 400 });
    }

    // Fetch Spotify data
    const token = await getSpotifyToken();
    const [artistRes, tracksRes] = await Promise.all([
      fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=FR`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!artistRes.ok) {
      return new Response('Artiste Spotify introuvable.', { status: 404 });
    }

    const artistData = await artistRes.json();
    const tracksData = tracksRes.ok ? await tracksRes.json() : { tracks: [] };

    const profile = {
      name: artistData.name,
      genres: artistData.genres ?? [],
      followers: artistData.followers?.total ?? 0,
      popularity: artistData.popularity ?? 0,
      topTracks: (tracksData.tracks ?? []).slice(0, 5).map((t: { name: string }) => t.name),
    };

    const stream = streamOnboarding(profile);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[AI onboard]', err);
    return new Response('Erreur onboarding IA.', { status: 500 });
  }
}
