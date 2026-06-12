import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFoodImage } from '@/lib/unsplash';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name_fr,
      name_ar,
      category_id,
      price,
      description,
      // restaurant_id,
      category_name,
    } = body;

    // Validate required fields
    if (!name_fr || !category_id || price === undefined ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse price to number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: 'Invalid price value' },
        { status: 400 }
      );
    }

    // Auto-fetch image from Unsplash
    const imageUrl = await getFoodImage(name_fr, category_name);

    // Create Supabase client
    const supabase = createClient();

    // Insert menu item into database
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        // restaurant_id,
        category_id,
        name_fr,
        name_ar,
        description: description || null,
        price: parsedPrice,
        image_url: imageUrl,
        is_available: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create menu item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
