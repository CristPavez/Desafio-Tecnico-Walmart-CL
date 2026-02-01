'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Product, Zone } from '@/types';
import { getSessionId, formatDateForAPI, getMinDate, getMaxDate } from '@/lib/utils';
import { DeliveryWindowSkeleton } from '@/components/Skeletons';
import { Check, MapPin, Calendar } from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [address, setAddress] = useState('');
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<any>(null);
  const [deliveryWindows, setDeliveryWindows] = useState([]);
  const [loadingWindows, setLoadingWindows] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('DEBIT_CARD');
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    setMounted(true);

    setSessionId(getSessionId());

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(formatDateForAPI(tomorrow));
    

    loadProducts();
    loadZones();
  }, []);

  const loadProducts = async () => {
    if (items.length === 0) {
      setLoadingProducts(false);
      return;
    }
    
    try {
      const productsMap: { [key: string]: Product } = {};
      for (const item of items) {
        const product = await api.getProduct(item.sku);
        productsMap[item.sku] = product;
      }
      setProducts(productsMap);
    } catch (error) {
      console.error('Error loading productos:', error);
    }
    setLoadingProducts(false);
  };

  const loadZones = async () => {
    try {
      const zonesData = await api.getZones();
      setZones(zonesData);

      if (zonesData.length > 0) {
        setSelectedZone(zonesData[0]);
      }
    } catch (error) {
      console.error('Error loading zonas:', error);
    }
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

  const loadDeliveryWindows = async () => {
    if (!deliveryDate || !selectedZone) return;
    
    setLoadingWindows(true);
    try {
      
      const windows = await api.searchDeliveryWindows({
        date: deliveryDate,
        sessionId,
        zoneId: selectedZone.id,
      });
      
      setDeliveryWindows(windows);
      
 
      const reservedWindow = windows.find((w: any) => w.isReservedByUser);
      if (reservedWindow) {
        setSelectedWindow(reservedWindow);
      } else {
        setSelectedWindow(null);
      }
    } catch (error) {
      console.error('Error loading ventanas:', error);
    }
    setLoadingWindows(false);
  };

  const handleWindowSelect = async (window: any) => {

    if (selectedWindow?.id === window.id) return;
    
    if (!selectedZone) {
      alert('Por favor selecciona una zona primero');
      return;
    }
    
    const zoneCapacity = window.capacityByZone[selectedZone.id];
    if (zoneCapacity <= 0) {
      alert('Esta ventana ya no tiene cupos disponibles. Por favor selecciona otra.');
      return;
    }
    
    try {

      await api.createSoftReservation({
        deliveryWindowId: window.id,
        sessionId,
        zoneId: selectedZone.id,
      });
      
      setSelectedWindow(window);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al reservar ventana';
      alert(` ${errorMessage}`);
   

      if (errorMessage.includes('límite') || errorMessage.includes('capacidad') || errorMessage.includes('cupo')) {
        await loadDeliveryWindows();
      }
    }
  };

  useEffect(() => {
    if (step === 2 && sessionId && selectedZone) {  
      loadDeliveryWindows();
    }
  }, [deliveryDate, selectedZone, step, sessionId]);

 
  useEffect(() => {
    const handleRouteChange = async () => {
      if (sessionId) {
        try {
          await api.cancelReservation(sessionId);
        } catch (error) {
          console.error('Error al cancelar reserva:', error);
        }
      }
    };
 
    return () => {
      handleRouteChange();
    };
  }, [sessionId]);

  const handleStep1Continue = async () => {
    setLoading(true);
    const payload = {
      items,
      paymentMethod,
      promoCode: promoCode || null,
    };
    const data = await api.processCheckout(payload);
    setCheckoutData(data);
    setLoading(false);
    setStep(2);
  };

  const handleStep2Continue = () => {
    if (!selectedWindow) {
      alert('Selecciona una ventana de despacho');
      return;
    }
    if (!address.trim()) {
      alert('Ingresa tu dirección de despacho');
      return;
    }
    setStep(3);
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const subtotal = calculateSubtotal();
      

      await new Promise(resolve => setTimeout(resolve, 1000));
      
  
      clearCart();
      alert('¡Compra finalizada exitosamente! 🎉');
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al finalizar compra');
    }
    setLoading(false);
  };

  const steps = [
    { number: 1, name: 'Resumen' },
    { number: 2, name: 'Despacho' },
    { number: 3, name: 'Pago' },
  ];
  if (!mounted || loadingProducts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pasos */}
      <div className="mb-8 sm:mb-12">
        {/* Mobile: Vertical */}
        <div className="sm:hidden space-y-3">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  step >= s.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step > s.number ? <Check size={16} /> : s.number}
              </div>
              <span className={`ml-3 ${step === s.number ? 'font-bold text-blue-600' : 'font-medium text-gray-600'}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop: Horizontal */}
        <div className="hidden sm:flex items-center justify-center">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step > s.number ? <Check size={20} /> : s.number}
              </div>
              <span className="ml-2 font-semibold">{s.name}</span>
              {index < steps.length - 1 && (
                <div className="w-24 h-1 bg-gray-300 mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Resumen de Compra</h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => {
              const product = products[item.sku];
              if (!product) return null;
              return (
                <div key={item.sku} className="flex justify-between">
                  <span>{product.name} (x{item.quantity})</span>
                  <span className="font-semibold">
                    ${(product.price * item.quantity).toLocaleString('es-CL')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toLocaleString('es-CL')}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Código promocional</label>
            <input
              type="text"
              placeholder="SAVE10, SAVE20, WELCOME"
              className="w-full border rounded px-4 py-2"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Medio de pago</label>
            <select
              className="w-full border rounded px-4 py-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CREDIT_CARD">Tarjeta de Crédito</option>
              <option value="DEBIT_CARD">Tarjeta de Débito (10% desc.)</option>
              <option value="CASH">Efectivo (5% desc.)</option>
            </select>
          </div>

          <button
            onClick={handleStep1Continue}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Procesando...' : 'Continuar'}
          </button>
        </div>
      )}

      {/* Despacho */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Selecciona Ventana de Despacho</h2>

          {checkoutData && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total a pagar:</span>
                <span className="text-blue-600">
                  ${mounted && checkoutData.total.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          )}

          {/* Campos de búsqueda */}
          <div className="mb-6">
            <label className="flex items-center font-semibold mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              Comuna / Zona de Despacho
            </label>
            <select
              className="w-full border rounded px-4 py-2"
              value={selectedZone?.id || ''}
              onChange={(e) => {
                const zone = zones.find(z => z.id === e.target.value);
                setSelectedZone(zone || null);
                setSelectedWindow(null); 
              }}
            >
              {zones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} - {zone.zipCode}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <div>
              <label className="flex items-center font-semibold mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Fecha de Despacho
              </label>
              <input
                type="date"
                className="w-full border rounded px-4 py-2"
                value={deliveryDate}
                min={getMinDate()}
                max={getMaxDate()}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Dirección de Despacho</label>
            <input
              type="text"
              className="w-full border rounded px-4 py-2"
              value={address}
              placeholder="Ej: Av. Libertador Bernardo O'Higgins 123, Depto 401"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <h3 className="font-semibold mb-3">
            Ventanas Disponibles
            {selectedWindow && (
              <span className="text-sm text-green-600 ml-2 font-medium">
                ✓ Reservado
              </span>
            )}
          </h3>
          <div className="space-y-3 mb-6">
            {loadingWindows ? (
              Array.from({ length: 3 }).map((_, i) => (
                <DeliveryWindowSkeleton key={i} />
              ))
            ) : deliveryWindows.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No hay ventanas disponibles para esta fecha y ubicación
              </p>
            ) : (
              deliveryWindows.map((window: any) => {
                const zoneCapacity = selectedZone ? window.capacityByZone[selectedZone.id] : 0;
                const isAvailable = zoneCapacity > 0;
                const isSelected = selectedWindow?.id === window.id;
                const isReservedByUser = window.isReservedByUser || false;
                
                return (
                  <div
                    key={window.id}
                    onClick={() => isAvailable && handleWindowSelect(window)}
                    className={`border-2 rounded-lg p-4 transition ${
                      !isAvailable 
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60' 
                        : isSelected
                        ? 'border-blue-600 bg-blue-50 cursor-pointer'
                        : 'border-gray-300 hover:border-blue-400 cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-sm mt-1 ${!isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                          📅 {window.date} - ⏰ {window.startTime} a {window.endTime}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <p className={`text-sm font-medium ${
                            !isAvailable ? 'text-red-500' : zoneCapacity <= 3 ? 'text-orange-500' : 'text-green-600'
                          }`}>
                            {!isAvailable 
                              ? 'Sin cupos disponibles' 
                              : zoneCapacity <= 3
                              ? `Solo ${zoneCapacity} cupos restantes`
                              : `${zoneCapacity} cupos disponibles`
                            }
                          </p>
              
               
                        </div>
                        <p className={`text-lg font-bold mt-2 ${!isAvailable ? 'text-gray-400' : 'text-blue-600'}`}>
                         Costo: ${window.cost?.toLocaleString('es-CL')}
                        </p>
                      </div>
                      {isSelected && isAvailable && (
                        <Check className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={handleStep2Continue}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Continuar
          </button>
        </div>
      )}

      {/* Confirmación y Pago */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Confirmar Pago</h2>

          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Resumen Final</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal Productos</span>
                <span>${checkoutData?.subtotal.toLocaleString('es-CL')}</span>
              </div>
              {checkoutData?.discounts.map((d: any, i: number) => (
                <div key={i} className="flex justify-between text-green-600">
                  <span>{d.description}</span>
                  <span>-${d.amount.toLocaleString('es-CL')}</span>
                </div>
              ))}
              <div className="flex justify-between text-blue-600">
                <span>🚚 Costo de Despacho</span>
                <span>${selectedWindow?.cost?.toLocaleString('es-CL')}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-xl">
                <span>Total Final</span>
                <span className="text-blue-600">
                  ${((checkoutData?.total || 0) + (selectedWindow?.cost || 0)).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>

          {/* Simulación de pago */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Información de Pago (Simulado)</h3>
            <input
              type="text"
              placeholder="Número de tarjeta"
              className="w-full border rounded px-4 py-2 mb-3"
              value="**** **** **** 1234"
              disabled
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/AA"
                className="border rounded px-4 py-2"
                value="12/26"
                disabled
              />
              <input
                type="text"
                placeholder="CVV"
                className="border rounded px-4 py-2"
                value="***"
                disabled
              />
            </div>
          </div>

          <button
            onClick={handleFinalize}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition text-lg"
          >
            {loading ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </div>
      )}
    </div>
  );
}
