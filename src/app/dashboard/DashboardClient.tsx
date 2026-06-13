'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Edit2, Trash2, Globe, QrCode, LogOut, 
  Search, Filter, Upload, X, AlertTriangle, Eye, EyeOff 
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  order_index: number;
}

interface MenuItem {
  id: string;
  category_id: string;
  name_fr: string;
  name_ar: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

interface DashboardClientProps {
  restaurant: Restaurant;
  categories: Category[];
  initialMenuItems: MenuItem[];
}

export default function DashboardClient({ restaurant, categories, initialMenuItems }: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [, startTransition] = useTransition();

  // Menu items list state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Modals visibility state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states (shared for add/edit)
  const [formNameFr, setFormNameFr] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || '');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [formFetchingImage, setFormFetchingImage] = useState(false);
  const [formImageFile, setFormImageFile] = useState<File | null>(null);

  // Focus states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Stats calculation
  const totalItemsCount = menuItems.length;
  const availableItemsCount = menuItems.filter((i) => i.is_available).length;
  const unavailableItemsCount = totalItemsCount - availableItemsCount;

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    startTransition(() => {
      router.push('/dashboard/login');
      router.refresh();
    });
  };

  // Handle Real-time Quick Toggle for Item Availability
  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, is_available: newStatus } : item))
    );

    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: newStatus })
        .eq('id', itemId);

      if (error) throw error;
    } catch {
      // Revert optimistic update on failure
      setMenuItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, is_available: currentStatus } : item))
      );
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  // Fetch image from Unsplash API
  const fetchImageFromUnsplash = async () => {
    if (!formNameFr.trim()) {
      setFormError('Veuillez d\'abord entrer le nom du plat');
      return;
    }
    
    setFormFetchingImage(true);
    setFormError(null);
    
    try {
      const response = await fetch('/api/unsplash/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: formNameFr,
          categoryId: formCategoryId,
        }),
      });
      
      if (!response.ok) throw new Error('Impossible de récupérer l\'image');
      
      const data = await response.json();
      setFormImagePreview(data.imageUrl);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur lors de la récupération de l\'image');
    } finally {
      setFormFetchingImage(false);
    }
  };

  // Handle file select & preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormImageFile(file); // ← store the file
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

  // Upload image to Supabase Storage bucket and get the public URL
const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const randomId = crypto.randomUUID(); // Use UUID for uniqueness
  const fileName = `${randomId}.${fileExt}`;
  const filePath = `${restaurant.id}/${fileName}`; // Ensure restaurant ID is correct

  const { error: uploadError } = await supabase.storage
    .from('food-photos')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('food-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

  // Clear Form State
 const clearForm = () => {
  setFormNameFr('');
  setFormNameAr('');
  setFormCategoryId(categories[0]?.id || '');
  setFormPrice('');
  setFormDescription('');
  setFormIsAvailable(true);
  setFormImagePreview(null);
  setFormImageFile(null); // ← ADD THIS
  setFormError(null);
};

  // Open Edit Modal & Populate Form
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormNameFr(item.name_fr);
    setFormNameAr(item.name_ar);
    setFormCategoryId(item.category_id);
    setFormPrice(item.price.toString());
    setFormDescription(item.description || '');
    setFormIsAvailable(item.is_available);
    setFormImagePreview(item.image_url);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Add Item Action (uses API with auto-fetched image)
  const handleAddItem = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormLoading(true);
  setFormError(null);

  try {
    // ── Resolve final image URL ──────────────────────────────
    // null = no image → the menu card will show the category icon placeholder
    let finalImageUrl: string | null = null;

    if (formImageFile) {
      finalImageUrl = await uploadImage(formImageFile);
    } else if (formImagePreview && !formImageFile) {
      // If image was generated via Pexels, use it
      finalImageUrl = formImagePreview;
    }

   const response = await fetch('/api/menu-items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name_fr: formNameFr,
    name_ar: formNameAr,
    category_id: formCategoryId,
    price: parseFloat(formPrice),
    description: formDescription || null,
    restaurant_id: restaurant.id,
    category_name: categories.find(c => c.id === formCategoryId)?.name_fr,
    image_url: finalImageUrl, // ✅ Explicitly set the image URL
  }),
});

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Impossible de créer le plat');
    }

    const data = await response.json();
    setMenuItems((prev) => [data, ...prev]);
    setIsAddModalOpen(false);
    clearForm();
  } catch (err: unknown) {
    setFormError(err instanceof Error ? err.message : 'Une erreur est survenue.');
  } finally {
    setFormLoading(false);
  }
};

  // Edit Item Action
const handleEditItem = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingItem) return;
  setFormLoading(true);
  setFormError(null);

  try {
    // ── Resolve final image URL ──────────────────────────────
    let finalImageUrl = formImagePreview; // default: keep existing URL

    if (formImageFile) {
      // New local file selected → upload it
      finalImageUrl = await uploadImage(formImageFile);
    }

    const { data, error } = await supabase
      .from('menu_items')
      .update({
        category_id: formCategoryId,
        name_fr: formNameFr,
        name_ar: formNameAr,
        description: formDescription || null,
        price: parseFloat(formPrice),
        image_url: finalImageUrl,
        is_available: formIsAvailable,
      })
      .eq('id', editingItem.id)
      .select()
      .single();

    if (error) throw error;

    setMenuItems((prev) => prev.map((item) => (item.id === editingItem.id ? data : item)));
    setIsEditModalOpen(false);
    clearForm();
    setEditingItem(null);
  } catch (err: unknown) {
    setFormError(err instanceof Error ? err.message : 'Une erreur est survenue.');
  } finally {
    setFormLoading(false);
  }
};

  // Delete Item Action
  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setFormLoading(true);

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', deletingItem.id);

      if (error) throw error;

      setMenuItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression.';
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Search/Filter matching items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name_ar.includes(searchQuery) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategoryFilter ? item.category_id === selectedCategoryFilter : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#111111] text-[#E8E8E8] flex flex-col font-sans">
      {/* 1. Header Bar */}
      <header className="bg-[#1A1A1A] border-b border-[#2d2d2d] py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Restaurant Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-full border border-[#C0392B] bg-[#111111] overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-md font-extrabold text-white leading-tight">Milano Bellaka</h1>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase">Tableau de bord</p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <a
              href={`/menu/${restaurant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#202020] border border-[#2d2d2d] text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#C0392B]" />
              Voir la carte
            </a>
            <a
              href="/dashboard/qr"
              className="px-3.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#202020] border border-[#2d2d2d] text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#C0392B]" />
              QR Code
            </a>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-[#C0392B]/10 hover:bg-[#C0392B]/20 text-[#C0392B] text-xs font-bold flex items-center gap-1.5 border border-[#C0392B]/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Panel */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-8 space-y-6">
        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1A1A1A] border border-[#2d2d2d] rounded-xl p-4 shadow-sm text-center">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Plats Totaux</p>
            <p className="text-xl md:text-3xl font-black text-white mt-1">{totalItemsCount}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2d2d2d] rounded-xl p-4 shadow-sm text-center">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Actifs</p>
            <p className="text-xl md:text-3xl font-black text-emerald-400 mt-1">{availableItemsCount}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2d2d2d] rounded-xl p-4 shadow-sm text-center">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Masqués</p>
            <p className="text-xl md:text-3xl font-black text-amber-500 mt-1">{unavailableItemsCount}</p>
          </div>
        </div>

        {/* Action and Filtering Row */}
        <div className="bg-[#1A1A1A] border border-[#2d2d2d] rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full sm:w-64 py-2 pl-9 pr-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B]"
              />
            </div>

            {/* Category Filter */}
            <div className="relative flex items-center">
              <Filter className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full sm:w-48 py-2 pl-9 pr-8 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B] appearance-none"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_fr} ({cat.name_ar})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add New Button */}
          <button
            onClick={() => {
              clearForm();
              setIsAddModalOpen(true);
            }}
            className="w-full md:w-auto px-5 py-2.5 bg-[#C0392B] hover:bg-[#a3281a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 active:scale-98 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Ajouter un plat
          </button>
        </div>

        {/* 3. Items Management Table */}
        <div className="bg-[#1A1A1A] border border-[#2d2d2d] rounded-xl shadow-sm overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Aucun plat ne correspond à vos critères de recherche.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#111111] border-b border-[#2d2d2d] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-16 text-center">Image</th>
                    <th className="py-3 px-4">Nom (FR / AR)</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4 text-right">Prix</th>
                    <th className="py-3 px-4 text-center w-28">Dispo</th>
                    <th className="py-3 px-4 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2d2d]">
                  {filteredItems.map((item) => {
                    const cat = categories.find((c) => c.id === item.category_id);
                    return (
                      <tr key={item.id} className="hover:bg-[#202020]/40 transition-colors">
                        {/* Image column */}
                        <td className="py-2.5 px-4">
                          <div className="relative w-10 h-10 rounded bg-[#111111] border border-[#2d2d2d]/60 flex items-center justify-center overflow-hidden mx-auto">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name_fr}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-[#C0392B] font-bold">MILANO</span>
                            )}
                          </div>
                        </td>

                        {/* Title column */}
                        <td className="py-2.5 px-4">
                          <div>
                            <div className="font-bold text-white text-xs md:text-sm">{item.name_fr}</div>
                            <div className="text-gray-400 text-[11px] font-sans mt-0.5 tracking-wide text-right sm:text-left" dir="rtl">{item.name_ar}</div>
                          </div>
                        </td>

                        {/* Category column */}
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-1 bg-[#111111] border border-[#2d2d2d] text-gray-300 rounded text-[11px]">
                            {cat ? cat.name_fr : 'Inconnu'}
                          </span>
                        </td>

                        {/* Price column */}
                        <td className="py-2.5 px-4 text-right font-extrabold text-white text-xs md:text-sm">
                          {item.price.toLocaleString()} DA
                        </td>

                        {/* Availability Toggle */}
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleAvailability(item.id, item.is_available)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition-all duration-200 border ${
                              item.is_available
                                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-900/20'
                                : 'bg-red-950/40 border-red-900 text-red-400 hover:bg-red-900/20'
                            }`}
                          >
                            {item.is_available ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                Visible
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                Masqué
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions column */}
                        <td className="py-2.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 rounded bg-[#111111] hover:bg-[#2d2d2d] text-gray-300 hover:text-white border border-[#2d2d2d] transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingItem(item);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded bg-red-950/20 hover:bg-red-950/60 border border-red-900/40 text-red-400 hover:text-white transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODALS ================= */}


{/* 1. ADD ITEM MODAL */}
{isAddModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-[#1A1A1A] border border-[#2d2d2d] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d] bg-[#111111]">
        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Ajouter un Plat</h3>
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Form */}
      <form onSubmit={handleAddItem} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        {formError && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{formError}</span>
          </div>
        )}

        {/* Names (FR / AR) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Nom (French) <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="text"
              required
              value={formNameFr}
              onChange={(e) => setFormNameFr(e.target.value)}
              placeholder="Pizza Calzone"
              className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 text-right sm:text-left">
              الاسم (Arabic) <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="text"
              required
              value={formNameAr}
              onChange={(e) => setFormNameAr(e.target.value)}
              placeholder="بيتزا كالزون"
              className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B] text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Catégorie <span className="text-[#C0392B]">*</span>
            </label>
            <select
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(e.target.value)}
              className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_fr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Prix (DZD) <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              placeholder="550"
              className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Description (French)
          </label>
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Sauce tomate, fromage mozzarella, origan..."
            rows={2}
            className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B] resize-none"
          />
        </div>

        {/* Image Section */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Photo du Plat
          </label>
          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="relative w-20 h-20 rounded bg-[#111111] border border-[#2d2d2d] flex items-center justify-center overflow-hidden flex-shrink-0">
              {formImagePreview ? (
                <Image src={formImagePreview} alt="preview" fill sizes="80px" className="object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500">{"Pas d'image"}</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex-grow space-y-2">
              {/* Auto from Unsplash */}
              <button
                type="button"
                onClick={fetchImageFromUnsplash}
                disabled={formFetchingImage || !formNameFr.trim()}
                className="w-full px-4 py-2.5 border border-[#C0392B] bg-[#111111] hover:bg-[#C0392B]/10 text-[#C0392B] hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formFetchingImage ? (
                  <>
                    <span className="w-3 h-3 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    {formImagePreview ? 'Actualiser' : 'Générer'} via Pexels
                  </>
                )}
              </button>

              {/* Upload from device */}
              <label className="w-full px-4 py-2.5 border border-[#2d2d2d] bg-[#111111] hover:bg-[#202020] text-gray-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                {formImageFile ? '📎 ' + formImageFile.name.slice(0, 20) + '...' : 'Charger depuis l\'appareil'}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Source indicator */}
              {formImagePreview && (
                <p className="text-[10px] text-gray-500">
                  {formImageFile ? '📁 Image locale sélectionnée' : '🌐 Image depuis Pexels'}
                </p>
              )}

              {/* Clear */}
              {formImagePreview && (
                <button
                  type="button"
                  onClick={() => { setFormImagePreview(null); setFormImageFile(null); }}
                  className="w-full px-4 py-2 border border-gray-700 bg-[#111111] hover:bg-red-950/20 text-gray-500 hover:text-red-400 rounded-lg text-xs font-semibold transition-colors"
                >
                  {"Effacer l'image"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-2.5 pt-2">
          <input
            type="checkbox"
            id="formIsAvailable"
            checked={formIsAvailable}
            onChange={(e) => setFormIsAvailable(e.target.checked)}
            className="w-4 h-4 rounded text-[#C0392B] focus:ring-[#C0392B] bg-[#111111] border-[#2d2d2d]"
          />
          <label htmlFor="formIsAvailable" className="text-xs font-bold text-gray-300 select-none">
            Plat disponible immédiatement (visible sur la carte)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2d2d2d] mt-6">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="px-4 py-2 bg-[#111111] border border-[#2d2d2d] hover:bg-[#202020] text-gray-400 hover:text-white text-xs font-bold rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={formLoading}
            className="px-5 py-2 bg-[#C0392B] hover:bg-[#a3281a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
          >
            {formLoading && <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
            Ajouter
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* 2. EDIT ITEM MODAL */}
{isEditModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-[#1A1A1A] border border-[#2d2d2d] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d] bg-[#111111]">
        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Modifier le Plat</h3>
        <button
          onClick={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Form */}
      <form onSubmit={handleEditItem} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        {formError && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{formError}</span>
          </div>
        )}

        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Nom (French) <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="text"
              required
              value={formNameFr}
              onChange={(e) => setFormNameFr(e.target.value)}
              className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 text-right sm:text-left">
              الاسم (Arabic) <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="text"
              required
              value={formNameAr}
              onChange={(e) => setFormNameAr(e.target.value)}
              className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B] text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Catégorie <span className="text-[#C0392B]">*</span>
            </label>
            <select
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(e.target.value)}
              className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_fr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Prix (DZD) <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Description (French)
          </label>
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={2}
            className="w-full py-2 px-3 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-xs focus:outline-none focus:border-[#C0392B] resize-none"
          />
        </div>

        {/* Image Section */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Photo du Plat
          </label>
          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="relative w-20 h-20 rounded bg-[#111111] border border-[#2d2d2d] flex items-center justify-center overflow-hidden flex-shrink-0">
              {formImagePreview ? (
                <Image src={formImagePreview} alt="preview" fill sizes="80px" className="object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500">{"Pas d'image"}</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex-grow space-y-2">
              {/* Auto from Unsplash */}
              <button
                type="button"
                onClick={fetchImageFromUnsplash}
                disabled={formFetchingImage || !formNameFr.trim()}
                className="w-full px-4 py-2.5 border border-[#C0392B] bg-[#111111] hover:bg-[#C0392B]/10 text-[#C0392B] hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formFetchingImage ? (
                  <>
                    <span className="w-3 h-3 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    {formImagePreview ? 'Actualiser' : 'Générer'} via Pexels
                  </>
                )}
              </button>

              {/* Upload from device */}
              <label className="w-full px-4 py-2.5 border border-[#2d2d2d] bg-[#111111] hover:bg-[#202020] text-gray-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                {formImageFile ? '📎 ' + formImageFile.name.slice(0, 20) + '...' : 'Charger depuis l\'appareil'}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Source indicator */}
              {formImagePreview && (
                <p className="text-[10px] text-gray-500">
                  {formImageFile ? '📁 Image locale sélectionnée' : '🌐 Image depuis Unsplash'}
                </p>
              )}

              {/* Clear */}
              {formImagePreview && (
                <button
                  type="button"
                  onClick={() => { setFormImagePreview(null); setFormImageFile(null); }}
                  className="w-full px-4 py-2 border border-gray-700 bg-[#111111] hover:bg-red-950/20 text-gray-500 hover:text-red-400 rounded-lg text-xs font-semibold transition-colors"
                >
                 { "Effacer l'image"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-2.5 pt-2">
          <input
            type="checkbox"
            id="formIsAvailableEdit"
            checked={formIsAvailable}
            onChange={(e) => setFormIsAvailable(e.target.checked)}
            className="w-4 h-4 rounded text-[#C0392B] focus:ring-[#C0392B] bg-[#111111] border-[#2d2d2d]"
          />
          <label htmlFor="formIsAvailableEdit" className="text-xs font-bold text-gray-300 select-none">
            Plat disponible immédiatement (visible sur la carte)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2d2d2d] mt-6">
          <button
            type="button"
            onClick={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
            }}
            className="px-4 py-2 bg-[#111111] border border-[#2d2d2d] hover:bg-[#202020] text-gray-400 hover:text-white text-xs font-bold rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={formLoading}
            className="px-5 py-2 bg-[#C0392B] hover:bg-[#a3281a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
          >
            {formLoading && <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1A1A1A] border border-[#2d2d2d] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-900/50 text-[#C0392B] flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-white mb-2">Confirmer la suppression</h3>
              <p className="text-xs text-gray-400 leading-normal max-w-xs mx-auto">
                Êtes-vous sûr de vouloir supprimer définitivement le plat <strong className="text-white">&quot;{deletingItem.name_fr}&quot;</strong> ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex items-center border-t border-[#2d2d2d] bg-[#111111]">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingItem(null);
                }}
                disabled={formLoading}
                className="w-1/2 py-3.5 border-r border-[#2d2d2d] hover:bg-[#1A1A1A] text-xs font-bold text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                disabled={formLoading}
                className="w-1/2 py-3.5 hover:bg-red-950/20 text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
              >
                {formLoading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
