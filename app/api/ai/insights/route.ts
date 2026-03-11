import { NextRequest } from 'next/server';
import { streamArtistInsights } from '@/lib/ai';
import { getArtistBySlug } from '@/lib/artists-data';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('AI non configurée.', { status: 503 });
  }

  const artist = getArtistBySlug(slug);
  if (!artist) {
    return new Response('Artist not found', { status: 404 });
  }

  try {
    const stream = streamArtistInsights(artist);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[AI insights]', err);
    return new Response('Erreur analyse IA.', { status: 500 });
  }
}
