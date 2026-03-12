'use client';

import Link from 'next/link';
import { Artist } from '@/lib/artists-data';
import { useState, useEffect } from 'react';
import AIArtistInsights from '@/components/AIArtistInsights';

interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  external_urls: { spotify: string };
  album: { images: { url: string }[] };
  duration_ms: number;
}

interface YouTubeVideo {
  id: string;
  title: string;
}

interface Props {
  artist: Artist;
  photoUrl: string | null;
  followers: string | null;
  monthlyListeners: string | null;
  topTracks: SpotifyTrack[];
}

function msToMinSec(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const YT_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YT_BASE = 'https://www.googleapis.com/youtube/v3';

export default function ArtistPageClient({
  artist,
  photoUrl,
  followers,
  monthlyListeners,
  topTracks,
}: Props) {
  const [activeTab, setActiveTab] = useState<'music' | 'videos' | 'about' | 'ai'>('music');
  const [activeRelease, setActiveRelease] = useState(0);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [enrichedPhoto, setEnrichedPhoto] = useState<string | null>(null);
  const [enrichedBio, setEnrichedBio] = useState<string | null>(null);

  const photo = enrichedPhoto ?? artist.photo_url ?? photoUrl;
  const youtubeHandle = artist.youtube_channel ?? artist.youtube_channel2 ?? null;

  // Enrichissement silencieux au chargement : vérifie le cache,
  // déclenche l'agent en arrière-plan si nécessaire.
  useEffect(() => {
    fetch(`/api/agents/enrich?slug=${artist.slug}`)
      .then((r) => r.json())
      .then((data: { cached?: boolean; photo_url?: string | null; bio_enriched?: string | null }) => {
        if (data.cached) {
          if (data.photo_url) setEnrichedPhoto(data.photo_url);
          if (data.bio_enriched) setEnrichedBio(data.bio_enriched);
        } else {
          // Pas en cache → lancer l'enrichissement silencieusement
          fetch('/api/agents/enrich', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: artist.slug }),
          })
            .then((r) => r.json())
            .then((result: { photo_url?: string | null; bio_enriched?: string | null }) => {
              if (result.photo_url) setEnrichedPhoto(result.photo_url);
              if (result.bio_enriched) setEnrichedBio(result.bio_enriched);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [artist.slug]);

  // Fetch automatique des clips depuis YouTube — côté client (navigateur)
  useEffect(() => {
    if (!youtubeHandle || !YT_KEY) return;
    const handle = youtubeHandle.startsWith('@') ? youtubeHandle.slice(1) : youtubeHandle;
    setLoadingVideos(true);

    fetch(`${YT_BASE}/channels?part=contentDetails&forHandle=${encodeURIComponent(handle)}&key=${YT_KEY}`)
      .then((r) => r.json())
      .then((data) => {
        const uploadsId = data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsId) { setLoadingVideos(false); return; }
        return fetch(`${YT_BASE}/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=50&key=${YT_KEY}`)
          .then((r) => r.json())
          .then((vidData) => {
            const list: YouTubeVideo[] = (vidData.items ?? [])
              .filter((item: { snippet?: { resourceId?: { videoId?: string } } }) => item.snippet?.resourceId?.videoId)
              .map((item: { snippet: { resourceId: { videoId: string }; title: string } }) => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
              }));
            setVideos(list);
          });
      })
      .catch(() => {})
      .finally(() => setLoadingVideos(false));
  }, [youtubeHandle]);

  const initials = artist.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-black">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link href="/artists" className="text-zinc-500 hover:text-amber-400 transition-colors text-sm flex items-center gap-2">
          ← Tous les artistes
        </Link>
      </div>

      {/* HERO */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Photo */}
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-700">
              {photo ? (
                <img src={photo} alt={artist.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-zinc-900">
                  <span className="text-4xl md:text-5xl font-black text-amber-400">{initials}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                  {artist.label ?? 'Indépendant'}
                </span>
                <span className="text-xs text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1" />
                  BeHere
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3">
                {artist.name}
              </h1>
              <p className="text-zinc-400 text-sm mb-4 flex items-center gap-2 flex-wrap">
                <span>📍 {artist.origin}</span>
                <span className="text-zinc-700">·</span>
                <span>{artist.genre.join(' · ')}</span>
              </p>

              {/* Stats */}
              <div className="flex gap-6 mb-6 flex-wrap">
                {monthlyListeners && (
                  <div>
                    <p className="text-white font-bold">{monthlyListeners}</p>
                    <p className="text-zinc-500 text-xs">Auditeurs Spotify</p>
                  </div>
                )}
                {followers && (
                  <div>
                    <p className="text-white font-bold">{followers}</p>
                    <p className="text-zinc-500 text-xs">Abonnés Spotify</p>
                  </div>
                )}
                {artist.stats?.instagram && (
                  <div>
                    <p className="text-white font-bold">{artist.stats.instagram}</p>
                    <p className="text-zinc-500 text-xs">Instagram</p>
                  </div>
                )}
                {artist.releases && (
                  <div>
                    <p className="text-white font-bold">{artist.releases.length}</p>
                    <p className="text-zinc-500 text-xs">Projets</p>
                  </div>
                )}
              </div>

              {/* Liens streaming */}
              <div className="flex gap-3 flex-wrap">
                {artist.spotify_id && (
                  <a
                    href={`https://open.spotify.com/artist/${artist.spotify_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-black text-sm font-bold rounded-full hover:bg-green-400 transition-colors flex items-center gap-2"
                  >
                    ♫ Spotify
                  </a>
                )}
                {artist.instagram && (
                  <a
                    href={`https://instagram.com/${artist.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-zinc-800 text-white text-sm rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
                  >
                    Instagram
                  </a>
                )}
                {artist.booking_email && (
                  <a
                    href={`mailto:${artist.booking_email}`}
                    className="px-4 py-2 bg-amber-500 text-black text-sm font-bold rounded-full hover:bg-amber-400 transition-colors"
                  >
                    Booking
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="sticky top-14 z-30 bg-black/90 backdrop-blur border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {(['music', 'videos', 'about', 'ai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'text-amber-400 border-amber-400'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              {tab === 'music' && 'Musique'}
              {tab === 'videos' && `Clips${videos.length ? ` (${videos.length})` : ''}`}
              {tab === 'about' && 'À propos'}
              {tab === 'ai' && (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  Analyse IA
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* MUSIC */}
        {activeTab === 'music' && (
          <div className="space-y-12">
            {artist.releases && artist.releases.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-white mb-6">Discographie</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                  {artist.releases.map((release, i) => (
                    <button
                      key={release.id}
                      onClick={() => setActiveRelease(i)}
                      className={`group text-left rounded-xl overflow-hidden border transition-all ${
                        activeRelease === i
                          ? 'border-amber-500/50 shadow-lg shadow-amber-500/10'
                          : 'border-zinc-800 hover:border-zinc-600'
                      } bg-zinc-900`}
                    >
                      <div className="aspect-square bg-zinc-800 flex items-center justify-center text-3xl">
                        {release.cover_url
                          ? <img src={release.cover_url} alt={release.title} className="w-full h-full object-cover" />
                          : release.type === 'single' ? '🎵' : release.type === 'mixtape' ? '📼' : '💿'}
                      </div>
                      <div className="p-3">
                        <p className="text-white text-xs font-bold truncate">{release.title}</p>
                        <p className="text-zinc-500 text-xs">{release.year} · {release.type}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {artist.releases[activeRelease] && (
                  <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
                    <h3 className="text-white font-bold mb-4">{artist.releases[activeRelease].title}</h3>
                    {artist.releases[activeRelease].spotify_id && (
                      <iframe
                        src={`https://open.spotify.com/embed/${
                          artist.releases[activeRelease].type === 'single' ? 'track' : 'album'
                        }/${artist.releases[activeRelease].spotify_id}?utm_source=generator&theme=0`}
                        width="100%"
                        height="152"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-xl"
                      />
                    )}
                    {artist.releases[activeRelease].soundcloud_url && (
                      <iframe
                        width="100%"
                        height="166"
                        scrolling="no"
                        src={`${artist.releases[activeRelease].soundcloud_url}&color=%23f59e0b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                        className="rounded-xl"
                      />
                    )}
                    {!artist.releases[activeRelease].spotify_id &&
                      !artist.releases[activeRelease].soundcloud_url && (
                        <div className="text-center py-8">
                          <a
                            href={`https://open.spotify.com/search/${encodeURIComponent(artist.releases[activeRelease].title + ' ' + artist.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            Rechercher sur Spotify →
                          </a>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

            {topTracks.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-white mb-6">Top titres Spotify</h2>
                <div className="space-y-2">
                  {topTracks.slice(0, 10).map((track, i) => (
                    <a
                      key={track.id}
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-900 group transition-colors"
                    >
                      <span className="text-zinc-600 text-sm w-4 text-right group-hover:text-amber-400">{i + 1}</span>
                      {track.album.images[0] && (
                        <img src={track.album.images[0].url} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="text-white text-sm flex-1 truncate group-hover:text-amber-400">{track.name}</span>
                      <span className="text-zinc-500 text-xs">{msToMinSec(track.duration_ms)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {(!artist.releases || artist.releases.length === 0) && topTracks.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zinc-500">Musique disponible bientôt.</p>
                {artist.spotify_id && (
                  <a
                    href={`https://open.spotify.com/artist/${artist.spotify_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-green-400 hover:text-green-300 text-sm"
                  >
                    Écouter sur Spotify →
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIDEOS */}
        {activeTab === 'videos' && (
          <div>
            {loadingVideos ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : videos.length > 0 ? (
              <>
                <h2 className="text-xl font-black text-white mb-6">Clips ({videos.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          loading="lazy"
                        />
                      </div>
                      <p className="px-3 py-2 text-zinc-400 text-xs truncate">{video.title}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : artist.youtube_featured_video ? (
              /* Fallback: show the featured video if YouTube API key not configured */
              <div>
                <h2 className="text-xl font-black text-white mb-6">Clip</h2>
                <div className="max-w-2xl rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${artist.youtube_featured_video}`}
                      title={`${artist.name} — clip officiel`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </div>
                {youtubeHandle && (
                  <a
                    href={`https://youtube.com/${youtubeHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                    </svg>
                    Voir toute la chaîne YouTube →
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                  </svg>
                </div>
                <p className="text-zinc-400 font-medium mb-1">Clips YouTube</p>
                <p className="text-zinc-600 text-sm mb-4">
                  {youtubeHandle
                    ? 'Configure NEXT_PUBLIC_YOUTUBE_API_KEY pour charger les clips automatiquement.'
                    : 'Chaîne YouTube non renseignée.'}
                </p>
                {youtubeHandle && (
                  <a
                    href={`https://youtube.com/${youtubeHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/15 rounded-full text-sm font-medium transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                    </svg>
                    Voir la chaîne YouTube
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI INSIGHTS */}
        {activeTab === 'ai' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-black mb-1">Analyse IA</h2>
              <p className="text-zinc-500 text-sm mb-6">
                Analyse de style, ADN sonore et recommandations générées par Claude AI.
              </p>
              <AIArtistInsights slug={artist.slug} />
            </div>

            {/* Genre tags */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {artist.genre.map((g) => (
                  <span key={g} className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-full">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {artist.stats?.spotify && (
              <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Données Spotify</h3>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <span className="text-white font-bold">{artist.stats.spotify.toLocaleString()}</span>
                  <span className="text-zinc-500 text-sm">auditeurs mensuels</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-black text-white mb-4">Biographie</h2>
                <p className="text-zinc-400 leading-relaxed">
                  {enrichedBio ?? artist.bio}
                </p>
              </div>
              {artist.timeline && artist.timeline.length > 0 && (
                <div>
                  <h2 className="text-xl font-black text-white mb-6">Parcours</h2>
                  <div className="space-y-4">
                    {artist.timeline.map((event, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          {i < artist.timeline!.length - 1 && (
                            <div className="w-0.5 flex-1 bg-zinc-800 mt-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          <span className="text-amber-400 text-xs font-bold">{event.year}</span>
                          <p className="text-zinc-300 text-sm">{event.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5">
                <h3 className="text-white font-bold text-sm mb-4">Infos</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-zinc-500 text-xs">Origine</p>
                    <p className="text-zinc-200 text-sm">{artist.origin}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Genre</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {artist.genre.map((g) => (
                        <span key={g} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full">{g}</span>
                      ))}
                    </div>
                  </div>
                  {artist.label && (
                    <div>
                      <p className="text-zinc-500 text-xs">Label</p>
                      <p className="text-zinc-200 text-sm">{artist.label}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5">
                <h3 className="text-white font-bold text-sm mb-4">Liens</h3>
                <div className="space-y-2">
                  {artist.spotify_id && (
                    <a href={`https://open.spotify.com/artist/${artist.spotify_id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm">
                      <span className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-green-400 text-xs">♫</span>
                      Spotify
                    </a>
                  )}
                  {artist.instagram && (
                    <a href={`https://instagram.com/${artist.instagram}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm">
                      <span className="w-6 h-6 rounded bg-pink-500/20 flex items-center justify-center text-pink-400 text-xs">📸</span>
                      @{artist.instagram}
                    </a>
                  )}
                  {artist.youtube_channel && (
                    <a href={`https://youtube.com/${artist.youtube_channel}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm">
                      <span className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center text-red-400 text-xs">▶</span>
                      YouTube
                    </a>
                  )}
                  {artist.booking_email && (
                    <a href={`mailto:${artist.booking_email}`}
                      className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm">
                      <span className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs">✉</span>
                      Booking
                    </a>
                  )}
                </div>
              </div>

              {artist.stats && Object.keys(artist.stats).length > 0 && (
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5">
                  <h3 className="text-white font-bold text-sm mb-4">Statistiques</h3>
                  <div className="space-y-2">
                    {Object.entries(artist.stats).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-zinc-500 text-xs capitalize">{k}</span>
                        <span className="text-zinc-200 text-xs font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
