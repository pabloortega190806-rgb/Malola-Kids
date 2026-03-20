import React from 'react';
import { Link } from 'react-router-dom';

export default function EnviosYDevoluciones() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif font-bold text-[#3E2A24] mb-8 text-center">Envíos y Devoluciones</h1>
      
      <div className="prose prose-stone max-w-none text-[#5D4037]">
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">Política de Envíos</h2>
          <p className="mb-4">
            En Malola nos esforzamos por que recibas tu pedido lo antes posible. Todos nuestros envíos se realizan a través de agencias de transporte de confianza.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>Península:</strong> El coste del envío es de 5,50€.</li>
            <li><strong>Envío Gratuito:</strong> Para pedidos superiores a 80€ en la Península, el envío es totalmente gratuito.</li>
            <li><strong>Recogida en Tienda:</strong> Puedes seleccionar la opción de recogida en tienda de forma gratuita. Te avisaremos cuando tu pedido esté listo.</li>
            <li><strong>Opción "Acumular Pedido":</strong> Si deseas realizar varias compras y que te las enviemos juntas para ahorrar en gastos de envío, selecciona esta opción al finalizar tu compra.</li>
          </ul>
          <p>
            Los plazos de entrega habituales son de 24 a 72 horas laborables desde que el pedido sale de nuestras instalaciones.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">Política de Devoluciones</h2>
          <p className="mb-4">
            Si no estás completamente satisfecho con tu compra, tienes un plazo de <strong>15 días naturales</strong> desde la recepción del pedido para realizar una devolución.
          </p>
          <h3 className="text-xl font-semibold text-[#3E2A24] mt-6 mb-3">Condiciones para la devolución:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Las prendas deben estar en perfecto estado, sin usar, sin lavar y con todas sus etiquetas originales.</li>
            <li>No se admiten devoluciones de ropa interior, baño o complementos por motivos de higiene.</li>
            <li>Los gastos de envío de la devolución corren a cargo del cliente, salvo en caso de tara o defecto de fábrica.</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-[#3E2A24] mt-6 mb-3">¿Cómo realizar una devolución?</h3>
          <p className="mb-4">
            Para procesar una devolución, por favor contáctanos a través de nuestro correo electrónico <a href="mailto:info@malolashop.com" className="text-[#B89F82] hover:underline">info@malolashop.com</a> indicando tu número de pedido y los artículos que deseas devolver. Te facilitaremos las instrucciones detalladas para enviar el paquete a través de GLS o la agencia de tu preferencia.
          </p>
        </section>

        <div className="mt-12 text-center">
          <Link to="/" className="inline-block bg-[#B89F82] text-white px-8 py-3 rounded-md hover:bg-[#A38A6D] transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
