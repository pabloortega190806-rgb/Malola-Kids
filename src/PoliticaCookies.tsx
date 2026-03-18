import React from 'react';

export default function PoliticaCookies() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-[#5D4037]">
      <h1 className="text-3xl font-serif font-bold text-[#3E2A24] mb-8 text-center">Política de Cookies - Malola</h1>

      <div className="space-y-8 text-sm leading-relaxed">
        <p className="italic">
          Esta política de cookies se aplica a los ciudadanos y residentes legales del Espacio Económico Europeo y Suiza.
        </p>

        <section>
          <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">1. Introducción</h2>
          <p>
            Nuestra web utiliza cookies y otras tecnologías relacionadas (para mayor comodidad, todas las tecnologías se denominan «cookies»). Las cookies pueden ser colocadas por nosotros o por terceros con los que colaboramos. En este documento te informamos sobre el uso de estas tecnologías en nuestra web.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">2. ¿Qué son las cookies?</h2>
          <p>
            Una cookie es un pequeño archivo que se envía junto con las páginas de esta web y que tu navegador almacena en el disco duro de tu dispositivo. La información almacenada puede ser devuelta a nuestros servidores o a los servidores de terceros apropiados durante una visita posterior para reconocer al usuario o facilitar la navegación.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">3. Cookies utilizadas</h2>
          
          <h3 className="font-semibold text-[#3E2A24] mb-2 mt-4">3.1 Cookies técnicas o funcionales (Siempre activas)</h3>
          <p className="mb-2">
            Estas cookies son estrictamente necesarias para que la web funcione correctamente. Permiten funciones básicas como la navegación por las páginas, el acceso a áreas seguras o que los artículos permanezcan en tu cesta de la compra mientras navegas. Al ser esenciales para el servicio que solicitas, se instalan sin necesidad de consentimiento previo.
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Finalidad:</strong> Gestión del carrito de compra, inicio de sesión y seguridad del sitio.</li>
            <li><strong>Duración:</strong> Mayoritariamente por sesión.</li>
          </ul>

          <h3 className="font-semibold text-[#3E2A24] mb-2 mt-4">3.2 Cookies de estadísticas (Requieren consentimiento)</h3>
          <p className="mb-2">
            Utilizamos cookies de análisis para obtener información anónima sobre cómo los usuarios interactúan con nuestra web (páginas más visitadas, tiempo de permanencia, etc.). Esto nos ayuda a mejorar la experiencia de compra y el diseño de la tienda.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Servicio:</strong> Herramientas de analítica web.</li>
            <li><strong>Finalidad:</strong> Optimización del rendimiento y medición de tráfico.</li>
            <li><strong>Datos:</strong> Los datos se procesan de forma agregada y anónima.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">4. Consentimiento</h2>
          <p>
            Cuando visites nuestra web por primera vez, verás un aviso (banner) explicando el uso de cookies. Al hacer clic en «Aceptar», consientes el uso de las cookies de estadísticas. Puedes configurar o rechazar su uso en cualquier momento a través de los ajustes de tu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">5. Activación, desactivación y borrado de cookies</h2>
          <p className="mb-4">
            Puedes utilizar tu navegador de Internet para eliminar las cookies de forma automática o manual, o para bloquear el rastro de ciertas cookies. Para más información, consulta la sección de «Ayuda» de tu navegador (Chrome, Firefox, Safari, Edge, etc.).
          </p>
          <p className="font-semibold">
            Nota: Si desactivas las cookies técnicas, es posible que la tienda no funcione correctamente y no puedas finalizar tus pedidos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">6. Tus derechos con respecto a los datos personales</h2>
          <p>
            Tienes derecho a acceder, rectificar, limitar o suprimir tus datos personales procesados a través de cookies de análisis. Para ejercer estos derechos o revocar tu consentimiento, puedes contactar con nosotros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-semibold text-[#3E2A24] mb-4">7. Datos de contacto</h2>
          <p className="mb-4">Para cualquier duda sobre nuestra política de cookies, puedes contactar con nosotros en:</p>
          <ul className="space-y-2">
            <li><strong>Responsable:</strong> LUCÍA MORENO SÁNCHEZ</li>
            <li><strong>Dirección:</strong> C/ Moguer 15, 41500, Alcalá de Guadaíra, Sevilla (España)</li>
            <li><strong>Web:</strong> <a href="https://www.instagram.com/somosnewweb/" target="_blank" rel="noopener noreferrer" className="text-[#B89F82] hover:underline">https://www.instagram.com/somosnewweb/</a></li>
            <li><strong>Correo electrónico:</strong> <a href="mailto:malola.alcala@gmail.com" className="text-[#B89F82] hover:underline">malola.alcala@gmail.com</a></li>
          </ul>
          <p className="mt-8 text-xs text-gray-500">Última actualización: Marzo de 2026.</p>
        </section>
      </div>
    </div>
  );
}
