import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const brands = [
    { name: 'Calamaro', path: '/marca/calamaro' },
    { name: 'Mayoral', path: '/marca/mayoral' },
    { name: 'Prim Baby', path: '/marca/prim baby' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-80 bg-[#FCFBF9] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#3E2A24]">Menú</h2>
            <button 
              onClick={onClose}
              className="text-[#967A70] hover:text-[#5D4037] transition-colors p-2 rounded-full hover:bg-[#F5F0E6]"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#B89F82] mb-4">Categorías</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <Link 
                      to={`/categoria/${encodeURIComponent(category)}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-2 text-[#5D4037] hover:text-[#B89F82] transition-colors group"
                    >
                      <span className="font-medium">{category}</span>
                      <ChevronRight size={16} className="text-[#D9C8B4] group-hover:text-[#B89F82] transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full h-px bg-[#E5D9C5]"></div>

            {/* Brands */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#B89F82] mb-4">Marcas Destacadas</h3>
              <ul className="space-y-2">
                {brands.map((brand) => (
                  <li key={brand.name}>
                    <Link 
                      to={brand.path}
                      onClick={onClose}
                      className="flex items-center justify-between py-2 text-[#5D4037] hover:text-[#B89F82] transition-colors group"
                    >
                      <span className="font-medium">{brand.name}</span>
                      <ChevronRight size={16} className="text-[#D9C8B4] group-hover:text-[#B89F82] transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full h-px bg-[#E5D9C5]"></div>

            {/* Other Links */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link to="/" onClick={onClose} className="block py-2 text-[#7A5C53] hover:text-[#B89F82] transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" onClick={onClose} className="block py-2 text-[#7A5C53] hover:text-[#B89F82] transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link to="/admin" onClick={onClose} className="block py-2 text-[#7A5C53] hover:text-[#B89F82] transition-colors font-medium">
                    Acceso Propietaria
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
