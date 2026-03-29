import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from './context/CartContext';

export default function Gracias() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear the cart when the user reaches the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-[#3E2A24] mb-4">
          ¡Gracias por tu compra!
        </h1>
        
        <p className="text-[#5D4037] mb-8 leading-relaxed">
          Tu pedido ha sido procesado correctamente. Hemos enviado un correo electrónico con los detalles de tu compra y la confirmación del pedido.
        </p>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-8">
            ID de transacción: {sessionId}
          </p>
        )}

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-[#5D4037] text-white px-6 py-3 rounded-md font-medium hover:bg-[#3E2A24] transition-colors"
          >
            Seguir comprando
          </Link>
          
          <Link
            to="/categoria/Novedades"
            className="inline-flex items-center text-[#B89F82] hover:text-[#967A70] font-medium"
          >
            Ver novedades <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            ¿Tienes alguna duda? <Link to="/contacto" className="text-[#B89F82] hover:underline">Contáctanos</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
