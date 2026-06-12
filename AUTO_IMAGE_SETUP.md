# Auto-Image Fetching Feature - Setup Guide

## Overview

This feature automatically fetches food images from Unsplash when restaurant owners add menu items in the dashboard. No manual image uploads needed!

### How It Works

1. **Owner adds item** → Enters name, category, price, description (no image upload)
2. **System fetches image** → API calls Unsplash with optimized search terms
3. **Preview shown** → Owner can see the auto-generated image before saving
4. **Image saved** → URL stored in database alongside the menu item
5. **Published** → Image shows on public menu page

---

## Setup Steps

### 1. Get Unsplash API Key (Free)

1. Go to: https://unsplash.com/oauth/applications
2. Sign up / Log in to Unsplash
3. Create a new Application
4. Copy your **Access Key** (not Secret)
5. Add to `.env.local`:
   ```
   UNSPLASH_ACCESS_KEY=your_key_here
   ```

### 2. Update Environment File

Your `.env.local` should now have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
UNSPLASH_ACCESS_KEY=YOUR_API_KEY_HERE
```

### 3. Restart Dev Server

```bash
npm run dev
```

---

## Using the Feature

### For New Menu Items

1. Click **"Ajouter un plat"** in the dashboard
2. Fill in:
   - **Nom (French)** - dish name (required)
   - **Nom (Arabic)**
   - **Catégorie** - pick a category
   - **Prix** - price in DZD
   - **Description** - optional
3. Click **"Générer une image"** button
   - System fetches image from Unsplash
   - Preview shows in the box
4. If you like it → Click **"Ajouter"** to save
5. If you want a different image → Click **"Générer une image"** again
6. Submit the form → Image is saved automatically!

### For Existing Menu Items (No Images)

Use the backfill script to auto-generate images for your 74 existing items:

```bash
npx ts-node scripts/backfill-images.ts
```

This will:
- Find all items without images
- Fetch images from Unsplash for each one
- Update the database
- Respect Unsplash rate limits (1.2s delay between requests)
- Show progress in terminal

**Estimated time:** ~2 minutes for 74 items

---

## Files Created/Updated

### New Files
```
src/lib/unsplash.ts                    # Server-side Unsplash fetcher
src/app/api/menu-items/route.ts        # API to create items with auto images
src/app/api/unsplash/fetch/route.ts    # API to preview images
scripts/backfill-images.ts             # Backfill script for existing items
```

### Updated Files
```
src/app/dashboard/DashboardClient.tsx   # Added image preview + refresh button
.env.local                              # Added UNSPLASH_ACCESS_KEY
```

---

## How Image Selection Works

The system maps categories to better Unsplash search terms:

```
Pizza → "{name} italian pizza"
Sandwich → "{name} sandwich food"
Tacos → "{name} tacos food"
Plats → "{name} plate dish food"
Boissons → "{name} drink beverage"
Burger → "{name} burger food"
Salad → "{name} salad food"
Dessert → "{name} dessert food"
Pasta → "{name} pasta food"
```

**Example:**
- User enters: "Margherita"
- Category: "Pizza"
- Search query: "Margherita italian pizza"
- Result: Beautiful pizza image from Unsplash ✨

---

## API Endpoints

### POST `/api/menu-items`

Creates a new menu item with auto-fetched image.

**Request:**
```json
{
  "name_fr": "Pizza Calzone",
  "name_ar": "بيتزا كالزون",
  "category_id": "uuid",
  "price": 550,
  "description": "Sauce tomate, fromage mozzarella...",
  "restaurant_id": "uuid",
  "category_name": "Pizza"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name_fr": "Pizza Calzone",
  "image_url": "https://images.unsplash.com/...",
  "price": 550,
  ...
}
```

### POST `/api/unsplash/fetch`

Previews an image without creating an item (for the dashboard form).

**Request:**
```json
{
  "dishName": "Pizza Calzone",
  "categoryId": "uuid"
}
```

**Response:**
```json
{
  "imageUrl": "https://images.unsplash.com/..." or null
}
```

---

## Error Handling

### If Unsplash API key is missing:
- Feature still works, but images won't be fetched
- Items created with `image_url: null`
- Placeholder shows on public menu

### If Unsplash has no matching image:
- Image field stays empty
- Owner can still save the item
- Can be added manually later in edit mode

### If API rate limit is hit:
- Use the "refresh image" button to try again
- Free tier: 50 requests/hour (plenty for small restaurants)
- Premium: 5,000 requests/hour

---

## Public Menu Display

The public menu page (`/menu/[slug]`) handles missing images gracefully:

```tsx
if (image_url) {
  // Show image
} else {
  // Show category icon placeholder (pizza slice, burger, etc.)
}
```

No broken images!

---

## Performance Notes

- **Image fetching:** ~500ms per request (shown with loading spinner)
- **Database:** Indexed `image_url` field for fast queries
- **Caching:** Unsplash responses cached for 1 hour server-side
- **Rate limits:** Backfill script respects Unsplash limits automatically

---

## Troubleshooting

### "Image generation not working"

1. Check `.env.local` has `UNSPLASH_ACCESS_KEY` set correctly
2. Make sure dev server was restarted after adding the key
3. Check browser console for errors
4. Verify Unsplash API key is valid (try creating a test app)

### "No images found for my item"

The search term might be too specific. Try:
- Different dish name
- Refreshing multiple times (different results)
- Manually adding image in edit mode

### Backfill script errors

```bash
# Make sure dependencies are installed
npm install ts-node @types/node --save-dev

# Run with proper Node setup
npx ts-node scripts/backfill-images.ts
```

---

## Next Steps

1. ✅ Get Unsplash API key
2. ✅ Add to `.env.local`
3. ✅ Restart dev server
4. ✅ Test by adding a new menu item
5. ✅ Run backfill script for existing items
6. 🚀 Deploy to Vercel!

---

## Support

For issues with Unsplash integration:
- https://unsplash.com/developers
- Contact support@unsplash.com

For this implementation:
- Check `/src/lib/unsplash.ts` for the core logic
- Check `/src/app/api/` for API endpoints
