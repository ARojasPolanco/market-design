import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <article className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-sm text-gray-500 mb-8">Última actualización: 18/09/2026 20:17 hs</p>

        <p className="text-gray-600 mb-6">
          En Market Design nos comprometemos a proteger la privacidad de nuestros usuarios y a utilizar sus datos personales únicamente para las finalidades relacionadas con el funcionamiento de la plataforma, la prestación de nuestros servicios y el cumplimiento de las obligaciones correspondientes.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Datos que recopilamos</h2>
        <p className="text-gray-600 mb-3">Dependiendo de la utilización de la plataforma, Market Design podrá recopilar:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>nombre y apellido;</li>
          <li>dirección de correo electrónico;</li>
          <li>información necesaria para gestionar la cuenta;</li>
          <li>información relacionada con compras;</li>
          <li>información relacionada con ventas;</li>
          <li>información necesaria para la facturación;</li>
          <li>información relacionada con Mercado Pago cuando resulte necesaria para la integración del servicio.</li>
        </ul>
        <p className="text-gray-600 mb-6">Market Design no solicita información personal que no resulte necesaria para las finalidades declaradas, salvo que sea requerida para cumplir una obligación legal o prestar determinado servicio.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Finalidad de los datos</h2>
        <p className="text-gray-600 mb-3">Los datos podrán utilizarse para:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
          <li>crear y administrar la cuenta;</li>
          <li>identificar al usuario;</li>
          <li>procesar compras;</li>
          <li>procesar ventas;</li>
          <li>gestionar facturación;</li>
          <li>enviar archivos adquiridos;</li>
          <li>enviar confirmaciones de operaciones;</li>
          <li>enviar comunicaciones relacionadas con la cuenta;</li>
          <li>informar cambios de nivel a vendedores;</li>
          <li>gestionar reclamos y solicitudes de soporte;</li>
          <li>gestionar denuncias;</li>
          <li>prevenir usos indebidos de la plataforma;</li>
          <li>cumplir obligaciones legales.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Correo electrónico</h2>
        <p className="text-gray-600 mb-3">El correo electrónico podrá utilizarse para comunicaciones necesarias relacionadas con el funcionamiento de Market Design.</p>
        <p className="text-gray-600 mb-3">Entre ellas:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
          <li>confirmación de cuenta;</li>
          <li>confirmación de compra;</li>
          <li>envío o disponibilidad de archivos;</li>
          <li>comunicaciones de soporte;</li>
          <li>notificaciones relacionadas con ventas;</li>
          <li>notificaciones relacionadas con cambios de nivel;</li>
          <li>comunicaciones importantes sobre la cuenta o el servicio.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Pagos</h2>
        <p className="text-gray-600 mb-3">Los pagos se procesan mediante Mercado Pago.</p>
        <p className="text-gray-600 mb-3">Market Design no pretende almacenar directamente datos completos de tarjetas de crédito o débito cuando el procesamiento sea realizado por el proveedor de pagos.</p>
        <p className="text-gray-600 mb-6">El tratamiento de la información relacionada con los medios de pago estará sujeto también a las políticas y condiciones del proveedor correspondiente.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Información de los vendedores</h2>
        <p className="text-gray-600 mb-3">Los vendedores podrán proporcionar información adicional necesaria para vincular su cuenta con Mercado Pago y recibir los fondos correspondientes a sus ventas.</p>
        <p className="text-gray-600 mb-6">Dicha información será utilizada para permitir el funcionamiento de la integración de pagos y las operaciones correspondientes.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Conservación de la información</h2>
        <p className="text-gray-600 mb-3">Market Design podrá conservar información asociada a las cuentas, compras, ventas, diseños y operaciones durante el período necesario para:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>prestar los servicios;</li>
          <li>mantener registros de operaciones;</li>
          <li>gestionar reclamos;</li>
          <li>resolver disputas;</li>
          <li>cumplir obligaciones legales;</li>
          <li>prevenir fraudes o abusos;</li>
          <li>proteger los derechos de Market Design y sus usuarios.</li>
        </ul>
        <p className="text-gray-600 mb-6">La desactivación de una cuenta no implica necesariamente la eliminación inmediata de toda la información.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Diseños y contenido publicado</h2>
        <p className="text-gray-600 mb-3">Los vendedores comprenden que los diseños publicados en Market Design deberán estar disponibles para su visualización y comercialización dentro de la plataforma.</p>
        <p className="text-gray-600 mb-6">Market Design podrá almacenar, reproducir y mostrar dichos contenidos en la medida necesaria para prestar el servicio.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Seguridad</h2>
        <p className="text-gray-600 mb-3">Market Design implementará medidas razonables destinadas a proteger la información de los usuarios frente a accesos, modificaciones, divulgaciones o usos no autorizados.</p>
        <p className="text-gray-600 mb-6">No obstante, ningún sistema informático puede garantizar una seguridad absoluta.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Compartición de información</h2>
        <p className="text-gray-600 mb-3">Market Design podrá compartir información cuando sea necesario para:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>procesar pagos;</li>
          <li>prestar servicios tecnológicos;</li>
          <li>cumplir obligaciones legales;</li>
          <li>responder requerimientos de autoridades competentes;</li>
          <li>investigar denuncias;</li>
          <li>prevenir fraudes;</li>
          <li>proteger los derechos de Market Design, sus usuarios o terceros.</li>
        </ul>
        <p className="text-gray-600 mb-6">Market Design no comercializa los datos personales de sus usuarios como una actividad independiente del servicio.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Derechos de los usuarios</h2>
        <p className="text-gray-600 mb-3">Los usuarios podrán solicitar información respecto del tratamiento de sus datos personales y, cuando corresponda, solicitar su actualización, rectificación o eliminación, de acuerdo con la legislación aplicable.</p>
        <p className="text-gray-600 mb-6">Las solicitudes podrán realizances mediante correo electrónico a: advbrrop23@gmail.com</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. Cookies y tecnologías similares</h2>
        <p className="text-gray-600 mb-3">Market Design podrá utilizar cookies u otras tecnologías similares necesarias para:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>mantener sesiones;</li>
          <li>recordar determinadas preferencias;</li>
          <li>garantizar el funcionamiento de la plataforma;</li>
          <li>obtener información estadística;</li>
          <li>mejorar la experiencia de usuario.</li>
        </ul>
        <p className="text-gray-600 mb-6">Las cookies podrán estar sujetas a configuración por parte del usuario dependiendo del navegador utilizado.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Menores de edad</h2>
        <p className="text-gray-600 mb-3">Market Design está destinado exclusivamente a personas de 18 años o más.</p>
        <p className="text-gray-600 mb-6">No se permite crear cuentas ni utilizar los servicios de Market Design cuando el usuario no cumpla con la edad mínima establecida.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">13. Cambios en la Política de Privacidad</h2>
        <p className="text-gray-600 mb-3">Market Design podrá actualizar esta Política de Privacidad cuando sea necesario debido a cambios en el servicio, tecnología, legislación o prácticas de tratamiento de información.</p>
        <p className="text-gray-600 mb-6">La versión vigente será publicada en esta sección.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">14. Contacto</h2>
        <p className="text-gray-600 mb-3">Para consultas relacionadas con privacidad y datos personales:</p>
        <div className="bg-gray-50 rounded-lg p-4 text-gray-600 space-y-1">
          <p><strong>Market Design</strong></p>
          <p>Correo: advbrrop23@gmail.com</p>
          <p>Responsable: Rojas Polanco Alan</p>
        </div>
      </article>
    </div>
  );
}
