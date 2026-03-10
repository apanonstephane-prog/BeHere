'use client';

import Link from 'next/link';
import { Artist } from '@/lib/artists-data';
import { useState } from 'react';

interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  external_urls: { spotify: string };
  album: { images: { url: string }[] };
  duration_ms: number;
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

export default function ArtistPageClient({
  artist,
  photoUrl,
  followers,
  monthlyListeners,
  topTracks,
}: Props) {
  const [activeTab, setActiveTab] = useState<'music' | 'videos' | 'about'>('music');
  const [activeRelease, setActiveRelease] = useState(0);

  const initials = artist.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const socialLinks = [
    artist.instagram && {
      label: 'Instagram',
      url: `https://instagram.com/${artist.instagram}`,
      icon: '📸',
    },
    artist.facebook && {
      label: 'Facebook',
      url: `https://facebook.com/${artist.facebook}`,
      icon: '👥',
    },
    artist.youtube_channel && {
      label: 'YouTube',
      url: `https://youtube.com/${artist.youtube_channel}`,
      icon: '▶️',
    },
    artist.youtube_channel2 && {
      label: 'YouTube 2',
      url: `https://youtube.com/${artist.youtube_channel2}`,
      icon: '▶️',
    },
  ].filter(Boolean);

  const streamingLinks = [
    artist.spotify_id && {
      label: 'Spotify',
      url: `https://open.spotify.com/artist/${artist.spotify_id}`,
      color: 'bg-green-500',
    },
  ].filter(Boolean);

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
              {photoUrl ? (
                <img src={photoUrl} alt={artist.name} className="w-full h-full object-cover" />
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

              {/* Streaming */}
              <div className="flex gap-3 flex-wrap">
                {artist.spotify_id && (
                  <a
                    href={`https://open.spotify.com/artist/${artist.spotify_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-black text-sm font-bold rounded-full hover:bg-green-400 transition-colors flex items-center gap-2"
                  >
                    <span>♫</span> Spotify
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
          {(['music', 'videos', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 text-sm font-medium transition-colors capitalize border-b-2 ${
                activeTab === tab
                  ? 'text-amber-400 border-amber-400'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              {tab === 'music' ? 'Musique' : tab === 'videos' ? 'Clips' : 'À propos'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* MUSIC */}
        {activeTab === 'music' && (
          <div className="space-y-12">
            {/* Releases */}
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
                        {release.type === 'single' ? '🎵' : release.type === 'mixtape' ? '📼' : '💿'}
                      </div>
                      <div className="p-3">
                        <p className="text-white text-xs font-bold truncate">{release.title}</p>
                        <p className="text-zinc-500 text-xs">{release.year} · {release.type}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Player */}
                {artist.releases[activeRelease] && (
                  <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
                    <h3 className="text-white font-bold mb-4">
                      {artist.releases[activeRelease].title}
                    </h3>
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
                          <p className="text-zinc-500 text-sm">
                            Rechercher sur{' '}
                            <a
                              href={`https://open.spotify.com/search/${encodeURIComponent(artist.releases[activeRelease].title + ' ' + artist.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300"
                            >
                              Spotify
                            </a>
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

            {/* Top Tracks from Spotify */}
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
                      <span className="text-zinc-600 text-sm w-4 text-right group-hover:text-amber-400">
                        {i + 1}
                      </span>
                      {track.album.images[0] && (
                        <img
                          src={track.album.images[0].url}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <span className="text-white text-sm flex-1 truncate group-hover:text-amber-400">
                        {track.name}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {msToMinSec(track.duration_ms)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
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
            {artist.youtube_ids && artist.youtube_ids.length > 0 ? (
              <>
                <h2 className="text-xl font-black text-white mb-6">
                  Clips ({artist.youtube_ids.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {artist.youtube_ids.map((id, i) => (
                    <div key={id} className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${id}`}
                          title={`Clip ${i + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-zinc-500 mb-4">Clips disponibles bientôt.</p>
                {(artist.youtube_channel || artist.youtube_channel2) && (
                  <div className="flex gap-4 justify-center">
                    {artist.youtube_channel && (
                      <a
                        href={`https://youtube.com/${artist.youtube_channel}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Voir sur YouTube →
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Bio */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-black text-white mb-4">Biographie</h2>
                <p className="text-zinc-400 leading-relaxed">{artist.bio}</p>
              </div>

              {/* Timeline */}
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Infos */}
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
                        <span key={g} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full">
                          {g}
                        </span>
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

              {/* Liens */}
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5">
                <h3 className="text-white font-bold text-sm mb-4">Liens</h3>
                <div className="space-y-2">
                  {artist.spotify_id && (
                    <a
                      href={`https://open.spotify.com/artist/${artist.spotify_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      <span className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-green-400 text-xs">♫</span>
                      Spotify
                    </a>
                  )}
                  {artist.instagram && (
                    <a
                      href={`https://instagram.com/${artist.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      <span className="w-6 h-6 rounded bg-pink-500/20 flex items-center justify-center text-pink-400 text-xs">📸</span>
                      @{artist.instagram}
                    </a>
                  )}
                  {artist.youtube_channel && (
                    <a
                      href={`https://youtube.com/${artist.youtube_channel}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      <span className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center text-red-400 text-xs">▶</span>
                      YouTube
                    </a>
                  )}
                  {artist.booking_email && (
                    <a
                      href={`mailto:${artist.booking_email}`}
                      className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      <span className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs">✉</span>
                      Booking
                    </a>
                  )}
                </div>
              </div>

              {/* Stats */}
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
