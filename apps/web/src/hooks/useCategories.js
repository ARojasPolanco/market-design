import { useState } from 'react';

const CATEGORIES_KEY = 'marketplace_categories';

const DEFAULT_CATEGORIES = [
  'Sublimado',
  'Estampado',
  'Papelería',
  'Infantil',
  'Deportivo',
  'Religioso',
];

function getStoredCategories() {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults, removing duplicates
      const merged = [...new Set([...DEFAULT_CATEGORIES, ...parsed])];
      return merged.sort();
    }
  } catch {
    // ignore
  }
  return [...DEFAULT_CATEGORIES].sort();
}

function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function useCategories() {
  const [categories, setCategories] = useState(getStoredCategories);

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    // Check if already exists (case insensitive)
    const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;

    const updated = [...categories, trimmed].sort();
    setCategories(updated);
    saveCategories(updated);
    return true;
  };

  const categoryExists = (name) => {
    return categories.some((c) => c.toLowerCase() === name.trim().toLowerCase());
  };

  return { categories, addCategory, categoryExists };
}
