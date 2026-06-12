import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import QrClient from './QrClient';

export const revalidate = 0; // Ensure QR page updates are always fresh

export default async function QrCodePage() {
  const supabase = createClient();

  // 1. Fetch user auth session
  const { data: { user }, error: uError } = await supabase.auth.getUser();
  if (uError || !user) {
    redirect('/dashboard/login');
  }

  // 2. Fetch the owned restaurant
  const { data: restaurant, error: rError } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  if (rError || !restaurant) {
    redirect('/dashboard');
  }

  return <QrClient restaurant={restaurant} />;
}
