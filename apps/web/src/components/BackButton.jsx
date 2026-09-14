import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ label = 'Volver', className = '' }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors mb-6 ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
