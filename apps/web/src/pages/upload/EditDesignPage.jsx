import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Image,
  ArrowLeft,
  X,
  Save,
  Lock,
  Upload,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import api from '../../config/api.js';

const MIN_FILE_SIZE = 1024;
const MAX_PREVIEWS = 3;

export default function EditDesignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [design, setDesign] = useState(null);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);
  const [savingDescription, setSavingDescription] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submittingPreview, setSubmittingPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/v1/designs/${id}`).then((res) => {
      const d = res.data.design;
      setDesign(d);
      setPrice(d.price?.toString() || '');
      setDescription(d.description || '');
      if (d.previewUrls && d.previewUrls.length > 0) {
        setPreviewUrls(d.previewUrls);
      } else if (d.previewUrl) {
        setPreviewUrls([d.previewUrl]);
      }
      setIsLoading(false);
    }).catch(() => {
      showToast('No se pudo cargar el diseño', { type: 'error' });
      navigate('/vendedor/panel');
    });
  }, [id]);

  const handleSavePrice = async () => {
    if (!price || Number(price) <= 0) {
      showToast('El precio debe ser mayor a 0', { type: 'error' });
      return;
    }
    setSavingPrice(true);
    try {
      await api.patch(`/v1/designs/${id}/price`, { price: Number(price) });
      showToast('Precio actualizado', { type: 'success' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al actualizar precio', { type: 'error' });
    } finally {
      setSavingPrice(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!description || description.trim().length < 10) {
      showToast('La descripción debe tener al menos 10 caracteres', { type: 'error' });
      return;
    }
    setSavingDescription(true);
    try {
      await api.patch(`/v1/designs/${id}/description`, { description: description.trim() });
      showToast('Descripción actualizada', { type: 'success' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al actualizar descripción', { type: 'error' });
    } finally {
      setSavingDescription(false);
    }
  };

  const handlePreviewDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size > MIN_FILE_SIZE);
    setPreviewFiles(prev => [...prev, ...validFiles].slice(0, MAX_PREVIEWS));
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url].slice(0, MAX_PREVIEWS));
    });
  }, []);

  const removePreview = (index) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitPreview = async () => {
    if (previewFiles.length === 0) {
      showToast('Seleccioná al menos una imagen de preview', { type: 'error' });
      return;
    }
    setSubmittingPreview(true);
    try {
      const submitData = new FormData();
      previewFiles.forEach((file) => {
        submitData.append('previews', file);
      });

      await api.patch(`/v1/designs/${id}/preview`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Preview enviado a revisión. La versión actual sigue publicada.', { type: 'success' });
      setPreviewFiles([]);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al enviar preview', { type: 'error' });
    } finally {
      setSubmittingPreview(false);
    }
  };

  const handleRequestDelete = async () => {
    if (!confirm('¿Estás seguro? El diseño seguirá visible hasta que un admin apruebe la eliminación.')) return;
    try {
      await api.patch(`/v1/designs/${id}/request-delete`);
      showToast('Solicitud de eliminación enviada', { type: 'success' });
      navigate('/vendedor/panel');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al solicitar eliminación', { type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Diseño no encontrado</h2>
        <Link to="/vendedor/panel" className="text-brand-teal hover:underline">Volver al panel</Link>
      </div>
    );
  }

  const isApproved = design.status === 'approved';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/vendedor/panel"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Volver al panel
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Editar diseño</h1>
      <p className="text-gray-500 mb-8">{design.title}</p>

      <div className="space-y-6">
        {/* Precio - editable sin revisión */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Precio</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
            <button
              onClick={handleSavePrice}
              disabled={savingPrice}
              className="flex items-center gap-2 bg-brand-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {savingPrice ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Se aplica inmediatamente, sin revisión.</p>
        </div>

        {/* Descripción - editable sin revisión */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Descripción</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none mb-3"
          />
          <button
            onClick={handleSaveDescription}
            disabled={savingDescription}
            className="flex items-center gap-2 bg-brand-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {savingDescription ? 'Guardando...' : 'Guardar'}
          </button>
          <p className="text-xs text-gray-500 mt-2">Se aplica inmediatamente, sin revisión.</p>
        </div>

        {/* Preview - requiere revisión */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Imágenes de preview</h2>
          <p className="text-sm text-gray-500 mb-4">
            Reemplazar las previews requiere revisión de administración. La versión actual sigue publicada hasta que se apruebe.
          </p>

          {/* Preview grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {Array.from({ length: MAX_PREVIEWS }).map((_, index) => (
              <div
                key={index}
                className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handlePreviewDrop}
              >
                {previewUrls[index] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrls[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                    <button
                      onClick={() => removePreview(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer text-center p-4">
                    <Image size={24} className="text-gray-400 mx-auto mb-2" />
                    <span className="text-xs text-gray-500">Preview {index + 1}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePreviewDrop}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          {previewFiles.length > 0 && (
            <button
              onClick={handleSubmitPreview}
              disabled={submittingPreview}
              className="flex items-center gap-2 bg-brand-violet text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-violet/90 transition-colors disabled:opacity-50"
            >
              <Upload size={16} />
              {submittingPreview ? 'Enviando...' : 'Enviar a revisión'}
            </button>
          )}
        </div>

        {/* Campos bloqueados */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={18} className="text-gray-400" />
            Campos bloqueados
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Categoría</p>
                <p className="text-xs text-gray-500">{design.category || design.categorySuggested || 'Sin categoría'}</p>
              </div>
              <Lock size={16} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Técnica</p>
                <p className="text-xs text-gray-500">{design.technique}</p>
              </div>
              <Lock size={16} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Archivo original</p>
                <p className="text-xs text-gray-500">{design.originalFileName || 'No disponible'}</p>
              </div>
              <Lock size={16} className="text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Estos campos no se pueden modificar una vez aprobado el diseño.</p>
        </div>

        {/* Solicitar eliminación */}
        {isApproved && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
            <h2 className="font-semibold text-red-700 mb-2">Zona de peligro</h2>
            <p className="text-sm text-gray-600 mb-4">
              Solicitar la eliminación de este diseño. Requiere aprobación de administración.
            </p>
            <button
              onClick={handleRequestDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Solicitar eliminación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}