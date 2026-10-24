import { useState, useEffect, useCallback } from 'react';
import api from '../config/api.js';

export function useMyOrders() {
  const [orders, setOrders] = useState([]);

  const load = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const res = await api.get('/v1/custom-orders');
      setOrders(res.data.orders || []);
    } catch (_err) {
      // best-effort
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { orders, refetch: load };
}

export async function createOrder(data) {
  const res = await api.post('/v1/custom-orders', data);
  return res.data;
}

export async function quoteOrder(id, data) {
  const res = await api.post(`/v1/custom-orders/${id}/quote`, data);
  return res.data;
}

export async function payOrder(id) {
  const res = await api.post(`/v1/custom-orders/${id}/pay`);
  return res.data;
}

export async function deliverOrder(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post(`/v1/custom-orders/${id}/deliver`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getOrderDownload(id) {
  const res = await api.get(`/v1/custom-orders/${id}/download`);
  return res.data;
}
