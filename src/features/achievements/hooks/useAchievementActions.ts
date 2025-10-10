import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement } from '../types/achievement.types';

export function useAchievementActions() {
  const navigate = useNavigate();

  const handleAchievementAction = useCallback((achievement: Achievement) => {
    if (!achievement.action) return;

    const { url, type, handler } = achievement.action;

    // Custom handler takes priority
    if (handler) {
      handler();
      return;
    }

    // Handle URL navigation
    if (url) {
      if (type === 'external' || url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(url);
      }
    }
  }, [navigate]);

  return {
    handleAchievementAction
  };
}
