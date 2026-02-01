'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
      <Link href={`/product/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        <p className="text-2xl font-bold text-blue-600">
          ${product.price.toLocaleString('es-CL')}
        </p>
      </Link>
      <button
        onClick={() => addItem(product)}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
      >
        Agregar
      </button>
    </div>
  );
}
