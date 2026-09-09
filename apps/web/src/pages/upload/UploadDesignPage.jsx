import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
  AlertCircle,
  Info,
} from 'lucide-react';
import OnboardingCards, { shouldShowOnboarding } from '../../components/OnboardingCards.jsx';
import DesignPreviewCard from '../../components/DesignPreviewCard.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const CATEGORIES = [
  { id: 'sublimado', name: 'Sublimado' },
  { id: 'estampado', name: 'Estampado' },
  { id: 'papeleria', name: 'Papelería' },
  { id: 'infantil', name: 'Infantil' },
  { id: 'deportivo', name: 'Deportivo' },
  { id: 'religioso', name: 'Religioso' },
];

const TECHNIQUES = [
  { id: 'sublimado', name: 'Sublimado' },
  { id: 'estampado', name: 'Estampado' },
  { id: 'vinilo', name: 'Vinilo textil' },
  { id: 'dtf', name: 'DTF' },
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MIN_FILE_SIZE = 1024; // 1KB

export default function UploadDesignPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding());
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technique: '',
    price: '',
    declaration: false,
  });
  const [designFile, setDesignFile] = useState(null);
  const [designFileError, setDesignFileError] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Step 1: Design file upload
  const handleDesignFileDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;

    setDesignFileError('');

    // Validate size
    if (file.size < MIN_FILE_SIZE) {
      setDesignFileError('El archivo parece estar vacío o corrupto.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setDesignFileError('El archivo excede el tamaño máximo de 50MB.');
      return;
    }

    setDesignFile(file);
  }, []);

  // Step 2: Preview upload
  const handlePreviewDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;

    setPreviewError('');

    if (!file.type.startsWith('image/')) {
      setPreviewError('El preview debe ser una imagen (JPG, PNG, WebP).');
      return;
    }

    setPreviewFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const canProceedStep1 = designFile && !designFileError;
  const canProceedStep2 = previewFile && !previewError;
  const canProceedStep3 =
    formData.title.trim().length >= 3 &&
    formData.description.trim().length >= 10 &&
    formData.category &&
    formData.technique &&
    formData.price > 0;
  const canProceedStep4 = formData.declaration;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    showToast('Diseño enviado a revisión. Te notificaremos por email.', { type: 'success' });
    navigate('/vendedor/panel');
  };

  if (showOnboarding) {
    return <OnboardingCards onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Subir diseño</h1>
      <p className="text-gray-500 mb-8">Completá los pasos para enviar tu diseño a revisión.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { num: 1, label: 'Archivo', icon: Upload },
          { num: 2, label: 'Preview', icon: Image },
          { num: 3, label: 'Información', icon: FileText },
          { num: 4, label: 'Enviar', icon: CheckCircle },
        ].map((step, i) => (
          <div key={step.num} className="flex items-center">
            <button
              onClick={() => {
                if (step.num < currentStep) setCurrentStep(step.num);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === step.num
                  ? 'bg-indigo-600 text-white'
                  : currentStep > step.num
                    ? 'bg-green-100 text-green-700 cursor-pointer'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              <step.icon size={16} />
              {step.label}
            </button>
            {i < 3 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  currentStep > step.num ? 'bg-green-300' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Design file */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                1. Subí el archivo de tu diseño
              </h2>

              {/* Drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDesignFileDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  designFile
                    ? 'border-green-300 bg-green-50'
                    : designFileError
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
              >
                {designFile ? (
                  <div>
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
                    <p className="font-medium text-gray-900">{designFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(designFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={() => setDesignFile(null)}
                      className="text-sm text-red-600 hover:text-red-700 mt-2 flex items-center gap-1 mx-auto"
                    >
                      <X size={14} /> Quitar archivo
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="font-medium text-gray-900 mb-1">
                      Arrastrá tu archivo acá o{' '}
                      <label className="text-indigo-600 cursor-pointer hover:underline">
                        seleccioná uno
                        <input type="file" className="hidden" onChange={handleDesignFileDrop} />
                      </label>
                    </p>
                    <p className="text-sm text-gray-500">PDF, PNG, ZIP, AI, PSD, EPS — Máx. 50MB</p>
                  </>
                )}
              </div>

              {/* Error */}
              {designFileError && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-3">
                  <AlertCircle size={16} />
                  {designFileError}
                </div>
              )}

              {/* Specs */}
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Specs técnicas requeridas:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Resolución mínima: 150 DPI (recomendado 300 DPI)</li>
                      <li>Formatos: PDF, PNG, ZIP, AI, PSD, EPS</li>
                      <li>El archivo debe contener el diseño original en alta calidad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                2. Subí una imagen de preview
              </h2>

              {/* Drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handlePreviewDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  previewFile
                    ? 'border-green-300 bg-green-50'
                    : previewError
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
              >
                {previewFile ? (
                  <div>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg mb-3"
                    />
                    <p className="font-medium text-gray-900">{previewFile.name}</p>
                    <button
                      onClick={() => {
                        setPreviewFile(null);
                        setPreviewUrl('');
                      }}
                      className="text-sm text-red-600 hover:text-red-700 mt-2 flex items-center gap-1 mx-auto"
                    >
                      <X size={14} /> Quitar imagen
                    </button>
                  </div>
                ) : (
                  <>
                    <Image size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="font-medium text-gray-900 mb-1">
                      Arrastrá tu preview acá o{' '}
                      <label className="text-indigo-600 cursor-pointer hover:underline">
                        seleccioná una imagen
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePreviewDrop}
                        />
                      </label>
                    </p>
                    <p className="text-sm text-gray-500">JPG, PNG, WebP — Recomendado 800x800px</p>
                  </>
                )}
              </div>

              {/* Error */}
              {previewError && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-3">
                  <AlertCircle size={16} />
                  {previewError}
                </div>
              )}

              {/* Tips */}
              <div className="bg-yellow-50 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Tips para una buena preview:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Usá una imagen clara y nítida</li>
                      <li>Mostrá el diseño completo, no recortes</li>
                      <li>Evitá marcas de agua personales (el sistema agrega la suya)</li>
                      <li>Fondo blanco o neutro funciona mejor</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Information */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                3. Información del diseño
              </h2>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    placeholder="Ej: Mandala Tribal Geométrico"
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.title.length}/100 caracteres
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    placeholder="Describí qué incluye el archivo, para qué sirve, técnicas recomendadas..."
                    maxLength={1000}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.description.length}/1000 caracteres
                  </p>
                </div>

                {/* Category & Technique */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateForm('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Seleccionar</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Técnica <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.technique}
                      onChange={(e) => updateForm('technique', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Seleccionar</option>
                      {TECHNIQUES.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (ARS) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateForm('price', e.target.value)}
                      placeholder="2000"
                      min="1"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  {formData.price > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Tu ganancia por venta: ${Math.round(formData.price * 0.8).toLocaleString()}{' '}
                      (comisión 20%)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Declaration & Submit */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">4. Revisá y enviá</h2>

              {/* Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Upload size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{designFile?.name}</p>
                    <p className="text-xs text-gray-500">
                      {designFile && (designFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <CheckCircle size={16} className="text-green-500 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Image size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{previewFile?.name}</p>
                  </div>
                  <CheckCircle size={16} className="text-green-500 ml-auto" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Título</p>
                    <p className="text-sm font-medium text-gray-900">{formData.title}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${Number(formData.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Categoría</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {formData.category}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Técnica</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {formData.technique}
                    </p>
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 mb-6">
                <input
                  type="checkbox"
                  checked={formData.declaration}
                  onChange={(e) => updateForm('declaration', e.target.checked)}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  Declaro que este diseño es de mi autoría o tengo los derechos para venderlo.
                  Entiendo que los diseños con copyright de terceros serán rechazados.
                </span>
              </label>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canProceedStep4 || isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Enviar a revisión
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Tu diseño será revisado en 24-48 horas hábiles.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={18} /> Anterior
            </button>
            {currentStep < 4 && (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2) ||
                  (currentStep === 3 && !canProceedStep3)
                }
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Preview card - desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-sm font-medium text-gray-500 mb-3">Vista previa en el catálogo</p>
            <DesignPreviewCard formData={formData} previewImage={previewUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
