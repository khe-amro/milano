'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, ArrowUp, Clock, AlertCircle } from 'lucide-react';

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

interface MenuClientProps {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
}

// Custom category icons for rendering as fallback image placeholders
function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  if (name.includes('pizza')) {
    return (
      <svg className="w-12 h-12 text-[#C0392B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M12 12m-9 0a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
        <path d="M12 12L7.5 4.5M12 12L16.5 4.5" strokeLinecap="round" />
        <circle cx="10" cy="8" r="1.5" fill="currentColor" />
        <circle cx="14" cy="8" r="1.5" fill="currentColor" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (name.includes('sandwich')) {
    return (
      <svg className="w-12 h-12 text-[#C0392B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M3 16h18M7 4h10c1.5 0 3 1.2 3 2.5v9c0 1.3-1.5 2.5-3 2.5H7c-1.5 0-3-1.2-3-2.5v-9C4 5.2 5.5 4 7 4Z" />
        <path d="M4 12h16" strokeDasharray="2 2" />
        <path d="M6 8s2 1 4 0 4 1 6 0" />
      </svg>
    );
  }
  if (name.includes('tacos') || name.includes('taco')) {
    return (
      <svg className="w-12 h-12 text-[#C0392B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 12l7.03 5.61C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.3 16.3L12 12l6.7 4.3" />
        <circle cx="9" cy="8" r="0.8" fill="currentColor" />
        <circle cx="15" cy="8" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  if (name.includes('plats') || name.includes('plat')) {
    return (
      <svg className="w-12 h-12 text-[#C0392B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" strokeDasharray="3 3" />
        <path d="M12 7v10M7 12h10" strokeLinecap="round" />
      </svg>
    );
  }
  // Boissons / Drinks
  return (
    <svg className="w-12 h-12 text-[#C0392B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L7 6h10l1 12H6Z" />
      <path d="M9 6V3h4v3" strokeLinecap="round" />
      <path d="M13 3l3-2" strokeLinecap="round" />
      <path d="M6 10h12" strokeLinecap="round" />
    </svg>
  );
}

export default function MenuClient({ restaurant, categories, menuItems }: MenuClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isScrollingRef = useRef(false);

  // Filter menu items by search query (bilingual search in FR or AR name)
  const filteredItems = menuItems.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.name_fr.toLowerCase().includes(query) ||
      item.name_ar.includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });

  // Register PWA Service Worker on Mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('PWA Service Worker registered with scope:', reg.scope))
          .catch((err) => console.error('PWA Service Worker registration failed:', err));
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
        return () => window.removeEventListener('load', registerSW);
      }
    }
  }, []);

  // Track scrolling to show/hide "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: Highlight category tab as user scrolls through sections
  useEffect(() => {
    if (searchQuery) return; // Disable scroll-spy during active search filtering

    const observerOptions = {
      root: null,
      rootMargin: '-130px 0px -60% 0px', // Matches sticky header offset
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return; // Skip observer updates during programmatic tab scroll

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const catId = entry.target.id.replace('category-', '');
          setActiveCategory(catId);
          
          // Auto-scroll the active tab into view horizontally in the navbar
          const tabButton = document.getElementById(`tab-${catId}`);
          if (tabButton) {
            tabButton.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center',
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    categories.forEach((cat) => {
      const element = document.getElementById(`category-${cat.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [categories, searchQuery]);

  const scrollToCategory = (catId: string) => {
    isScrollingRef.current = true;
    setActiveCategory(catId);
    
    const element = document.getElementById(`category-${catId}`);
    if (element) {
      const offset = 120; // Matches height of sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    // Release scroll lock after animation completes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[#111111] text-[#E8E8E8] pb-16">
      {/* 1. Header Banner */}
      <header className="relative w-full pt-10 pb-6 px-4 flex flex-col items-center bg-gradient-to-b from-[#1A1A1A] to-[#111111] border-b border-[#2d2d2d]/30 text-center">
        {/* Logo with deep red circular ring */}
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#C0392B] bg-[#1A1A1A] overflow-hidden shadow-xl shadow-[#C0392B]/10 hover:scale-105 transition-transform duration-300">
          <Image
            src="/images/logo.png"
            alt="Milano Bellaka Logo"
            fill
            sizes="(max-width: 768px) 112px, 128px"
            className="object-cover"
            priority
          />
        </div>

        {/* Decorative Calligraphy brush strokes */}
        <div className="relative w-36 mt-3 flex justify-center items-center select-none pointer-events-none opacity-80">
          <Image
            src="/images/calligraphy_light.png"
            alt="ميلانو ميلانو"
            width={140}
            height={48}
            className="object-contain filter brightness-110"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-white">
          MILANO BELLAKA
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-1.5 justify-center">
          <Clock className="w-3.5 h-3.5 text-[#C0392B]" /> Depuis 2005 • Fast Food & Pizzeria
        </p>

        {/* 2. Interactive Search Box */}
        <div className="w-full max-w-md mt-6 px-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher / بحث عن وجبة..."
              className="w-full py-2.5 pl-10 pr-4 bg-[#1A1A1A] text-white border border-[#2d2d2d] rounded-full text-sm focus:outline-none focus:border-[#C0392B] focus:ring-1 focus:ring-[#C0392B] placeholder-gray-500 transition-all duration-300 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-xs text-gray-400 hover:text-white"
              >
                Vider
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. Sticky Category Navbar */}
      <nav className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md border-b border-[#2d2d2d] py-3 shadow-lg select-none">
        <div className="max-w-3xl mx-auto flex space-x-2 overflow-x-auto px-4 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`tab-${cat.id}`}
                onClick={() => scrollToCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#C0392B] text-white shadow-md shadow-[#C0392B]/20 scale-102 font-bold'
                    : 'bg-[#1A1A1A] text-gray-400 border border-[#2d2d2d] hover:text-[#E8E8E8] hover:border-gray-600'
                }`}
              >
                <span>{cat.name_fr}</span>
                <span className="opacity-75 text-xs font-normal">| {cat.name_ar}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Categorized Items Grid */}
      <main className="max-w-5xl mx-auto px-4 mt-6">
        {searchQuery ? (
          /* Search results view */
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              Résultats de recherche ({filteredItems.length})
            </h2>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-[#1A1A1A] rounded-2xl border border-[#2d2d2d] p-6 max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-[#C0392B] mx-auto mb-3" />
                <p className="text-gray-300 font-medium">Aucun plat ne correspond à votre recherche.</p>
                <p className="text-xs text-gray-500 mt-1">Essayez un autre mot-clé (ex: Pizza, Poulet, Eau).</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} category={categories.find(c => c.id === item.category_id)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grouped by category scroll sections */
          categories.map((cat) => {
            const items = menuItems.filter((item) => item.category_id === cat.id);
            if (items.length === 0) return null;

            return (
              <section
                key={cat.id}
                id={`category-${cat.id}`}
                className="scroll-mt-nav mb-10"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-[#2d2d2d] pb-2 mb-6">
                  <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#C0392B] rounded-full"></span>
                    {cat.name_fr}
                  </h2>
                  <span className="text-lg md:text-xl font-bold text-[#C0392B] font-sans" dir="rtl">
                    {cat.name_ar}
                  </span>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <MenuItemCard key={item.id} item={item} category={cat} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* 5. Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[#C0392B] text-white shadow-lg hover:bg-[#a3281a] transition-all duration-300 z-40 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/50 animate-fade-in hover:scale-110 active:scale-95"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  category?: Category;
}

// Single menu item card component
function MenuItemCard({ item, category }: MenuItemCardProps) {
  return (
    <div className="group flex items-center p-3.5 bg-[#1A1A1A] rounded-xl border border-[#2d2d2d] hover:border-[#C0392B]/50 transition-all duration-300 shadow-md hover:shadow-[#C0392B]/5">
      {/* Food Photo Frame — blank dark box when no image */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#201515] to-[#121212] flex items-center justify-center border border-[#2d2d2d]/60 shadow-inner">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.name_fr}
            fill
            sizes="(max-width: 768px) 80px, 96px"
            className="object-cover group-hover:scale-108 transition-transform duration-500"
          />
        )}
      </div>

      {/* Product Information */}
      <div className="flex-grow pl-4 flex flex-col justify-between min-h-[80px] md:min-h-[96px] min-w-0">
        {/* Name (FR left, AR right) */}
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 w-full min-w-0">
            <h3 className="font-bold text-sm md:text-base text-white group-hover:text-[#C0392B] transition-colors duration-300 leading-snug break-words">
              {item.name_fr}
            </h3>
            <span
              className="font-extrabold text-sm md:text-base text-right text-gray-200 leading-snug tracking-normal break-words w-full sm:w-auto text-right sm:text-right"
              dir="rtl"
            >
              {item.name_ar}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-gray-400 mt-1 leading-normal line-clamp-2 pr-2 break-words">
              {item.description}
            </p>
          )}
        </div>

        {/* Price Tag in DZD */}
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-sm md:text-base font-extrabold text-[#C0392B]">
            {item.price.toLocaleString()} <span className="text-xs font-semibold text-gray-400">DZD</span>
          </span>
          <span className="text-[10px] text-gray-500 select-none">Milano 2005</span>
        </div>
      </div>
    </div>
  );
}
