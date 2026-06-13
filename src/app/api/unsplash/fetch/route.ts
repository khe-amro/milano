import { NextRequest, NextResponse } from 'next/server';
import { getFoodImage } from '@/lib/unsplash';
import { createClient } from '@/lib/supabase/server';

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

    const { dishName, categoryName } = await request.json();

    if (!dishName) {
      return NextResponse.json({ error: 'Dish name is required' }, { status: 400 });
    }

    const imageUrl = await getFoodImage(dishName, categoryName);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error in image fetch route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}