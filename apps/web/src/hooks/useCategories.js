import { useState, useEffect } from 'react';
import api from '../config/api.js';

const DEFAULT_CATEGORIES = [
  'Sublimado',
  'Estampado',
  'Papelería',
  'Infantil',
  'Deportivo',
  'Religioso',
];

export function useCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/v1/admin/config');
      const config = res.data.config || {};
      if (config.categories) {
        setCategories(config.categories);
      }
    } catch (_err) {
      // Expected for non-admin users — use defaults
    }
  };

  const addCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;

    const updated = [...categories, trimmed].sort();
    setCategories(updated);

    // Save to backend
    try {
      await api.put('/v1/admin/config', { key: 'categories', value: updated });
    } catch (err) {
      console.error('Error saving categories:', err);
    }

    return true;
  };

  const updateCategory = async (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    const exists = categories.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase() && c !== oldName
    );
    if (exists) return false;

    const updated = categories.map((c) => (c === oldName ? trimmed : c)).sort();
    setCategories(updated);

    try {
      await api.put('/v1/admin/config', { key: 'categories', value: updated });
    } catch (err) {
      console.error('Error updating categories:', err);
    }

    return true;
  };

  const deleteCategory = async (name) => {
    const updated = categories.filter((c) => c !== name);
    setCategories(updated);

    try {
      await api.put('/v1/admin/config', { key: 'categories', value: updated });
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const categoryExists = (name) => {
    return categories.some((c) => c.toLowerCase() === name.trim().toLowerCase());
  };

  return { categories, addCategory, updateCategory, deleteCategory, categoryExists };
}
