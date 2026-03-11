import { NextRequest, NextResponse } from 'next/server';
import { discoverArtists } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query trop courte.' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI non configurée.' },
        { status: 503 }
      );
    }

    const result = await discoverArtists(query.trim());
    return NextResponse.json(result);
  } catch (err) {
    console.error('[AI discover]', err);
    return NextResponse.json(
      { error: 'Erreur lors de la découverte IA.' },
      { status: 500 }
    );
  }
}
