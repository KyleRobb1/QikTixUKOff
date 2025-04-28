import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    const supabase = createClient();
    let query = supabase.from('places').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query
      .limit(parseInt(limit))
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
      .order('name');

    if (error) {
      throw error;
    }

    return NextResponse.json({
      places: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, location, imageUrl, latitude, longitude, address } = body;

    // Validate required fields
    if (!name || !description || !category || !latitude || !longitude || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('places')
      .insert([
        {
          name,
          description,
          category,
          location,
          imageUrl,
          latitude,
          longitude,
          address,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating place:', error);
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
        { error: 'Missing place ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, category, location, imageUrl, latitude, longitude, address } = body;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('places')
      .update({
        name,
        description,
        category,
        location,
        imageUrl,
        latitude,
        longitude,
        address,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating place:', error);
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
        { error: 'Missing place ID' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting place:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 