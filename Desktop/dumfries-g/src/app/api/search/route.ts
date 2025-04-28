import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    if (!query) {
      return NextResponse.json(
        { error: 'Missing search query' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    let dbQuery = supabase
      .from('places')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    const { data: places, error: placesError } = await dbQuery
      .limit(parseInt(limit))
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
      .order('name');

    if (placesError) {
      throw placesError;
    }

    // Also search in trips if they contain places matching the query
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select(`
        id,
        name,
        places (
          id,
          name,
          category
        )
      `)
      .limit(5);

    if (tripsError) {
      throw tripsError;
    }

    // Filter trips that contain places matching the query
    const matchingTrips = trips?.filter((trip) =>
      trip.places?.some((place: any) =>
        place.name.toLowerCase().includes(query.toLowerCase())
      )
    );

    return NextResponse.json({
      places,
      trips: matchingTrips,
      query,
      category,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 