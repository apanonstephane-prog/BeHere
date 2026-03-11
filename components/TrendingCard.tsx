'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Artist } from '@/lib/artists-data';

interface Props {
  artist: Artist;
  rank: number;
}

export default function TrendingCard({ artist, rank }: Props) {
  const [photo, setPhoto] = useState<string | null>(artist.photo_url ?? null);

  useEffect(() => {
    if (photo || !artist.spotify_id) return;
    fetch(`/api/spotify?artistId=${artist.spotify_id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.images?.[0]?.url) setPhoto(data.images[0].url);
      })
      .catch(() => {});
  }, [artist.spotify_id, photo]);

  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition-all duration-200 hover:-translate-y-0.5">
        {/* Photo or initials */}
        <div className="aspect-square overflow-hidden">
          {photo ? (
            <img
              src={photo}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <span className="text-3xl font-black text-amber-500/50 font-mono">
                {artist.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        {/* Rank badge */}
        <span className="absolute top-2 right-2 text-zinc-300 text-xs font-black bg-black/60 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center border border-zinc-700/50">
          #{rank}
        </span>
        {/* Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-8">
          <h4 className="text-white text-sm font-bold truncate group-hover:text-amber-400 transition-colors">
            {artist.name}
          </h4>
          <p className="text-zinc-400 text-xs truncate">{artist.genre.slice(0, 2).join(' · ')}</p>
          {artist.stats?.spotify && (
            <p className="text-green-400/70 text-xs mt-1">
              {artist.stats.spotify}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
