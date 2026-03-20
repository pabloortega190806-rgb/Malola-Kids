import React from 'react';
import { Link } from 'react-router-dom';

export default function TerminosYCondiciones() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif font-bold text-[#3E2A24] mb-8 text-center">Términos y Condiciones</h1>
      
      <div className="prose prose-stone max-w-none text-[#5D4037] space-y-8">
        <section>
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">1. Información General</h2>
          <p>
            Las presentes Condiciones Generales de Compra regulan el uso del sitio web malolashop.com (en adelante "el sitio web") del que es titular Malola (en adelante "la empresa"). La utilización por parte del cliente de los servicios de la tienda de internet de Malola presupone, en todo caso, la adhesión a las Condiciones Generales de Compra en la versión publicada por Malola en el momento mismo de la orden de compra. Por ello, es conveniente que el cliente lea estas Condiciones Generales antes de proceder a realizar una compra.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">2. Precios y Productos</h2>
          <p>
            Los precios expuestos en malolashop.com incluyen el Impuesto sobre el Valor Añadido (IVA) que, en su caso, sea procedente aplicar. Las ofertas sobre productos en venta en malolashop.com se mostrarán en el apartado "Ofertas" o se indicará en la ficha del producto y, si no se indica lo contrario, serán válidas mientras se muestren en pantalla.
          </p>
          <p className="mt-4">
            Malola se reserva el derecho de modificar los precios en cualquier momento, pero los productos se facturarán sobre la base de las tarifas en vigor en el momento del registro de los pedidos (a reserva de la disponibilidad que haya del producto).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">3. Proceso de Compra</h2>
          <p>
            Para realizar una compra, el usuario debe añadir los productos deseados al carrito de la compra y seguir los pasos del proceso de pago, proporcionando la información solicitada para el envío y la facturación. El contrato de compraventa se entenderá formalizado en el momento de la confirmación del pago.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">4. Formas de Pago</h2>
          <p>
            Aceptamos las siguientes formas de pago:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Tarjeta de crédito o débito (Visa, MasterCard, etc.) a través de pasarela de pago segura.</li>
            <li>Bizum.</li>
            <li>Transferencia bancaria (el pedido se procesará una vez recibido el importe).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">5. Propiedad Intelectual</h2>
          <p>
            Todos los contenidos del sitio web (textos, gráficos, fotografías, logotipos, iconos, imágenes, así como el diseño gráfico y software) son de la exclusiva propiedad de Malola o de terceros, cuyos derechos al respecto ostenta legítimamente Malola, estando por lo tanto protegidos por la legislación nacional e internacional.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-semibold text-[#3E2A24] mb-4">6. Ley Aplicable y Jurisdicción</h2>
          <p>
            Las presentes condiciones generales se rigen por la legislación española. Para la resolución de cualquier controversia o conflicto que se derive de las presentes condiciones generales serán competentes los Juzgados y Tribunales del domicilio del consumidor.
          </p>
        </section>

        <div className="mt-12 text-center pt-8 border-t border-[#E5D9C5]">
          <Link to="/" className="inline-block bg-[#B89F82] text-white px-8 py-3 rounded-md hover:bg-[#A38A6D] transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
