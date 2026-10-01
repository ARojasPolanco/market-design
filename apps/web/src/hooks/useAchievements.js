import { useState, useEffect } from 'react';
import api from '../config/api.js';
import logger from '../utils/logger.js';

export function useUserAchievements(userId) {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;

    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/v1/achievements/user/${userId}`);
        if (active) setAchievements(res.data.achievements || []);
      } catch (err) {
        logger.error('Error fetching achievements:', err);
        if (active) setAchievements([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchAchievements();
    return () => {
      active = false;
    };
  }, [userId]);

  return { achievements, isLoading };
}
