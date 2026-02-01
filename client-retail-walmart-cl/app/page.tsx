'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeletons';
import { Product } from '@/types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    const savedFilters = localStorage.getItem('catalogo_filtros');
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters));
      } catch (error) {
        console.error('Error loading filtros:', error);
      }
    }
    setIsInitialized(true);
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isInitialized) return; 
    setCurrentPage(0);
    loadProducts(0);

    localStorage.setItem('catalogo_filtros', JSON.stringify(filters));
  }, [filters, isInitialized]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categorias:', error);
    }
  };

  const loadProducts = async (page: number = currentPage) => {
    setLoading(true);
    try {
      const data = await api.getProducts({ ...filters, page, size: 12 });
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading productos:', error);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadProducts(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catálogo de Productos</h1>


      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
          >
            <X size={16} />
            Limpiar filtros
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded px-4 py-2"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="border rounded px-4 py-2"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Precio mín"
            className="border rounded px-4 py-2"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio máx"
            className="border rounded px-4 py-2"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* Grid de productos */}
      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No se encontraron productos
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={20} />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {/* Primera página */}
                {currentPage > 2 && (
                  <>
                    <button
                      onClick={() => handlePageChange(0)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="px-2">...</span>}
                  </>
                )}

                {/* Páginas alrededor de la actual */}
                {Array.from({ length: totalPages }, (_, i) => i)
                  .filter((page) => {
                    return (
                      page === currentPage ||
                      page === currentPage - 1 ||
                      page === currentPage + 1 ||
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    );
                  })
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}

                {/* Última página */}
                {currentPage < totalPages - 3 && (
                  <>
                    {currentPage < totalPages - 4 && <span className="px-2">...</span>}
                    <button
                      onClick={() => handlePageChange(totalPages - 1)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Siguiente
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Info de resultados */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Mostrando {currentPage * 12 + 1} - {Math.min((currentPage + 1) * 12, totalElements)} de {totalElements} productos
          </div>
        </>
      )}
    </div>
  );
}

