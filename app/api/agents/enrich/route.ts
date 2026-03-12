import { NextRequest, NextResponse } from 'next/server';
import { ARTISTS } from '@/lib/artists-data';
import { enrichArtistProfile } from '@/lib/enrichment';
import { createClient } from '@supabase/supabase-js';

// Supabase service client (only if configured)
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { slug?: string };
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const artist = ARTISTS.find((a) => a.slug === slug);
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Check Supabase cache (max 24h)
    const supabase = getSupabase();
    if (supabase) {
      const { data: cached } = await supabase
        .from('artist_enrichments')
        .select('*')
        .eq('artist_slug', slug)
        .single();

      if (cached) {
        const age = Date.now() - new Date(cached.updated_at).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24h
        if (age < maxAge) {
          return NextResponse.json({ ...cached, from_cache: true });
        }
      }
    }

    // Run the enrichment agent
    const result = await enrichArtistProfile(artist);

    // Save to Supabase if configured
    if (supabase) {
      await supabase.from('artist_enrichments').upsert({
        artist_slug: slug,
        photo_url: result.photo_url,
        bio_enriched: result.bio_enriched,
        sources: result.sources,
        confidence: result.confidence,
        raw_data: result.raw,
        updated_at: result.updated_at,
      }, { onConflict: 'artist_slug' });
    }

    return NextResponse.json({ ...result, from_cache: false });
  } catch (err) {
    console.error('[enrich agent]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Enrichment failed' },
      { status: 500 }
    );
  }
}

// GET: check if cached enrichment exists
export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ cached: false });

  const { data } = await supabase
    .from('artist_enrichments')
    .select('photo_url, bio_enriched, sources, confidence, updated_at')
    .eq('artist_slug', slug)
    .single();

  return NextResponse.json(data ? { cached: true, ...data } : { cached: false });
}
