import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyToken, getSpotifyArtist, getSpotifyArtistTopTracks } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const artistId = searchParams.get('artistId');
  const action = searchParams.get('action') ?? 'artist';

  if (!artistId) {
    return NextResponse.json({ error: 'Missing artistId' }, { status: 400 });
  }

  try {
    if (action === 'top-tracks') {
      const data = await getSpotifyArtistTopTracks(artistId);
      return NextResponse.json(data);
    }
    if (action === 'token') {
      const token = await getSpotifyToken();
      return NextResponse.json({ token });
    }
    const data = await getSpotifyArtist(artistId);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Spotify API error:', err);
    return NextResponse.json({ error: 'Spotify API error' }, { status: 500 });
  }
}
