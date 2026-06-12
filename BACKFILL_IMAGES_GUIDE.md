# How to Fill Images for Existing Menu Items

## Current Situation

- You have 74 existing menu items **without images**
- New items will get auto-images from Unsplash when added
- You need to populate images for the existing items **one time**

## Step 1: Get Unsplash API Key (If You Haven't)

Go to: https://unsplash.com/oauth/applications
- Create app
- Copy your **Access Key**

## Step 2: Add to .env.local

```env
UNSPLASH_ACCESS_KEY=your_api_key_here
```

## Step 3: Run the Backfill Script

```bash
npx ts-node scripts/backfill-images.ts
```

**What happens:**
- Script finds all items without images (your 74 items)
- Fetches image from Unsplash for each one
- Stores URL in database
- Shows progress in terminal
- Takes ~2 minutes total

**Example output:**
```
🎨 Starting menu item image backfill...

Found 74 items without images

[1/74] Fetching image for: "Pizza Margherita"...
    ✅ Image added: https://images.unsplash.com/...
    
[2/74] Fetching image for: "Burger Deluxe"...
    ✅ Image added: https://images.unsplash.com/...

... (continues for all 74 items)

📊 Backfill Summary:
   ✅ Successfully added images: 74
   ⏭️  Skipped/Failed: 0

🎉 Backfill complete!
```

## After Backfill

✅ All existing items have images in database  
✅ Images load from database (super fast)  
✅ New items auto-fetch image on add  
✅ Owner can refresh image anytime

## If Something Goes Wrong

**Error: "npx ts-node not found"**
```bash
npm install -D ts-node @types/node
npx ts-node scripts/backfill-images.ts
```

**Error: "UNSPLASH_ACCESS_KEY not set"**
- Make sure `.env.local` has the key
- Restart the script

**Some images failed?**
- Just run the script again
- It will skip items that already have images
- Only process items still missing images

## That's It!

Once the backfill completes, your menu will have beautiful images! 🎉
