import { useState, useEffect } from 'react';
import api from '../config/api.js';

export function useBetaSlots() {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await api.get('/v1/beta/slots');
        if (active) setSlots(res.data.slots || []);
      } catch (_err) {
        if (active) setError('No pudimos cargar las fechas.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return { slots, isLoading, error };
}

export function useBetaSignups() {
  const [signups, setSignups] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await api.get('/v1/admin/beta');
        if (active) {
          setSignups(res.data.signups || []);
          setSlots(res.data.slots || []);
        }
      } catch (_err) {
        if (active) setError('No pudimos cargar los anotados.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return { signups, slots, isLoading, error };
}
