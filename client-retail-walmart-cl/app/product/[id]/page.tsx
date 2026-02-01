'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { ProductDetailSkeleton } from '@/components/Skeletons';
import { Product } from '@/types';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await api.getProduct(params.id as string);
      setProduct(data);
    } catch (error) {
      console.error('Error loading producto:', error);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({ sku: product.id, quantity });
      router.push('/cart');
    }
  };

  if (loading) return <ProductDetailSkeleton />;

  if (!product) return <div className="text-center py-12">Producto no encontrado</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow">
        {/* Imagen */}
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        {/* Detalles */}
        <div>
          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-3xl font-bold text-blue-600">
              ${product.price.toLocaleString('es-CL')}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Cantidad:</label>
            <select
              className="border rounded px-4 py-2"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
