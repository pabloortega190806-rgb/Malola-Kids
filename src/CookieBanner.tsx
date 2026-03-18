import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleClose = () => {
    // Si solo lo cierra sin aceptar, podríamos volver a mostrarlo en la siguiente sesión,
    // o guardarlo como "dismissed". Por ahora lo guardamos como "dismissed" para no molestar,
    // pero la política dice que al hacer clic en "Aceptar" consiente.
    localStorage.setItem('cookieConsent', 'dismissed');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5D9C5] shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-50 p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-[#5D4037] flex-1 pr-4">
          <p>
            Utilizamos cookies técnicas (estrictamente necesarias) y cookies de estadísticas para analizar el tráfico y mejorar tu experiencia en nuestra web. Al hacer clic en «Aceptar», consientes el uso de las cookies de estadísticas. Puedes obtener más información en nuestra{' '}
            <Link to="/politica-cookies" className="text-[#B89F82] hover:underline font-semibold">
              Política de Cookies
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={handleAccept}
            className="bg-[#3E2A24] text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#5D4037] transition-colors whitespace-nowrap w-full md:w-auto"
          >
            Aceptar
          </button>
          <button
            onClick={handleClose}
            className="text-[#967A70] hover:text-[#3E2A24] p-2 hidden md:block"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
