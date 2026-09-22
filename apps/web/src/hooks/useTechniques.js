import { useState, useEffect } from 'react';
import api from '../config/api.js';
import logger from '../utils/logger.js';

const DEFAULT_TECHNIQUES = [
  'Sublimado',
  'Estampado',
  'Vinilo textil',
  'DTF',
  'Impresión 3D',
  'Serigrafía',
  'Bordado',
];

export function useTechniques() {
  const [techniques, setTechniques] = useState(DEFAULT_TECHNIQUES);

  useEffect(() => {
    fetchTechniques();
  }, []);

  const fetchTechniques = async () => {
    try {
      const res = await api.get('/v1/admin/techniques');
      if (res.data.techniques && res.data.techniques.length > 0) {
        setTechniques(res.data.techniques);
      }
    } catch (err) {
      // Use defaults if endpoint fails
      logger.error('Error fetching techniques:', err);
    }
  };

  const addTechnique = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const exists = techniques.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;

    const updated = [...techniques, trimmed].sort();
    setTechniques(updated);

    try {
      await api.put('/v1/admin/config', { key: 'techniques', value: updated });
    } catch (err) {
      logger.error('Error saving techniques:', err);
    }

    return true;
  };

  const updateTechnique = async (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    const exists = techniques.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase() && t !== oldName
    );
    if (exists) return false;

    const updated = techniques.map((t) => (t === oldName ? trimmed : t)).sort();
    setTechniques(updated);

    try {
      await api.put('/v1/admin/config', { key: 'techniques', value: updated });
    } catch (err) {
      logger.error('Error updating techniques:', err);
    }

    return true;
  };

  const deleteTechnique = async (name) => {
    const updated = techniques.filter((t) => t !== name);
    setTechniques(updated);

    try {
      await api.put('/v1/admin/config', { key: 'techniques', value: updated });
    } catch (err) {
      logger.error('Error deleting technique:', err);
    }
  };

  const techniqueExists = (name) => {
    return techniques.some((t) => t.toLowerCase() === name.trim().toLowerCase());
  };

  return { techniques, addTechnique, updateTechnique, deleteTechnique, techniqueExists };
}
