import { notFound } from 'next/navigation';
import { getArtistBySlug, ARTISTS } from '@/lib/artists-data';
import { getSpotifyArtist, getSpotifyArtistTopTracks } from '@/lib/spotify';
import ArtistPageClient from './ArtistPageClient';

// Dynamic — Spotify fetched at request time, not build time
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) return { title: 'Artiste non trouvé — BeHere' };
  return {
    title: `${artist.name} — BeHere`,
    description: artist.bio.slice(0, 160),
  };
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  let spotifyData = null;
  let topTracks = null;

  if (artist.spotify_id) {
    try {
      [spotifyData, topTracks] = await Promise.all([
        getSpotifyArtist(artist.spotify_id),
        getSpotifyArtistTopTracks(artist.spotify_id),
      ]);
    } catch {
      // Graceful fallback if Spotify unavailable
    }
  }

  const photoUrl = spotifyData?.images?.[0]?.url ?? null;
  const followers = spotifyData?.followers?.total
    ? new Intl.NumberFormat('fr-FR').format(spotifyData.followers.total)
    : null;
  const monthlyListeners = artist.stats?.spotify ?? null;

  return (
    <ArtistPageClient
      artist={artist}
      photoUrl={photoUrl}
      followers={followers}
      monthlyListeners={monthlyListeners}
      topTracks={topTracks?.tracks ?? []}
    />
  );
}
