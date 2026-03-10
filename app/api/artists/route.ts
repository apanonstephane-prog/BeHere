import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { ARTISTS } from '@/lib/artists-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const genre = searchParams.get('genre');
  const city = searchParams.get('city');
  const query = searchParams.get('q');

  try {
    const db = getServiceSupabase();
    let dbQuery = db.from('artists').select('*');

    if (slug) dbQuery = dbQuery.eq('slug', slug);
    if (genre) dbQuery = dbQuery.contains('genre', [genre]);
    if (city) dbQuery = dbQuery.ilike('city', `%${city}%`);
    if (query) dbQuery = dbQuery.or(`name.ilike.%${query}%,bio.ilike.%${query}%`);

    const { data, error } = await dbQuery.order('name');

    if (error) throw error;

    // Fallback to static data if DB is empty
    if (!data || data.length === 0) {
      let artists = ARTISTS;
      if (slug) artists = artists.filter((a) => a.slug === slug);
      if (genre) artists = artists.filter((a) => a.genre.some((g) => g.toLowerCase().includes(genre.toLowerCase())));
      if (city) artists = artists.filter((a) => a.city.toLowerCase().includes(city.toLowerCase()));
      if (query) artists = artists.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.bio.toLowerCase().includes(query.toLowerCase()));
      return NextResponse.json(artists);
    }

    return NextResponse.json(data);
  } catch {
    // Return static data on DB error
    let artists = ARTISTS;
    if (slug) artists = artists.filter((a) => a.slug === slug);
    return NextResponse.json(artists);
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getServiceSupabase();
    const { error } = await db.from('artists').upsert(
      ARTISTS.map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        origin: a.origin,
        city: a.city,
        country: a.country,
        genre: a.genre,
        category: a.category,
        bio: a.bio,
        spotify_id: a.spotify_id ?? null,
        instagram: a.instagram ?? null,
        facebook: a.facebook ?? null,
        youtube_channel: a.youtube_channel ?? null,
        booking_email: a.booking_email ?? null,
        label: a.label ?? null,
        timeline: a.timeline ?? [],
        releases: a.releases ?? [],
        stats: a.stats ?? {},
      })),
      { onConflict: 'id' }
    );

    if (error) throw error;
    return NextResponse.json({ success: true, count: ARTISTS.length });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
