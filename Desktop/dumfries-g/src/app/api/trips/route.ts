import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tripId = searchParams.get('tripId');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    const supabase = createClient();
    let query = supabase.from('trips').select(`
      *,
      places (
        id,
        name,
        category,
        description,
        imageUrl,
        latitude,
        longitude,
        address
      )
    `);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (tripId) {
      query = query.eq('id', tripId).single();
    } else {
      query = query
        .order('created_at', { ascending: false })
        .limit(parseInt(limit))
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      trips: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, places, notes, userId } = body;

    if (!name || !places || !Array.isArray(places)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('trips')
      .insert([
        {
          name,
          places,
          notes,
          user_id: userId,
        },
      ])
      .select(`
        *,
        places (
          id,
          name,
          category,
          description,
          imageUrl,
          latitude,
          longitude,
          address
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing trip ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, places, notes } = body;

    if (!name || !places || !Array.isArray(places)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('trips')
      .update({
        name,
        places,
        notes,
      })
      .eq('id', id)
      .select(`
        *,
        places (
          id,
          name,
          category,
          description,
          imageUrl,
          latitude,
          longitude,
          address
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing trip ID' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 