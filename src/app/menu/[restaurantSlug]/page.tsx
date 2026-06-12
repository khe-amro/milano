import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MenuClient from './MenuClient';

export const revalidate = 0; // Disable server cache for real-time menu updates (e.g. availability toggle)

// Explicitly define parameters interface to handle Next.js routing requirements
interface PageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

export default async function MenuPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { restaurantSlug } = resolvedParams;
  const supabase = createClient();

  // 1. Fetch the restaurant by slug
  const { data: restaurant, error: rError } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', restaurantSlug)
    .single();

  if (rError || !restaurant) {
    notFound();
  }

  // 2. Fetch categories belonging to this restaurant ordered by order_index
  const { data: categories, error: cError } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('order_index', { ascending: true });

  if (cError || !categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
        <p>Erreur lors du chargement des catégories ou aucune catégorie trouvée.</p>
      </div>
    );
  }

  // 3. Fetch all active/available menu items for these categories
  const { data: menuItems, error: mError } = await supabase
    .from('menu_items')
    .select('*')
    .in('category_id', categories.map((c) => c.id))
    .eq('is_available', true)
    .order('name_fr', { ascending: true });

  if (mError || !menuItems) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
        <p>Erreur lors du chargement des articles de menu.</p>
      </div>
    );
  }

  return (
    <MenuClient
      restaurant={restaurant}
      categories={categories}
      menuItems={menuItems}
    />
  );
}
