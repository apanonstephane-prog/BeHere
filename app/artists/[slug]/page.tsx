import { notFound } from 'next/navigation';
import { getArtistBySlug, ARTISTS } from '@/lib/artists-data';
import { getSpotifyArtist, getSpotifyArtistTopTracks } from '@/lib/spotify';
import { getYouTubeArtistData, YouTubeVideo } from '@/lib/youtube';
import ArtistPageClient from './ArtistPageClient';

// Dynamic — data fetched at request time
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

  // Fetch Spotify + YouTube in parallel
  const youtubeHandle = artist.youtube_channel ?? artist.youtube_channel2 ?? null;

  const [spotifyResults, youtubeData] = await Promise.allSettled([
    artist.spotify_id
      ? Promise.all([
          getSpotifyArtist(artist.spotify_id),
          getSpotifyArtistTopTracks(artist.spotify_id),
        ])
      : Promise.resolve(null),
    youtubeHandle ? getYouTubeArtistData(youtubeHandle) : Promise.resolve(null),
  ]);

  const spotifyData =
    spotifyResults.status === 'fulfilled' && Array.isArray(spotifyResults.value)
      ? spotifyResults.value[0]
      : null;
  const topTracks =
    spotifyResults.status === 'fulfilled' && Array.isArray(spotifyResults.value)
      ? spotifyResults.value[1]
      : null;

  const ytData =
    youtubeData.status === 'fulfilled' ? youtubeData.value : null;

  // Photo priority: Spotify → YouTube channel → null (shows initials)
  const photoUrl =
    spotifyData?.images?.[0]?.url ?? ytData?.channelPhotoUrl ?? null;

  const followers = spotifyData?.followers?.total
    ? new Intl.NumberFormat('fr-FR').format(spotifyData.followers.total)
    : null;
  const monthlyListeners = artist.stats?.spotify ?? null;

  const videos: YouTubeVideo[] = ytData?.videos ?? [];

  return (
    <ArtistPageClient
      artist={artist}
      photoUrl={photoUrl}
      followers={followers}
      monthlyListeners={monthlyListeners}
      topTracks={topTracks?.tracks ?? []}
      videos={videos}
    />
  );
}
