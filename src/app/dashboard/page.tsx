import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export const revalidate = 0; // Disable server cache for real-time CRUD dashboard data

export default async function DashboardPage() {
  const supabase = createClient();

  // 1. Fetch authenticated user details
  const { data: { user }, error: uError } = await supabase.auth.getUser();

  if (uError || !user) {
    redirect('/dashboard/login');
  }

  // 2. Fetch the restaurant owned by this user
  let { data: restaurant, error: rError } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  // Fallback: If this logged-in user doesn't own a restaurant, check if 'milano-bellaka' is unowned
  if (!restaurant) {
    const { data: unownedRestaurant } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', 'milano-bellaka')
      .single();

    if (unownedRestaurant && !unownedRestaurant.owner_id) {
      // Auto-claim ownership
      const { data: claimed } = await supabase
        .from('restaurants')
        .update({ owner_id: user.id })
        .eq('id', unownedRestaurant.id)
        .select()
        .single();
      
      restaurant = claimed;
    }
  }

  // If still no restaurant, show error screen
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold text-[#C0392B] mb-2">Aucun restaurant trouvé</h1>
        <p className="text-gray-400 text-sm max-w-md">
          Aucun menu de restaurant n&apos;est associé à votre compte. Assurez-vous d&apos;avoir exécuté le script SQL de base de données.
        </p>
      </div>
    );
  }

  // 3. Fetch all categories
  const { data: categories, error: cError } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('order_index', { ascending: true });

  if (cError || !categories) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
        <p>Erreur lors du chargement des catégories.</p>
      </div>
    );
  }

  // 4. Fetch all menu items (including available = false) ordered by creation date
  const { data: menuItems, error: mError } = await supabase
    .from('menu_items')
    .select('*')
    .in('category_id', categories.map((c) => c.id))
    .order('created_at', { ascending: false });

  if (mError || !menuItems) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
        <p>Erreur lors du chargement des articles de menu.</p>
      </div>
    );
  }

  return (
    <DashboardClient
      restaurant={restaurant}
      categories={categories}
      initialMenuItems={menuItems}
    />
  );
}
