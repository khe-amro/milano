import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFoodImage } from '@/lib/unsplash';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createClient();

    // Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name_fr,
      name_ar,
      category_id,
      price,
      description,
      // restaurant_id,
      category_name,
      image_url,
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

    // Only auto-fetch from Pexels if the client did NOT send an image_url at all (undefined).
    // If the client explicitly sent null, the owner chose no image → respect that choice.
    const imageUrl = image_url !== undefined ? image_url : await getFoodImage(name_fr, category_name);

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
