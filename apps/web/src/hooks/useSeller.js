import { useState, useEffect } from 'react';
import api from '../config/api.js';

export function useSeller(id) {
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchSeller();
  }, [id]);

  const fetchSeller = async () => {
    try {
      const res = await api.get(`/v1/auth/profile/${id}`);
      setSeller(res.data.user);
    } catch (err) {
      console.error('Error fetching seller:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { seller, isLoading, error };
}

export function useTopSellers() {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopSellers();
  }, []);

  const fetchTopSellers = async () => {
    try {
      const res = await api.get('/v1/admin/users?role=seller&limit=4');
      setSellers(res.data.users || []);
    } catch (err) {
      console.error('Error fetching top sellers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { sellers, isLoading };
}

export function useCurrentSeller() {
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSeller();
  }, []);

  const fetchCurrentSeller = async () => {
    try {
      const res = await api.get('/v1/auth/profile');
      setSeller(res.data.user);
    } catch (err) {
      console.error('Error fetching current seller:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { seller, isLoading };
}
