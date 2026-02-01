'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Sparkles } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import MLSearchModal from './MLSearchModal';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [showMLSearch, setShowMLSearch] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="bg-blue-600 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <Link href="/" className="text-lg sm:text-2xl font-bold whitespace-nowrap">
              Walmart Chile
            </Link>

            {/* Búsqueda */}
            <button
              onClick={() => setShowMLSearch(true)}
              className="flex-1 max-w-md sm:max-w-2xl"
            >
              <div className="relative hover:opacity-90 transition">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-gray-900 cursor-pointer text-sm sm:text-base"
                  readOnly
                />
                <div className="absolute right-2 sm:right-3 top-1.5 sm:top-2.5 flex items-center gap-1">
                  <Sparkles className="text-blue-600 hidden sm:block" size={16} />
                  <Search className="text-gray-500" size={18} />
                </div>
              </div>
            </button>

            {/* Carrito */}
            <Link href="/cart" className="relative flex-shrink-0">
              <ShoppingCart size={24} className="sm:w-7 sm:h-7" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Modal de búsqueda ML */}
      <MLSearchModal 
        isOpen={showMLSearch} 
        onClose={() => setShowMLSearch(false)} 
      />
    </>
  );
}
