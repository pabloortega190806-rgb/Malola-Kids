import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#FCFBF9] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-[#3E2A24] mb-4">Contacto</h1>
          <p className="text-lg text-[#5D4037] max-w-2xl mx-auto">
            ¿Tienes alguna duda o necesitas ayuda con tu pedido? Estamos aquí para ayudarte. Rellena el formulario o contáctanos directamente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E5D9C5]">
              <h3 className="text-xl font-serif font-semibold text-[#3E2A24] mb-6">Información de Contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Phone className="h-6 w-6 text-[#B89F82]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#3E2A24]">Teléfono / WhatsApp</p>
                    <p className="text-[#5D4037] mt-1">+34 633 51 39 86</p>
                    <p className="text-xs text-[#8C7A6B] mt-1">Lunes a Viernes: 10:00 - 14:00 y 17:00 - 20:00</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="h-6 w-6 text-[#B89F82]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#3E2A24]">Email</p>
                    <a href="mailto:Malola.alcala@gmail.com" className="text-[#5D4037] mt-1 hover:text-[#B89F82] transition-colors">
                      Malola.alcala@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="h-6 w-6 text-[#B89F82]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#3E2A24]">Tienda Física</p>
                    <p className="text-[#5D4037] mt-1">
                      Calle Moguer 15<br />
                      41500 Alcalá de Guadaíra, Sevilla
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media (Optional, if you want to add it here too) */}
            <div className="bg-[#F5F0EB] p-8 rounded-xl text-center">
              <h3 className="text-lg font-serif font-semibold text-[#3E2A24] mb-4">Síguenos</h3>
              <p className="text-sm text-[#5D4037] mb-6">
                Descubre nuestras últimas novedades y ofertas exclusivas en Instagram.
              </p>
              <a 
                href="https://www.instagram.com/malolamodainfantil/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2 border border-[#B89F82] text-[#B89F82] hover:bg-[#B89F82] hover:text-white rounded-md transition-colors"
              >
                @malolamodainfantil
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-[#E5D9C5]">
              <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-6">Envíanos un mensaje</h2>
              
              {isSubmitted ? (
                <div className="bg-[#E8F5E9] border border-[#A5D6A7] text-[#2E7D32] px-6 py-8 rounded-lg text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#C8E6C9] mb-4">
                    <Send className="h-6 w-6 text-[#2E7D32]" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">¡Mensaje enviado con éxito!</h3>
                  <p>Gracias por contactarnos. Te responderemos lo antes posible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#5D4037] mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-[#E5D9C5] rounded-md focus:ring-[#B89F82] focus:border-[#B89F82] outline-none transition-colors"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#5D4037] mb-1">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-[#E5D9C5] rounded-md focus:ring-[#B89F82] focus:border-[#B89F82] outline-none transition-colors"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[#5D4037] mb-1">
                      Asunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#E5D9C5] rounded-md focus:ring-[#B89F82] focus:border-[#B89F82] outline-none transition-colors bg-white"
                    >
                      <option value="" disabled>Selecciona un asunto</option>
                      <option value="Duda sobre un producto">Duda sobre un producto</option>
                      <option value="Estado de mi pedido">Estado de mi pedido</option>
                      <option value="Devoluciones o cambios">Devoluciones o cambios</option>
                      <option value="Problema técnico">Problema técnico en la web</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#5D4037] mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#E5D9C5] rounded-md focus:ring-[#B89F82] focus:border-[#B89F82] outline-none transition-colors resize-y"
                      placeholder="¿En qué podemos ayudarte?"
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-[#B89F82] focus:ring-[#B89F82] border-[#E5D9C5] rounded"
                    />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-[#5D4037]">
                      He leído y acepto la <Link to="/terminos-y-condiciones" className="text-[#B89F82] hover:underline">política de privacidad</Link>.
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#B89F82] hover:bg-[#A38A6D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B89F82] transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
