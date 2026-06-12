-- Supabase Database Schema for Milano Bellaka Digital Menu

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Create Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Restaurants
CREATE POLICY "Allow public read of restaurants"
  ON restaurants FOR SELECT
  USING (true);

CREATE POLICY "Allow linking owner to restaurant"
  ON restaurants FOR UPDATE
  USING (owner_id IS NULL OR owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Allow owner manage restaurant"
  ON restaurants FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- 7. RLS Policies for Categories
CREATE POLICY "Allow public read of categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow owner manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = categories.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = categories.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- 8. RLS Policies for Menu Items
CREATE POLICY "Allow public read of menu_items"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Allow owner manage menu_items"
  ON menu_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM categories
      JOIN restaurants ON restaurants.id = categories.restaurant_id
      WHERE categories.id = menu_items.category_id
      AND restaurants.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM categories
      JOIN restaurants ON restaurants.id = categories.restaurant_id
      WHERE categories.id = menu_items.category_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- 9. Setup Storage Bucket for food photos
-- Note: Run this bucket insert in Supabase to initialize the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('food-photos', 'food-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage.Objects
CREATE POLICY "Allow public read of food-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'food-photos');

CREATE POLICY "Allow authenticated upload of food-photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'food-photos');

CREATE POLICY "Allow owner manage food-photos"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'food-photos')
  WITH CHECK (bucket_id = 'food-photos');
