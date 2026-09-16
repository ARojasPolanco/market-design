import { useState, useEffect } from 'react';
import api from '../config/api.js';

export function useDesigns(filters = {}) {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [techniques] = useState([
    { id: 'sublimado', name: 'Sublimado' },
    { id: 'estampado', name: 'Estampado' },
    { id: 'vinilo', name: 'Vinilo textil' },
    { id: 'dtf', name: 'DTF' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchDesigns();
  }, [filters.category, filters.technique, filters.sort, filters.search, filters.priceMin, filters.priceMax]);

  const fetchDesigns = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.technique) params.set('technique', filters.technique);
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.search) params.set('search', filters.search);
      if (filters.priceMin) params.set('priceMin', filters.priceMin);
      if (filters.priceMax) params.set('priceMax', filters.priceMax);
      params.set('page', '1');
      params.set('limit', '50');

      const res = await api.get(`/v1/designs?${params.toString()}`);
      setDesigns(res.data.designs || []);
      setTotal(res.data.total || 0);

      // Extract unique categories from designs
      const uniqueCategories = [...new Set(res.data.designs?.map(d => d.category) || [])];
      setCategories(uniqueCategories.map(c => ({ id: c, name: c.charAt(0).toUpperCase() + c.slice(1), count: 0 })));
    } catch (err) {
      console.error('Error fetching designs:', err);
      setError(err.message);
      // Fallback to empty
      setDesigns([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  return { designs, categories, techniques, isLoading, error, total };
}

export function useDesign(id) {
  const [design, setDesign] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchDesign();
  }, [id]);

  const fetchDesign = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/v1/designs/${id}`);
      setDesign(res.data.design);

      // Fetch related designs (same category)
      const relatedRes = await api.get(`/v1/designs?category=${res.data.design.category}&limit=4`);
      setRelated(relatedRes.data.designs?.filter(d => d.id !== id) || []);

      // Fetch reviews
      const reviewsRes = await api.get(`/v1/purchases/ratings/${id}`);
      setReviews(reviewsRes.data.ratings || []);
    } catch (err) {
      console.error('Error fetching design:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { design, related, reviews, isLoading, error };
}

export function useTrending() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await api.get('/v1/designs/trending?limit=4');
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error('Error fetching trending:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { designs, isLoading };
}

export function useFeatured() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await api.get('/v1/designs/featured?limit=4');
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error('Error fetching featured:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { designs, isLoading };
}

export function useSellerDesigns(sellerId) {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sellerId) fetchSellerDesigns();
  }, [sellerId]);

  const fetchSellerDesigns = async () => {
    try {
      const res = await api.get(`/v1/designs?sellerId=${sellerId}&limit=50`);
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error('Error fetching seller designs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { designs, isLoading };
}

export function usePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await api.get('/v1/purchases/my');
      setPurchases(res.data.purchases || []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { purchases, isLoading };
}

export function useSellerSales() {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSales: 0,
    avgRating: 0,
    commissionRate: 20,
    commissionLevel: 'Bronce',
    nextLevel: { rate: 18, salesNeeded: 50 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get('/v1/purchases/seller');
      setSales(res.data.sales || []);

      // Calculate stats from sales
      const totalEarnings = res.data.sales?.reduce((sum, s) => sum + (s.sellerEarnings || 0), 0) || 0;
      const totalSales = res.data.sales?.length || 0;
      setStats({
        totalEarnings,
        totalSales,
        avgRating: 4.8, // TODO: calculate from reviews
        commissionRate: 20,
        commissionLevel: 'Bronce',
        nextLevel: { rate: 18, salesNeeded: 50 },
      });
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { sales, stats, isLoading };
}

export function usePendingDesigns() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/v1/admin/designs/pending');
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error('Error fetching pending:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { designs, isLoading };
}

export function useRejectedDesigns() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRejected();
  }, []);

  const fetchRejected = async () => {
    try {
      const res = await api.get('/v1/designs?status=rejected&limit=50');
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error('Error fetching rejected:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { designs, isLoading };
}

export function useAdminStats() {
  const defaultStats = {
    pendingCount: 0,
    approvedToday: 0,
    totalUsers: 0,
    totalDesigns: 0,
    totalSales: 0,
    totalCommissions: 0,
  };
  const [stats, setStats] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/v1/admin/stats');
      const data = res.data.stats || {};
      setStats({ ...defaultStats, ...data });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading };
}
