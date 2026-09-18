import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <article className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones de Uso</h1>
        <p className="text-sm text-gray-500 mb-8">Última actualización: 18/09/2026 20:17 hs</p>

        <p className="text-gray-600 mb-6">
          Bienvenido/a a Market Design, una plataforma digital destinada a la publicación, comercialización y adquisición de diseños digitales.
        </p>
        <p className="text-gray-600 mb-6">
          El acceso y uso de la plataforma implica la aceptación de los presentes Términos y Condiciones. Si el usuario no está de acuerdo con alguno de estos términos, deberá abstenerse de utilizar la plataforma.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Definiciones</h2>
        <p className="text-gray-600 mb-3">A los efectos de estos Términos:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li><strong>Market Design:</strong> la plataforma, sitio web y servicios relacionados con la comercialización de diseños digitales.</li>
          <li><strong>Usuario:</strong> cualquier persona que acceda o utilice la plataforma.</li>
          <li><strong>Comprador:</strong> usuario que adquiere un diseño digital mediante Market Design.</li>
          <li><strong>Vendedor:</strong> usuario que publica diseños digitales para su comercialización.</li>
          <li><strong>Diseño:</strong> archivo, ilustración, plantilla, gráfico, recurso digital u otro contenido publicado para su comercialización.</li>
          <li><strong>Soporte:</strong> canal oficial de atención de Market Design para consultas, reclamos, denuncias y solicitudes.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Requisitos para utilizar Market Design</h2>
        <p className="text-gray-600 mb-3">Para registrarse y utilizar las funcionalidades de Market Design, el usuario deberá tener 18 años o más.</p>
        <p className="text-gray-600 mb-3">El usuario deberá proporcionar información verdadera, completa y actualizada.</p>
        <p className="text-gray-600 mb-6">Cada cuenta es personal y el usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de toda actividad realizada desde su cuenta.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Registro y confirmación de cuenta</h2>
        <p className="text-gray-600 mb-3">Para utilizar determinadas funcionalidades será necesario registrarse en la plataforma.</p>
        <p className="text-gray-600 mb-3">Market Design podrá solicitar la confirmación de la dirección de correo electrónico mediante un mensaje enviado al correo informado durante el registro.</p>
        <p className="text-gray-600 mb-6">El correo electrónico podrá utilizarse para enviar comunicaciones relacionadas con la cuenta, compras, ventas, modificaciones relevantes del servicio y otras comunicaciones necesarias para el funcionamiento de la plataforma.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Compradores</h2>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4.1. Adquisición de diseños</h3>
        <p className="text-gray-600 mb-3">Los compradores podrán adquirir diseños digitales disponibles en Market Design mediante los medios de pago habilitados por la plataforma.</p>
        <p className="text-gray-600 mb-3">Actualmente, los pagos se procesan mediante Mercado Pago, de acuerdo con las condiciones y mecanismos de seguridad establecidos por dicho proveedor.</p>
        <p className="text-gray-600 mb-6">Market Design no solicita al comprador que realice pagos por fuera de los mecanismos habilitados dentro de la plataforma.</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4.2. Entrega de los diseños</h3>
        <p className="text-gray-600 mb-3">Una vez que el pago haya sido autorizado correctamente, el sistema procesará automáticamente la compra.</p>
        <p className="text-gray-600 mb-3">El archivo adquirido será enviado al correo electrónico asociado a la cuenta del comprador y/o estará disponible mediante los mecanismos de descarga habilitados por Market Design.</p>
        <p className="text-gray-600 mb-6">El comprador deberá verificar que la dirección de correo electrónico proporcionada sea correcta y que pueda recibir mensajes.</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4.3. Derechos adquiridos por el comprador</h3>
        <p className="text-gray-600 mb-3">La adquisición de un diseño otorga al comprador derechos de uso sobre el diseño adquirido, de acuerdo con las condiciones establecidas por Market Design y/o por el autor correspondiente.</p>
        <p className="text-gray-600 mb-3">La compra de un diseño no implica la transferencia de los derechos de autor ni de la titularidad intelectual del diseño al comprador.</p>
        <p className="text-gray-600 mb-6">El comprador tampoco adquiere, por el solo hecho de realizar una compra, autorización para presentarse como autor del diseño.</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4.4. Reventa dentro de Market Design</h3>
        <p className="text-gray-600 mb-3">Los compradores no podrán adquirir un diseño dentro de Market Design y posteriormente crear una cuenta de vendedor con el objetivo de volver a publicar, comercializar o distribuir ese mismo diseño dentro de Market Design como si fuera de su autoría.</p>
        <p className="text-gray-600 mb-3">En caso de detectarse esta conducta, Market Design podrá:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>pausar el diseño;</li>
          <li>retirar el diseño de la plataforma;</li>
          <li>investigar la situación;</li>
          <li>suspender temporal o permanentemente la cuenta involucrada;</li>
          <li>adoptar otras medidas necesarias para proteger los derechos del autor original y el funcionamiento de la plataforma.</li>
        </ul>
        <p className="text-gray-600 mb-3">La presente restricción se refiere específicamente a la reventa o republicación dentro de Market Design.</p>
        <p className="text-gray-600 mb-6">Market Design no controla ni puede determinar las actividades que un comprador realice fuera de la plataforma.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Reembolsos y reclamos</h2>
        <p className="text-gray-600 mb-3">Los compradores que tengan inconvenientes con una compra deberán comunicarse con el Soporte de Market Design mediante los canales oficiales disponibles.</p>
        <p className="text-gray-600 mb-3">Los reembolsos no se gestionan automáticamente desde la plataforma.</p>
        <p className="text-gray-600 mb-3">Cada solicitud será evaluada por el equipo de soporte y/o administración, considerando las circunstancias particulares del caso y la normativa aplicable.</p>
        <p className="text-gray-600 mb-3">Cuando corresponda aprobar un reembolso, Market Design gestionará la devolución mediante el mecanismo disponible para la operación correspondiente.</p>
        <p className="text-gray-600 mb-6">El comprador deberá proporcionar la información necesaria para que el equipo de soporte pueda analizar el reclamo.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Vendedores</h2>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6.1. Registro como vendedor</h3>
        <p className="text-gray-600 mb-3">Para publicar y comercializar diseños, el usuario deberá contar con una cuenta registrada y completar los requisitos establecidos por Market Design.</p>
        <p className="text-gray-600 mb-6">El vendedor deberá vincular su cuenta de Mercado Pago mediante el sistema habilitado dentro de la plataforma.</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6.2. Publicación de diseños</h3>
        <p className="text-gray-600 mb-3">Para publicar un diseño, el vendedor deberá proporcionar la información solicitada por Market Design, que podrá incluir:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>archivo digital;</li>
          <li>imágenes de vista previa;</li>
          <li>título;</li>
          <li>descripción;</li>
          <li>precio;</li>
          <li>información adicional relacionada con el diseño;</li>
          <li>declaración sobre los derechos correspondientes al contenido publicado.</li>
        </ul>
        <p className="text-gray-600 mb-6">Antes de publicar un diseño, el vendedor deberá declarar que posee los derechos, autorizaciones o permisos necesarios para comercializar dicho contenido.</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6.3. Responsabilidad del vendedor sobre sus diseños</h3>
        <p className="text-gray-600 mb-3">El vendedor es responsable por los diseños y contenidos que publique.</p>
        <p className="text-gray-600 mb-3">Al publicar un diseño, el vendedor declara que posee los derechos necesarios para hacerlo y que su publicación no infringe derechos de terceros.</p>
        <p className="text-gray-600 mb-6">Market Design podrá solicitar información o documentación adicional cuando exista una denuncia, reclamo o indicio razonable relacionado con la titularidad o legitimidad de un diseño.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Licencia y derechos sobre los diseños</h2>
        <p className="text-gray-600 mb-3">La publicación de un diseño en Market Design no implica que el vendedor pierda su autoría o titularidad sobre dicho diseño.</p>
        <p className="text-gray-600 mb-3">El vendedor conserva sus derechos sobre el contenido, pero concede a Market Design una licencia para utilizar el diseño en la medida necesaria para:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>alojarlo;</li>
          <li>mostrarlo;</li>
          <li>generar vistas previas;</li>
          <li>promocionarlo dentro de la plataforma;</li>
          <li>permitir su comercialización;</li>
          <li>procesar las operaciones relacionadas con su venta;</li>
          <li>prestar y administrar los servicios de Market Design.</li>
        </ul>
        <p className="text-gray-600 mb-3">La licencia otorgada a Market Design se mantendrá mientras el diseño permanezca incorporado al servicio, sin perjuicio de los derechos y obligaciones derivados de ventas realizadas previamente.</p>
        <p className="text-gray-600 mb-6">La compra por parte de un usuario no transfiere los derechos de autor del diseño al comprador.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Prohibición de publicar diseños de terceros</h2>
        <p className="text-gray-600 mb-3">El vendedor no podrá publicar diseños pertenecientes a otra persona o entidad presentándolos como propios.</p>
        <p className="text-gray-600 mb-3">Queda especialmente prohibido:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>comprar un diseño en Market Design y volver a publicarlo como vendedor;</li>
          <li>descargar un diseño de otro vendedor y subirlo nuevamente;</li>
          <li>modificar mínimamente un diseño ajeno y presentarlo como una creación propia;</li>
          <li>utilizar diseños de terceros sin contar con los derechos o autorizaciones correspondientes;</li>
          <li>declarar falsamente que posee derechos sobre un diseño.</li>
        </ul>
        <p className="text-gray-600 mb-6">Cuando Market Design determine que un vendedor ha infringido estas reglas, podrá suspender permanentemente la cuenta involucrada.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Sistema de denuncias</h2>
        <p className="text-gray-600 mb-3">Market Design podrá disponer de mecanismos para denunciar diseños o cuentas que presuntamente infrinjan derechos de autor, propiedad intelectual, derechos de terceros, reglas de la plataforma o requisitos de calidad.</p>
        <p className="text-gray-600 mb-3">Cuando se reciba una denuncia que requiera investigación, Market Design podrá pausar temporalmente el diseño denunciado.</p>
        <p className="text-gray-600 mb-3">Durante dicha pausa, el diseño podrá dejar de estar visible para los compradores y dejará de estar disponible para nuevas ventas.</p>
        <p className="text-gray-600 mb-3">Una vez analizada la denuncia, Market Design podrá:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>restablecer el diseño;</li>
          <li>mantenerlo pausado;</li>
          <li>eliminarlo;</li>
          <li>solicitar información adicional al vendedor;</li>
          <li>suspender la cuenta correspondiente;</li>
          <li>adoptar otras medidas razonables según la situación.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">9.1. Denuncias por derechos de terceros</h3>
        <p className="text-gray-600 mb-3">Cuando se reciba un reclamo relacionado con derechos de propiedad intelectual pertenecientes a terceros, incluyendo marcas, personajes, obras, ilustraciones u otros contenidos protegidos, Market Design podrá retirar o pausar inmediatamente el contenido denunciado mientras analiza la situación.</p>
        <p className="text-gray-600 mb-6">El vendedor será responsable de contar con las autorizaciones correspondientes para comercializar contenidos de terceros.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Calidad de los diseños</h2>
        <p className="text-gray-600 mb-3">Market Design podrá retirar o pausar diseños que presenten problemas significativos de calidad, información insuficiente, archivos defectuosos, contenido engañoso o características que puedan perjudicar la experiencia de los compradores.</p>
        <p className="text-gray-600 mb-6">La existencia de múltiples denuncias o reclamos relacionados con un mismo diseño podrá ser considerada por Market Design para determinar si corresponde retirarlo.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. Sistema de comisiones para vendedores</h2>
        <p className="text-gray-600 mb-3">Market Design utiliza un sistema de comisiones asociado al volumen de ventas realizado por cada vendedor.</p>
        <p className="text-gray-600 mb-3">Las ventas se contabilizan durante períodos de 90 días.</p>
        <p className="text-gray-600 mb-4">Al finalizar cada período de 90 días, el contador correspondiente se reinicia y el vendedor comienza un nuevo ciclo.</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Niveles de comisión</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Nivel</th>
                <th className="px-4 py-3 font-medium">Ventas durante el período</th>
                <th className="px-4 py-3 font-medium">Comisión</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="px-4 py-2">Bronce</td><td className="px-4 py-2">0 a 50</td><td className="px-4 py-2">20%</td></tr>
              <tr className="border-t"><td className="px-4 py-2">Plata</td><td className="px-4 py-2">Más de 50 y hasta 100</td><td className="px-4 py-2">18%</td></tr>
              <tr className="border-t"><td className="px-4 py-2">Oro</td><td className="px-4 py-2">Más de 100 y hasta 250</td><td className="px-4 py-2">15%</td></tr>
              <tr className="border-t"><td className="px-4 py-2">Platino</td><td className="px-4 py-2">Más de 250</td><td className="px-4 py-2">12%</td></tr>
              <tr className="border-t"><td className="px-4 py-2">Diamante</td><td className="px-4 py-2">Vendedores fundadores</td><td className="px-4 py-2">10%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 mb-6">Los rangos y condiciones podrán ser modificados por Market Design mediante actualización de estos Términos.</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">11.1. Nivel Platino</h3>
        <p className="text-gray-600 mb-3">El nivel Platino podrá ser otorgado por la administración de Market Design a vendedores que superen las condiciones de ventas establecidas.</p>
        <p className="text-gray-600 mb-6">El otorgamiento del nivel Platino corresponde a la administración y no constituye un nivel que se active exclusivamente de forma automática.</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">11.2. Nivel Diamante — Vendedores fundadores</h3>
        <p className="text-gray-600 mb-3">Los primeros diez (10) vendedores registrados en Market Design podrán recibir la condición de vendedor fundador y una comisión del 10% de por vida, conforme a las condiciones establecidas por Market Design.</p>
        <p className="text-gray-600 mb-3">Esta condición será:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>personal;</li>
          <li>exclusiva de la cuenta beneficiaria;</li>
          <li>intransferible;</li>
          <li>no vendible;</li>
          <li>no cedible;</li>
          <li>no intercambiable.</li>
        </ul>
        <p className="text-gray-600 mb-3">El titular de una cuenta Diamante no podrá transferir sus beneficios a otra persona ni compartir la cuenta para permitir que otra persona utilice sus beneficios.</p>
        <p className="text-gray-600 mb-6">Market Design podrá verificar la identidad del titular de la cuenta cuando resulte necesario.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Pagos a vendedores</h2>
        <p className="text-gray-600 mb-3">Las operaciones de venta se procesan mediante el sistema de Mercado Pago integrado a Market Design.</p>
        <p className="text-gray-600 mb-3">Cuando una compra es autorizada correctamente, el sistema podrá distribuir automáticamente los fondos correspondientes entre:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>el vendedor, según corresponda;</li>
          <li>Market Design, en concepto de comisión.</li>
        </ul>
        <p className="text-gray-600 mb-3">El vendedor deberá mantener correctamente vinculada su cuenta de Mercado Pago para poder recibir los fondos correspondientes.</p>
        <p className="text-gray-600 mb-6">Market Design no solicita al vendedor que gestione pagos de las ventas por fuera de los mecanismos habilitados por la plataforma.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">13. Suspensión y baja de cuentas</h2>
        <p className="text-gray-600 mb-3">Market Design podrá suspender temporalmente o desactivar una cuenta cuando considere necesario investigar incumplimientos, denuncias, problemas relacionados con diseños o infracciones de estos Términos.</p>
        <p className="text-gray-600 mb-3">Entre otros supuestos, podrán considerarse:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>publicación de contenido sin autorización;</li>
          <li>infracción de derechos de terceros;</li>
          <li>republicación de diseños de otros vendedores;</li>
          <li>declaraciones falsas sobre la titularidad de diseños;</li>
          <li>múltiples denuncias;</li>
          <li>utilización indebida de la plataforma;</li>
          <li>incumplimiento de estos Términos.</li>
        </ul>
        <p className="text-gray-600 mb-3">Cuando corresponda, el usuario podrá comunicarse con Soporte para solicitar información o revisión de la suspensión.</p>
        <p className="text-gray-600 mb-6">En casos graves, Market Design podrá disponer la suspensión permanente de la cuenta.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">14. Desactivación de cuentas y borrado lógico</h2>
        <p className="text-gray-600 mb-3">La desactivación de una cuenta no implica necesariamente la eliminación física inmediata de toda la información relacionada con ella.</p>
        <p className="text-gray-600 mb-3">Market Design podrá utilizar mecanismos de desactivación o borrado lógico, mediante los cuales determinados registros pasan a estar inactivos y dejan de mostrarse públicamente o de estar disponibles para el usuario.</p>
        <p className="text-gray-600 mb-6">Los diseños y registros relacionados con operaciones anteriores podrán conservarse cuando resulte necesario para mantener el historial de operaciones, cumplir obligaciones legales, resolver reclamos o proteger los derechos de Market Design y sus usuarios.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">15. Soporte</h2>
        <p className="text-gray-600 mb-3">Market Design podrá ofrecer canales de soporte para:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
          <li>consultas;</li>
          <li>problemas con compras;</li>
          <li>solicitudes de reembolso;</li>
          <li>denuncias;</li>
          <li>problemas con diseños;</li>
          <li>problemas con cuentas;</li>
          <li>consultas de vendedores;</li>
          <li>solicitudes relacionadas con suspensiones.</li>
        </ul>
        <p className="text-gray-600 mb-6">Los tiempos de respuesta podrán variar según la naturaleza y complejidad de cada solicitud.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">16. Modificaciones de los Términos</h2>
        <p className="text-gray-600 mb-3">Market Design podrá modificar estos Términos cuando resulte necesario para reflejar cambios en la plataforma, funcionalidades, procesos, legislación o condiciones comerciales.</p>
        <p className="text-gray-600 mb-3">Cuando corresponda, las modificaciones relevantes serán comunicadas mediante los canales disponibles.</p>
        <p className="text-gray-600 mb-6">El uso continuado de la plataforma luego de la entrada en vigencia de las modificaciones implicará la aceptación de los nuevos términos, en la medida permitida por la legislación aplicable.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">17. Contacto</h2>
        <p className="text-gray-600 mb-3">Para consultas, reclamos o solicitudes relacionadas con estos Términos:</p>
        <div className="bg-gray-50 rounded-lg p-4 text-gray-600 space-y-1">
          <p><strong>Market Design</strong></p>
          <p>Correo: advbrrop23@gmail.com</p>
          <p>Responsable: Rojas Polanco Alan</p>
        </div>
      </article>
    </div>
  );
}
