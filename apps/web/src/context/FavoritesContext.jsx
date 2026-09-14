import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api.js';
import { useAuth } from './AuthContext.jsx';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchFavorites();
    } else {
      // Load from localStorage for non-logged users
      const saved = localStorage.getItem('favorites');
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [token]);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/v1/favorites/my');
      setFavorites(res.data.favorites?.map(f => f.designId) || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const addFavorite = async (designId) => {
    if (!favorites.includes(designId)) {
      setFavorites(prev => [...prev, designId]);

      if (token) {
        try {
          await api.post('/v1/favorites', { designId });
        } catch (err) {
          console.error('Error adding favorite:', err);
          // Revert
          setFavorites(prev => prev.filter(id => id !== designId));
        }
      } else {
        localStorage.setItem('favorites', JSON.stringify([...favorites, designId]));
      }
    }
  };

  const removeFavorite = async (designId) => {
    setFavorites(prev => prev.filter(id => id !== designId));

    if (token) {
      try {
        await api.delete(`/v1/favorites/${designId}`);
      } catch (err) {
        console.error('Error removing favorite:', err);
        // Revert
        setFavorites(prev => [...prev, designId]);
      }
    } else {
      localStorage.setItem('favorites', JSON.stringify(favorites.filter(id => id !== designId)));
    }
  };

  const isFavorite = (designId) => favorites.includes(designId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
