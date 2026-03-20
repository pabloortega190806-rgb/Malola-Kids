import React from 'react';
import { Link } from 'react-router-dom';

export default function GuiaDeTallas() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif font-bold text-[#3E2A24] mb-8 text-center">Guía de Tallas</h1>
      
      <div className="prose prose-stone max-w-none text-[#5D4037]">
        <p className="mb-8 text-center text-lg">
          Encuentra la talla perfecta para los más pequeños. Las medidas son orientativas y pueden variar ligeramente según la marca o el modelo.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-6">Bebé (0 a 36 meses)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-[#E5D9C5] rounded-lg shadow-sm">
              <thead className="bg-[#F5F0EB]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-[#3E2A24] border-b border-[#E5D9C5]">Talla / Edad</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#3E2A24] border-b border-[#E5D9C5]">Estatura (cm)</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#3E2A24] border-b border-[#E5D9C5]">Peso aprox. (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D9C5]">
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">Recién Nacido (0 meses)</td>
                  <td className="py-3 px-4">Hasta 50 cm</td>
                  <td className="py-3 px-4">3 - 4 kg</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">1 Mes</td>
                  <td className="py-3 px-4">54 cm</td>
                  <td className="py-3 px-4">4 - 5 kg</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">3 Meses</td>
                  <td className="py-3 px-4">60 cm</td>
                  <td className="py-3 px-4">5 - 6.5 kg</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">6 Meses</td>
                  <td className="py-3 px-4">67 cm</td>
                  <td className="py-3 px-4">6.5 - 8 kg</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">9 Meses</td>
                  <td className="py-3 px-4">71 cm</td>
                  <td className="py-3 px-4">8 - 9.5 kg</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">12 Meses</td>
                  <td className="py-3 px-4">74 cm</td>
                  <td className="py-3 px-4">9.5 - 11 kg</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">18 Meses</td>
                  <td className="py-3 px-4">81 cm</td>
                  <td className="py-3 px-4">11 - 12.5 kg</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">24 Meses (2 Años)</td>
                  <td className="py-3 px-4">86 cm</td>
                  <td className="py-3 px-4">12.5 - 14 kg</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">36 Meses (3 Años)</td>
                  <td className="py-3 px-4">95 cm</td>
                  <td className="py-3 px-4">14 - 16 kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-6">Infantil (4 a 16 años)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-[#E5D9C5] rounded-lg shadow-sm">
              <thead className="bg-[#F5F0EB]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-[#3E2A24] border-b border-[#E5D9C5]">Talla / Edad</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#3E2A24] border-b border-[#E5D9C5]">Estatura (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D9C5]">
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">4 Años</td>
                  <td className="py-3 px-4">104 cm</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">5 Años</td>
                  <td className="py-3 px-4">110 cm</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">6 Años</td>
                  <td className="py-3 px-4">116 cm</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">8 Años</td>
                  <td className="py-3 px-4">128 cm</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">10 Años</td>
                  <td className="py-3 px-4">140 cm</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">12 Años</td>
                  <td className="py-3 px-4">152 cm</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">14 Años</td>
                  <td className="py-3 px-4">164 cm</td>
                </tr>
                <tr className="hover:bg-[#FCFBF9]">
                  <td className="py-3 px-4">16 Años</td>
                  <td className="py-3 px-4">170 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="bg-[#F5F0EB] p-6 rounded-lg text-center mt-8">
          <p className="font-medium text-[#3E2A24] mb-2">¿Tienes dudas con alguna talla?</p>
          <p className="text-sm">
            Escríbenos a <a href="mailto:info@malolashop.com" className="text-[#B89F82] hover:underline">info@malolashop.com</a> o contáctanos por WhatsApp y te asesoraremos encantados.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="inline-block bg-[#B89F82] text-white px-8 py-3 rounded-md hover:bg-[#A38A6D] transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
