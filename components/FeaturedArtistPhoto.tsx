'use client';

import { useEffect, useState } from 'react';
import { Artist } from '@/lib/artists-data';

interface Props {
  artist: Artist;
  className?: string;
}

export default function FeaturedArtistPhoto({ artist, className = '' }: Props) {
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

  const initials = artist.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (!photo) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-zinc-800 border border-amber-500/20 ${className}`}>
        <span className="text-4xl md:text-5xl font-black text-amber-400">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={photo}
      alt={artist.name}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
