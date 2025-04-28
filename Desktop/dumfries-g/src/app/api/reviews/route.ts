import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    if (!placeId) {
      return NextResponse.json(
        { error: 'Missing place ID' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('place_id', placeId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      reviews: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { placeId, rating, comment, authorName } = body;

    // Validate required fields
    if (!placeId || !rating || !comment || !authorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          place_id: placeId,
          rating,
          comment,
          author_name: authorName,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update place average rating
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('place_id', placeId);

    if (!reviewsError && reviews) {
      const avgRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

      await supabase
        .from('places')
        .update({ average_rating: avgRating })
        .eq('id', placeId);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating review:', error);
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
    const placeId = searchParams.get('placeId');

    if (!id || !placeId) {
      return NextResponse.json(
        { error: 'Missing review ID or place ID' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Update place average rating
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('place_id', placeId);

    if (!reviewsError && reviews && reviews.length > 0) {
      const avgRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

      await supabase
        .from('places')
        .update({ average_rating: avgRating })
        .eq('id', placeId);
    } else if (!reviewsError && reviews && reviews.length === 0) {
      // If no reviews left, reset average rating
      await supabase
        .from('places')
        .update({ average_rating: null })
        .eq('id', placeId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 