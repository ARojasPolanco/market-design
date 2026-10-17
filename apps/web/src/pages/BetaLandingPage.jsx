import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Users,
  PlayCircle,
  CheckCircle,
  Video,
  ArrowRight,
  Trophy,
  Mail,
  MessageCircle,
  ShieldCheck,
  Rocket,
  Palette,
  CreditCard,
  Download,
} from 'lucide-react';
import api from '../config/api.js';
import logger from '../utils/logger.js';

const VIDEO_URL = 'https://res.cloudinary.com/ir5xkfth/video/upload/v1791308154/IMG_8625.mp4';
const VIDEO_POSTER =
  'https://res.cloudinary.com/ir5xkfth/video/upload/so_0/v1791308154/IMG_8625.jpg';

const STEPS = [
  {
    icon: Palette,
    title: '1. Subís tu diseño',
    text: 'Cargás tu estampado, sublimado o papelería en alta calidad. Nosotros generamos la vista previa.',
  },
  {
    icon: ShieldCheck,
    title: '2. Revisamos y publicamos',
    text: 'Verificamos que cumpla los requisitos y queda disponible en el catálogo.',
  },
  {
    icon: CreditCard,
    title: '3. El comprador paga',
    text: 'El pago se procesa por Mercado Pago y el dinero se acredita directo en tu cuenta.',
  },
  {
    icon: Download,
    title: '4. Entrega automática',
    text: 'El comprador recibe el archivo por email al instante. Vos no hacés nada más.',
  },
];

const BENEFITS = [
  { icon: Trophy, title: 'Badge Pionero', text: 'Tu perfil lleva el logro exclusivo de fundador.' },
  {
    icon: Rocket,
    title: 'Destacado en el catálogo',
    text: 'Tus diseños aparecen primero cuando lancemos a compradores.',
  },
  {
    icon: Users,
    title: 'Onboarding 1:1',
    text: 'Te acompañamos a subir tu primer diseño y conectar Mercado Pago.',
  },
  {
    icon: CreditCard,
    title: 'Comisión solo por venta',
    text: 'Sin costos fijos ni suscripción. Si no vendés, no pagás.',
  },
];

const FAQ = [
  {
    q: '¿Tiene costo participar?',
    a: 'No. La beta es gratuita y no hay costos fijos ni suscripción. Solo cobramos una comisión cuando vendés.',
  },
  {
    q: '¿Necesito saber de diseño o tener una tienda?',
    a: 'No. Si ya creás diseños (aunque sea de forma casera), te ayudamos con el resto en la reunión.',
  },
  {
    q: '¿Cuándo empiezan las ventas?',
    a: 'Estamos cargando el catálogo con los vendedores fundadores. Una vez listo, salimos a buscar compradores con publicidad.',
  },
  {
    q: '¿Cómo cobro?',
    a: 'Conectás tu cuenta de Mercado Pago y cada venta se acredita directamente ahí.',
  },
];

export default function BetaLandingPage() {
  const formRef = useRef(null);

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    whatsapp: '',
    website: '',
  });
  const [utm, setUtm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
    });
  }, []);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/v1/beta', { ...form, ...utm });
      setSubmitted({ message: res.data.message });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message =
        err.response?.data?.message || 'No pudimos registrar tus datos. Probá de nuevo.';
      setError(message);
      logger.error('Error en beta signup:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-coral-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Sparkles size={15} className="text-brand-teal" /> Beta cerrada · cupos limitados
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              Vendé tus diseños en <span className="text-brand-teal">Market Design</span>
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed mb-8">
              Sumate a los <strong>primeros 10 vendedores</strong> de nuestro marketplace. Subís tus
              diseños, el comprador paga por Mercado Pago y recibe el archivo al instante. Sin
              costos fijos: solo comisión por venta.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 bg-brand-teal text-dark font-bold px-7 py-3.5 rounded-xl hover:bg-brand-teal-dark transition-colors"
              >
                Dejanos tus datos <ArrowRight size={18} />
              </button>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 border border-white/30 px-7 py-3.5 rounded-xl font-medium hover:bg-white/10 transition-colors"
              >
                <PlayCircle size={18} /> Ver cómo funciona
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/30">
              <video
                controls
                poster={VIDEO_POSTER}
                preload="metadata"
                playsInline
                className="w-full aspect-video bg-black"
              >
                <source src={VIDEO_URL} type="video/mp4" />
                Tu navegador no soporta video HTML5.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Qué es */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Qué es Market Design?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Es un marketplace argentino donde diseñadores venden sus diseños digitales de forma
            automática. Vos subís una vez y el catálogo se encarga del resto: el pago se procesa por
            Mercado Pago y la entrega al comprador es instantánea.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Cómo funciona una venta
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-brand-teal" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Beneficios de ser fundador
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-brand-teal flex items-center justify-center mx-auto mb-4">
                <benefit.icon size={26} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reunión + formulario */}
      <section ref={formRef} className="bg-dark text-white py-16 scroll-mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-5">
              <Video size={15} className="text-brand-teal" /> Reunión por Google Meet · 40 min
            </span>
            <h2 className="text-3xl font-bold mb-4">Te mostramos todo, en vivo</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              En la reunión te explicamos cómo funciona la plataforma de punta a punta y{' '}
              <strong className="text-white">subís tu primer diseño con nosotros</strong>. Sin
              compromiso y sin conocimientos técnicos.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Qué traer: 1 o 2 diseños listos para subir',
                'Tu cuenta de Mercado Pago (para conectarla)',
                'Ganas de dejar tu primer diseño publicado',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-200">
                  <CheckCircle size={18} className="text-brand-teal shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Mail size={16} className="text-brand-teal" />
              ¿Dudas? Escribinos a{' '}
              <a
                href="mailto:soporte@marketdesign.shop"
                className="text-brand-teal hover:underline"
              >
                soporte@marketdesign.shop
              </a>
            </div>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">¡Recibimos tus datos!</h3>
                <p className="text-gray-600 mb-4">{submitted.message}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Te vamos a contactar para coordinar una reunión y mostrarte cómo funciona Market
                  Design.
                </p>
                <button
                  onClick={() => setSubmitted(null)}
                  className="text-sm text-brand-teal hover:underline"
                >
                  Volver
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Dejanos tus datos</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Completá tus datos y te contactamos para mostrarte cómo funciona y sumarte a la
                  beta.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="hidden" aria-hidden="true">
                    <label>No completar este campo</label>
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => updateField('website', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre y apellido
                    </label>
                    <input
                      type="text"
                      value={form.fullname}
                      onChange={(e) => updateField('fullname', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      placeholder="+54 9 11 ..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-teal text-dark font-bold py-3.5 rounded-xl hover:bg-brand-teal-dark transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Enviando...' : 'Enviar mis datos'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Te contactamos para coordinar. Sin spam.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-brand-teal py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sumate a la beta de vendedores
          </h2>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-white text-dark font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Sparkles size={18} /> Dejanos tus datos
          </button>
          <div className="mt-6 flex items-center justify-center text-white/90 text-sm">
            <a
              href="mailto:soporte@marketdesign.shop"
              className="hover:underline flex items-center gap-1"
            >
              <MessageCircle size={14} /> Contacto
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
