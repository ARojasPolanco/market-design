import { useState, useEffect } from 'react';
import api from '../config/api.js';
import logger from '../utils/logger.js';

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
      logger.error('Error fetching designs:', err);
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

      // Fetch related designs (same category) only if category exists
      if (res.data.design.category) {
        const relatedRes = await api.get(`/v1/designs?category=${res.data.design.category}&limit=4`);
        setRelated(relatedRes.data.designs?.filter(d => d.id !== id) || []);
      }

      // Fetch reviews
      try {
        const reviewsRes = await api.get(`/v1/purchases/ratings/${id}`);
        setReviews(reviewsRes.data.ratings || []);
      } catch {
        // Reviews might not exist yet
        setReviews([]);
      }
    } catch (err) {
      logger.error('Error fetching design:', err);
      setError('No pudimos cargar el diseño. Por favor, intentá de nuevo.');
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
      logger.error('Error fetching trending:', err);
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
      logger.error('Error fetching featured:', err);
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
    fetchSellerDesigns();
  }, [sellerId]);

  const fetchSellerDesigns = async () => {
    try {
      const res = await api.get('/v1/designs/my');
      setDesigns(res.data.designs || []);
    } catch (err) {
      logger.error('Error fetching seller designs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { designs, isLoading, refetch: fetchSellerDesigns };
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
      logger.error('Error fetching purchases:', err);
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
      const res = await api.get('/v1/purchases/my/sales');
      const salesData = res.data.sales || [];
      const statsData = res.data.stats || {};
      setSales(salesData);
      setStats({
        totalEarnings: statsData.totalEarnings || 0,
        totalSales: statsData.totalSales || 0,
        avgRating: 0,
        commissionRate: 20,
        commissionLevel: 'Bronce',
        nextLevel: { rate: 18, salesNeeded: 50 },
      });
    } catch (err) {
      logger.error('Error fetching sales:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { sales, stats, isLoading };
}

export function usePendingDesigns() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await api.get('/v1/admin/designs/pending');
      setDesigns(res.data.designs || []);
    } catch (err) {
      logger.error('Error fetching pending:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return { designs, isLoading, refetch: fetchPending };
}

export function useRejectedDesigns() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRejected();
  }, []);

  const fetchRejected = async () => {
    try {
      const res = await api.get('/v1/designs/my');
      const allDesigns = res.data.designs || [];
      setDesigns(allDesigns.filter((d) => d.status === 'rejected'));
    } catch (err) {
      logger.error('Error fetching rejected:', err);
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
      logger.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading };
}

export function useAdminUsers(filters = {}) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [filters.role, filters.search, filters.page]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.role && filters.role !== 'all') params.set('role', filters.role);
      if (filters.search) params.set('search', filters.search);
      params.set('page', String(filters.page || 1));
      params.set('limit', '10');

      const res = await api.get(`/v1/admin/users?${params.toString()}`);
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      logger.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { users, total, isLoading, refetch: fetchUsers };
}

export function useAdminReports(status = null) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [status]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      const res = await api.get(`/v1/admin/reports?${params.toString()}`);
      setReports(res.data.reports || []);
    } catch (err) {
      logger.error('Error fetching reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { reports, isLoading, refetch: fetchReports };
}

export function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/v1/admin/config');
      const config = res.data.config || {};
      setCategories(config.categories || []);
    } catch (err) {
      logger.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategories = async (newCategories) => {
    try {
      await api.put('/v1/admin/config', { key: 'categories', value: newCategories });
      setCategories(newCategories);
    } catch (err) {
      logger.error('Error updating categories:', err);
    }
  };

  return { categories, isLoading, updateCategories, refetch: fetchCategories };
}
