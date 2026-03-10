import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { artist_name, email, genre, spotify_url } = await req.json();

    if (!email || !artist_name) {
      return NextResponse.json(
        { error: 'Nom d\'artiste et email sont obligatoires.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase.from('waitlist').insert([
      {
        email: email.toLowerCase().trim(),
        artist_name: artist_name.trim(),
        genre: genre || null,
        spotify_url: spotify_url || null,
      },
    ]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Cet email est déjà inscrit.' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Waitlist error:', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
