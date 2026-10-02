import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../config/api.js';
import logger from '../utils/logger.js';

export default function PurchaseDownloadPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchDownload = async () => {
      try {
        const res = await api.get(`/v1/purchases/download/${token}`);
        setDownloadUrl(res.data.downloadUrl);
        setFileName(res.data.fileName);
        setStatus('ready');
      } catch (err) {
        logger.error('Error fetching download:', err);
        setError(
          err.response?.data?.message || 'El enlace de descarga no es válido o ya expiró.'
        );
        setStatus('error');
      }
    };
    fetchDownload();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 size={40} className="mx-auto text-brand-teal animate-spin mb-4" />
            <h1 className="text-lg font-semibold text-gray-900 mb-2">Preparando tu descarga...</h1>
            <p className="text-sm text-gray-500">Un momento, estamos verificando tu compra.</p>
          </>
        )}

        {status === 'ready' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">Tu archivo está listo</h1>
            <p className="text-sm text-gray-500 mb-1">Archivo:</p>
            <p className="text-sm font-medium text-gray-900 break-all mb-6">{fileName || 'archivo'}</p>
            <a
              href={downloadUrl}
              className="inline-flex items-center justify-center gap-2 w-full bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors"
            >
              <Download size={18} />
              Descargar archivo
            </a>
            <p className="text-xs text-gray-400 mt-4">
              Este enlace es de un solo uso. Si necesitás descargar de nuevo, podés hacerlo desde tu panel de comprador.
            </p>
            <Link to="/comprador/panel" className="text-sm text-brand-teal hover:underline mt-3 inline-block">
              Ir a Mis compras
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">No pudimos preparar tu descarga</h1>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <Link
              to="/comprador/panel"
              className="inline-flex items-center justify-center gap-2 w-full bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-light transition-colors"
            >
              Ir a Mis compras
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
