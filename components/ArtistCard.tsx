'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Artist } from '@/lib/artists-data';

interface Props {
  artist: Artist;
}

export default function ArtistCard({ artist }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!artist.spotify_id) return;
    fetch(`/api/spotify?artistId=${artist.spotify_id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.images?.[0]?.url) setPhoto(data.images[0].url);
      })
      .catch(() => {});
  }, [artist.spotify_id]);

  const initials = artist.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10">
        {/* Photo */}
        <div className="aspect-square overflow-hidden bg-zinc-800">
          {photo ? (
            <img
              src={photo}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <span className="text-3xl font-bold text-amber-500/60 font-mono">{initials}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
            {artist.name}
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5 truncate">{artist.origin}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {artist.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                {g}
              </span>
            ))}
          </div>
          {artist.stats?.spotify && (
            <p className="text-zinc-600 text-xs mt-2 flex items-center gap-1">
              <span className="text-green-500">●</span> {artist.stats.spotify}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
