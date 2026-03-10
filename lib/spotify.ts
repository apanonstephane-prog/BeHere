let _token: string | null = null;
let _tokenExpiry = 0;

export async function getSpotifyToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error('Failed to get Spotify token');
  const data = await res.json();
  _token = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return _token!;
}

export async function getSpotifyArtist(spotifyId: string) {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/artists/${spotifyId}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getSpotifyArtistTopTracks(spotifyId: string) {
  const token = await getSpotifyToken();
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?market=FR`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return null;
  return res.json();
}

export async function getSpotifyAlbum(albumId: string) {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}
