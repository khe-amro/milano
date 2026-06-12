/**
 * Backfill script to auto-generate images for existing menu items
 * Run once with: npx ts-node scripts/backfill-images.ts
 * * This script:
 * 1. Fetches all menu items without images
 * 2. Auto-generates images from Pexels for each one
 * 3. Updates the database with the image URLs
 * 4. Respects Pexels rate limits with a controlled delay
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from '@supabase/supabase-js';

// 🔥 Import the updated image fetching helper function
// Change this path if your helper is located elsewhere (e.g., '../utils/pexels')
// Add the explicit file extension at the end of your local file path
import { getFoodImage } from "@/lib/unsplash";
// Initialize Supabase client with service role (for backend operations)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Main backfill function
 */
async function backfillImages() {
  console.log('🎨 Starting menu item image backfill via Pexels...\n');

  try {
    // Fetch all menu items without images
    const { data: itemsWithoutImages, error: fetchError } = await supabase
      .from('menu_items')
      .select('id, name_fr, category_id, categories(name_fr)')
      .is('image_url', null);

    if (fetchError) {
      console.error('❌ Error fetching items:', fetchError);
      process.exit(1);
    }

    if (!itemsWithoutImages || itemsWithoutImages.length === 0) {
      console.log('✅ No items without images. Backfill complete!');
      process.exit(0);
    }

    console.log(`Found ${itemsWithoutImages.length} items without images\n`);

    let successCount = 0;
    let skipCount = 0;

    // Process each item
    for (let i = 0; i < itemsWithoutImages.length; i++) {
      const item = itemsWithoutImages[i] as any;
      const progress = `[${i + 1}/${itemsWithoutImages.length}]`;
      
      // Safely grab the nested category name from the relational query selection
      const categoryName = item.categories?.name_fr || undefined;

      try {
        console.log(`${progress} Fetching image for: "${item.name_fr}" (${categoryName || 'No Category'})...`);

        // 🔥 Pass both the dish name and the category context into your new function
        const imageUrl = await getFoodImage(item.name_fr, categoryName);

        if (imageUrl) {
          // Update database
          const { error: updateError } = await supabase
            .from('menu_items')
            .update({ image_url: imageUrl })
            .eq('id', item.id);

          if (updateError) {
            console.error(`    ❌ Database update failed: ${updateError.message}`);
            skipCount++;
          } else {
            console.log(`    ✅ Image added: ${imageUrl.substring(0, 60)}...`);
            successCount++;
          }
        } else {
          console.log(`    ⏭️  No image found on Pexels`);
          skipCount++;
        }

        // Respect rate limits: 2-second delay between requests
        if (i < itemsWithoutImages.length - 1) {
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (error) {
        console.error(`    ❌ Error processing item "${item.name_fr}": ${error}`);
        skipCount++;
      }
    }

    console.log(`\n📊 Backfill Summary:`);
    console.log(`   ✅ Successfully added images: ${successCount}`);
    console.log(`   ⏭️  Skipped/Failed: ${skipCount}`);
    console.log(`\n🎉 Backfill complete!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run backfill
backfillImages();