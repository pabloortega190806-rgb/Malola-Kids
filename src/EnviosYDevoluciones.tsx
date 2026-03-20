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
          <h2 className="text-3xl font-serif font-bold text-[#3E2A24] mb-6">Políticas de Devoluciones y Reembolsos</h2>
          <p className="mb-8">
            En <strong>Malola</strong>, nos esforzamos por garantizar la satisfacción de nuestros clientes y ofrecer una experiencia de compra positiva. A continuación, detallamos nuestras políticas de devoluciones y reembolsos:
          </p>

          <h3 className="text-2xl font-serif font-semibold text-[#3E2A24] mt-8 mb-4">1. Devoluciones por cambio de opinión (Derecho de Desistimiento)</h3>
          
          <ul className="list-disc pl-6 space-y-4 mb-8">
            <li>
              <strong>Plazo:</strong> Dispones de <strong>14 días naturales</strong> para realizar la devolución desde la fecha de recepción del producto.
            </li>
            <li>
              <strong>Condiciones:</strong>
              <ul className="list-[circle] pl-6 mt-2 space-y-2">
                <li>La prenda debe estar en perfecto estado, no haber sido usada, lavada y conservar su etiqueta original y embalaje.</li>
                <li>Por motivos de higiene, no se aceptan devoluciones de ropa interior ni artículos de baño.</li>
              </ul>
            </li>
            <li>
              <strong>Método de Reembolso:</strong>
              <ul className="list-[circle] pl-6 mt-2 space-y-2">
                <li>Las devoluciones se realizarán mediante un <strong>Vale Web</strong> con un código para futuras compras online.</li>
                <li><strong>No se realizan reembolsos en dinero efectivo</strong> bajo ninguna circunstancia.</li>
              </ul>
            </li>
            <li>
              <strong>Gastos de envío:</strong>
              <ul className="list-[circle] pl-6 mt-2 space-y-2">
                <li>Los gastos de envío del retorno corren siempre a cargo del cliente.</li>
              </ul>
            </li>
            <li>
              <strong>Procedimiento:</strong>
              <ul className="list-[circle] pl-6 mt-2 space-y-2">
                <li>
                  Puedes enviarlo por tu cuenta a la siguiente dirección o entregar en horario comercial:<br />
                  <strong>Calle Moguer 15, 41500 Alcalá de Guadaíra, Sevilla</strong>
                </li>
                <li>Por favor, incluye dentro del paquete una copia del pedido o tus datos de contacto (Nombre y Teléfono).</li>
              </ul>
            </li>
            <li>
              <strong>Vale web:</strong>
              <ul className="list-[circle] pl-6 mt-2 space-y-2">
                <li>Una vez recibamos y verifiquemos la prenda, nos pondremos en contacto contigo.</li>
                <li>Se emitirá un código de Vale Web válido por <strong>1 mes y medio</strong> (45 días) para gastar en nuestra web.</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-2xl font-serif font-semibold text-[#3E2A24] mt-10 mb-4">2. Devoluciones por productos defectuosos o tara</h3>
          
          <ul className="list-disc pl-6 space-y-4 mb-8">
            <li>
              <strong>Cobertura:</strong> Si el artículo presenta una tara o defecto de fábrica, nos hacemos cargo de los gastos de envío asociados a la devolución.
            </li>
            <li>
              <strong>Procedimiento:</strong>
              <ul className="list-[circle] pl-6 mt-2 space-y-2">
                <li>
                  Contacta con nosotros a través de nuestro correo electrónico: <strong><a href="mailto:Malola.alcala@gmail.com" className="text-[#B89F82] hover:underline">Malola.alcala@gmail.com</a></strong>, indicando el problema y adjuntando imágenes del defecto.
                </li>
                <li>Recibirás instrucciones específicas para realizar la devolución sin coste para ti.</li>
              </ul>
            </li>
            <li>
              <strong>Vale web:</strong>
              <ul className="list-[circle] pl-6 mt-2 space-y-2">
                <li>Una vez verificado el defecto, emitiremos un <strong>Vale Web</strong> con validez de <strong>1 mes y medio</strong> (45 días), que podrás usar en cualquier nuevo pedido en nuestra tienda.</li>
                <li>No realizamos reembolsos en efectivo.</li>
              </ul>
            </li>
          </ul>

          <div className="bg-[#F5F0EB] p-6 rounded-xl border border-[#E5D9C5] mt-10 mb-8">
            <h3 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">Puntos importantes a tener en cuenta</h3>
            <ul className="list-disc pl-6 space-y-3 text-[#5D4037]">
              <li>No se realizarán reembolsos en dinero bajo ninguna circunstancia. El método de compensación es siempre un Vale Web.</li>
              <li>Todas las devoluciones por cambio de opinión (talla, color, no te gusta) corren con gastos de envío a cargo del cliente.</li>
              <li>Los Vales Web, ya sea por cambio de opinión o por producto defectuoso, tendrán una validez de <strong>1 mes y medio</strong>.</li>
              <li>Traemos novedades frecuentemente, por lo que siempre encontrarás algo que te guste para canjear tu vale.</li>
            </ul>
          </div>

          <p className="mb-6">
            Si tienes alguna duda o necesitas más información, nuestro equipo de atención al cliente estará encantado de ayudarte. Escríbenos a: <strong><a href="mailto:Malola.alcala@gmail.com" className="text-[#B89F82] hover:underline">Malola.alcala@gmail.com</a></strong>
          </p>

          <p className="text-lg font-medium text-[#3E2A24]">
            ❤️ ¡Gracias por tu comprensión y confianza en <strong>Malola</strong>!
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
