const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;
const BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

export interface YouTubeChannelInfo {
  photoUrl: string | null;
  title: string | null;
  uploadsPlaylistId: string | null;
}

/** Resolve channel handle (@xxx or UCxxx) → channel info */
export async function getYouTubeChannelInfo(handle: string): Promise<YouTubeChannelInfo> {
  try {
    // Strip leading @
    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;

    // Try by handle first (new API)
    let url = `${BASE}/channels?part=snippet,contentDetails&forHandle=${encodeURIComponent(cleanHandle)}&key=${YOUTUBE_API_KEY}`;
    let res = await fetch(url, { next: { revalidate: 3600 } });
    let data = await res.json();

    // Fallback: try by channel ID if it starts with UC
    if ((!data.items || data.items.length === 0) && cleanHandle.startsWith('UC')) {
      url = `${BASE}/channels?part=snippet,contentDetails&id=${cleanHandle}&key=${YOUTUBE_API_KEY}`;
      res = await fetch(url, { next: { revalidate: 3600 } });
      data = await res.json();
    }

    if (!data.items || data.items.length === 0) {
      return { photoUrl: null, title: null, uploadsPlaylistId: null };
    }

    const channel = data.items[0];
    return {
      photoUrl: channel.snippet?.thumbnails?.high?.url ?? channel.snippet?.thumbnails?.default?.url ?? null,
      title: channel.snippet?.title ?? null,
      uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads ?? null,
    };
  } catch {
    return { photoUrl: null, title: null, uploadsPlaylistId: null };
  }
}

/** Fetch latest videos from a channel uploads playlist */
export async function getYouTubeChannelVideos(
  uploadsPlaylistId: string,
  maxResults = 50
): Promise<YouTubeVideo[]> {
  try {
    const url = `${BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!data.items) return [];

    return data.items
      .filter((item: any) => item.snippet?.resourceId?.videoId)
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? '',
        publishedAt: item.snippet.publishedAt,
      }));
  } catch {
    return [];
  }
}

/** Full pipeline: handle → channel info + videos */
export async function getYouTubeArtistData(handle: string): Promise<{
  channelPhotoUrl: string | null;
  videos: YouTubeVideo[];
}> {
  const channelInfo = await getYouTubeChannelInfo(handle);
  if (!channelInfo.uploadsPlaylistId) {
    return { channelPhotoUrl: channelInfo.photoUrl, videos: [] };
  }
  const videos = await getYouTubeChannelVideos(channelInfo.uploadsPlaylistId);
  return { channelPhotoUrl: channelInfo.photoUrl, videos };
}
