import { NextRequest, NextResponse } from 'next/server';
// 1. Change getUnsplashFoodImage to getFoodImage
import { getFoodImage } from '@/lib/unsplash';

export async function POST(request: NextRequest) {
  try {
    const { dishName, categoryName } = await request.json();

    if (!dishName) {
      return NextResponse.json({ error: 'Dish name is required' }, { status: 400 });
    }

    // 2. Update the function call here
    const imageUrl = await getFoodImage(dishName, categoryName);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error in image fetch route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}