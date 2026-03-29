import React, { useState } from 'react';
import { useCart } from './context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard } from 'lucide-react';

export default function Checkout() {
  const { items, cartTotal, accumulateOrder, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingMethod, setShippingMethod] = useState<'home' | 'store'>('home');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">Tu cesta está vacía</h2>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-[#B89F82] hover:text-[#967A70]"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver a la tienda
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const shippingCost = accumulateOrder || shippingMethod === 'store' || cartTotal >= 80 ? 0 : 5.50;
  const finalTotal = cartTotal + shippingCost;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setValidationError(null);

    try {
      console.log('Iniciando proceso de checkout...');
      // 1. Validate stock first
      console.log('Validando stock...');
      const validateResponse = await fetch('/api/validate-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            code: item.product.code,
            size: item.size,
            quantity: item.quantity
          }))
        })
      });

      const validateData = await validateResponse.json();
      console.log('Resultado validación stock:', validateData);

      if (!validateResponse.ok || !validateData.valid) {
        let errorMessage = 'Lo sentimos, hay problemas de stock con algunos productos:\n';
        if (validateData.issues && Array.isArray(validateData.issues)) {
          validateData.issues.forEach((issue: any) => {
            if (issue.issue === 'out_of_stock') {
              errorMessage += `- ${issue.name} (Talla ${issue.size}) está agotado.\n`;
            } else if (issue.issue === 'insufficient_stock') {
              errorMessage += `- ${issue.name} (Talla ${issue.size}): Solo quedan ${issue.available} unidades.\n`;
            } else {
              errorMessage += `- ${issue.name} (Talla ${issue.size}) no está disponible.\n`;
            }
          });
        } else {
          errorMessage = validateData.error || 'Error al validar el stock.';
        }
        setValidationError(errorMessage);
        setIsProcessing(false);
        return;
      }

      // 2. Create Stripe Checkout Session
      console.log('Creando sesión de Stripe...');
      const checkoutResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingCost,
          customerEmail: formData.email,
          shippingMethod,
          accumulateOrder,
          shippingAddress: formData
        })
      });

      const checkoutData = await checkoutResponse.json();
      console.log('Respuesta de sesión Stripe:', checkoutData);

      if (!checkoutResponse.ok) {
        let errorMsg = checkoutData.error || 'Error al crear la sesión de pago.';
        if (errorMsg.includes('STRIPE_SECRET_KEY')) {
          errorMsg = 'Error de configuración: La pasarela de pago no está lista. Por favor, contacta con la administración.';
        }
        throw new Error(errorMsg);
      }

      // 3. Redirect to Stripe
      console.log('Redirigiendo a Stripe...');
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No se recibió la URL de pago de Stripe. Verifica la configuración del servidor.');
      }

    } catch (error: any) {
      console.error('Error detallado en Checkout:', error);
      setValidationError(error.message || 'Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-[#B89F82] hover:text-[#967A70] mb-8"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Volver a la tienda
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCheckout} className="space-y-8">
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">Información de contacto</h2>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B89F82] focus:ring-[#B89F82] sm:text-sm p-2 border"
                />
              </div>
            </section>

            {/* Shipping Method */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">Método de entrega</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`border rounded-lg p-4 cursor-pointer flex items-center ${shippingMethod === 'home' ? 'border-[#B89F82] bg-[#FCF9F5]' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="home"
                    checked={shippingMethod === 'home'}
                    onChange={() => setShippingMethod('home')}
                    className="h-4 w-4 text-[#B89F82] focus:ring-[#B89F82] border-gray-300"
                  />
                  <span className="ml-3 block text-sm font-medium text-gray-900">Envío a domicilio</span>
                </label>
                <label className={`border rounded-lg p-4 cursor-pointer flex items-center ${shippingMethod === 'store' ? 'border-[#B89F82] bg-[#FCF9F5]' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="store"
                    checked={shippingMethod === 'store'}
                    onChange={() => setShippingMethod('store')}
                    className="h-4 w-4 text-[#B89F82] focus:ring-[#B89F82] border-gray-300"
                  />
                  <span className="ml-3 block text-sm font-medium text-gray-900">Recogida en tienda (Gratis)</span>
                </label>
              </div>
            </section>

            {/* Shipping Address */}
            {shippingMethod === 'home' && (
              <section>
                <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">Dirección de envío</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B89F82] focus:ring-[#B89F82] sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B89F82] focus:ring-[#B89F82] sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B89F82] focus:ring-[#B89F82] sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Código Postal</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B89F82] focus:ring-[#B89F82] sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B89F82] focus:ring-[#B89F82] sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B89F82] focus:ring-[#B89F82] sm:text-sm p-2 border"
                    />
                  </div>
                </div>
              </section>
            )}

            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-6 whitespace-pre-line">
                {validationError}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full text-white px-6 py-4 rounded-md font-medium transition-colors text-lg mt-8 ${
                isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5D4037] hover:bg-[#3E2A24]'
              }`}
            >
              {isProcessing ? 'Procesando...' : `Pagar ${finalTotal.toFixed(2)} €`}
            </button>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-6">Resumen del pedido</h2>
            
            <ul className="divide-y divide-gray-200 mb-6">
              {items.map((item) => (
                <li key={`${item.product.code}-${item.size}`} className="py-4 flex">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-center"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col justify-center">
                    <div className="flex justify-between text-sm font-medium text-gray-900">
                      <h3 className="line-clamp-2">{item.product.name}</h3>
                      <p className="ml-4 whitespace-nowrap">{(Number(item.product.discounted_price) * item.quantity).toFixed(2)} €</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Talla: {item.size} | Cantidad: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium text-gray-900">{cartTotal.toFixed(2)} €</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-600">Envío</p>
                <p className="font-medium text-gray-900">
                  {shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2)} €`}
                </p>
              </div>

              {accumulateOrder && (
                <div className="bg-rose-50 p-3 rounded-md text-sm text-rose-700 font-medium">
                  PEDIDO PARA ACUMULAR: Guardaremos tus prendas en tienda.
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-lg font-medium text-gray-900">Total</p>
                <p className="text-xl font-bold text-gray-900">{finalTotal.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
