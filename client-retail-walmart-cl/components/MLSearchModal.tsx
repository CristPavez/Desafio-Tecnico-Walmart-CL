'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Loader2, ArrowRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  similarity_score: number;
}

interface MLSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MLSearchModal({ isOpen, onClose }: MLSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);


  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setLoading(false);
    }
  }, [isOpen]);


  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    
    try {
      const data = await api.mlSearch(searchQuery.trim(), 5);
      
      if(!Array.isArray(data)) {
        throw new Error('Respuesta inválida del servidor');
      }
 
      setTotalResults(data.length);
      setResults(data);
    } catch (err) {
      console.error('Error:', err);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const handleViewAll = () => {
    if (query.trim()) {
      router.push(`/ml-search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleQuickSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">Búsqueda Inteligente</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: ropa cómoda para ejercicio..."
              className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Search size={20} />
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 mb-3">
            Escribe para buscar, verás los 5 resultados más relevantes
          </p>
          
          {/* Quick Search Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Búsquedas populares:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickSearch('ropa cómoda para ejercicio')}
                className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 border border-blue-200 transition"
              >
                Ropa cómoda para ejercicio
              </button>
              <button
                onClick={() => handleQuickSearch('zapatillas para correr')}
                className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-full hover:bg-green-100 border border-green-200 transition"
              >
                Zapatillas para correr
              </button>
              <button
                onClick={() => handleQuickSearch('polera algodon')}
                className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 border border-indigo-200 transition"
              >
                Polera algodón
              </button>
            </div>
          </div>
        </div>

        {/* Info Content con scroll */}
        <div className="overflow-y-auto max-h-[400px] p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
          )}



          {!loading && query && results.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No se encontraron resultados</p>
              <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top 5 resultados
                </h3>
                <span className="text-sm text-gray-500">
                  {totalResults} total{totalResults > 1 ? 'es' : ''}
                </span>
              </div>
              
              {results.map((product, index) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 border rounded-lg hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    router.push(`/product/${product.id}`);
                    onClose();
                  }}
                >
                  {/* Ranking Badge */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-600' :
                      'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {product.brand}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-blue-600">
                        ${product.price.toLocaleString('es-CL')}
                      </div>
              
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
