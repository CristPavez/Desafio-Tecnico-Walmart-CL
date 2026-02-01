'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { CartItemSkeleton } from '@/components/Skeletons';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadProducts();
  }, [items]);

  const loadProducts = async () => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      const productsMap: { [key: string]: Product } = {};
      for (const item of items) {
        if (!products[item.sku]) {
          const product = await api.getProduct(item.sku);
          productsMap[item.sku] = product;
        }
      }
      setProducts({ ...products, ...productsMap });
    } catch (error) {
      console.error('Error loading productos:', error);
    }
    setLoading(false);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const product = products[item.sku];
      if (product) {
        return sum + product.price * item.quantity;
      }
      return sum;
    }, 0);
  };

  if (!mounted || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = products[item.sku];
            if (!product) return null;
            
            return (
              <div
                key={item.sku}
                className="bg-white p-4 rounded-lg shadow flex items-center gap-4"
              >
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-blue-600 font-bold">
                    ${product.price.toLocaleString('es-CL')}
                  </p>
                  {product.oldPrice && (
                    <p className="text-gray-400 line-through text-sm">
                      ${product.oldPrice.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.sku, Number(e.target.value))
                    }
                    className="border rounded px-2 py-1"
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n === 0 ? 'Eliminar' : n}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeItem(item.sku)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">
                ${calculateSubtotal().toLocaleString('es-CL')}
              </span>
            </div>
          </div>
          <Link href="/checkout">
            <button className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition">
              Continuar Compra
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
