import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white py-24 w-full px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Política de Privacidad</h1>
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">Última actualización: {new Date().toLocaleDateString()}</p>
          
          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Introducción</h3>
          <p>En Tradición Panamá, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política describe cómo recopilamos, usamos y compartimos su información cuando utiliza nuestros servicios de alquiler y reserva.</p>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Información que Recopilamos</h3>
          <p>Podemos recopilar la siguiente información:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Información de contacto: Nombre, dirección de correo electrónico y número de teléfono.</li>
            <li>Detalles de la reserva: Fechas del evento, medidas para el ajuste de las polleras y preferencias de servicio.</li>
            <li>Información de pago: Procesada de forma segura a través de nuestros proveedores bancarios (no almacenamos datos completos de tarjetas de crédito).</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Uso de la Información</h3>
          <p>Utilizamos sus datos para:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Procesar sus reservas de alquiler y servicios de atavío.</li>
            <li>Comunicarnos con usted sobre el estado de su pedido o cambios en el servicio.</li>
            <li>Mejorar nuestro catálogo y ofertas basándonos en las preferencias de los clientes.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Seguridad</h3>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la alteración.</p>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Contacto</h3>
          <p>Si tiene preguntas sobre esta política, contáctenos en info@tradicionpanama.com.</p>
        </div>
      </div>
    </div>
  );
};

export const TermsOfService: React.FC = () => {
  return (
    <div className="bg-white py-24 w-full px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">Al utilizar los servicios de Tradición Panamá, usted acepta los siguientes términos y condiciones referentes al alquiler y uso de nuestra indumentaria folklórica.</p>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Reservas y Pagos</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Para confirmar una reserva, se requiere un abono del 50% del valor total del servicio.</li>
            <li>El saldo restante debe ser cancelado al momento de la entrega o el día del atavío.</li>
            <li>Los precios están sujetos a cambios sin previo aviso, salvo para reservas ya confirmadas con abono.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Uso y Cuidado de la Indumentaria</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>El cliente se compromete a tratar las polleras, joyas y tembleques con el máximo cuidado.</li>
            <li>Está prohibido aplicar perfumes, lacas o maquillaje directamente sobre la tela de la pollera.</li>
            <li>Cualquier daño irreparable, quemadura, mancha permanente o pérdida de piezas (joyas/tembleques) será cobrado al cliente por su valor de reposición.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Cancelaciones y Devoluciones</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Las cancelaciones realizadas con más de 15 días de antelación recibirán un reembolso del 50% del abono.</li>
            <li>Las cancelaciones con menos de 15 días no tienen derecho a reembolso del abono.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Tiempos de Alquiler</h3>
          <p>El alquiler estándar cubre un periodo de 24 horas. Retrasos en la devolución generarán cargos adicionales por día de mora.</p>
        </div>
      </div>
    </div>
  );
};