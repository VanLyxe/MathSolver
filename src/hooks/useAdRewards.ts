import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { tokenService } from '../services/tokenService';

const MAX_ADS_PER_DAY = 5;
const AD_REWARDS_KEY = 'ad_rewards';

interface AdRewardsData {
  date: string;
  count: number;
}

export const useAdRewards = () => {
  const [adData, setAdData] = useState<AdRewardsData | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadAdData();
  }, []);

  const loadAdData = () => {
    const storedData = localStorage.getItem(AD_REWARDS_KEY);
    if (storedData) {
      const data: AdRewardsData = JSON.parse(storedData);
      const today = new Date().toISOString().split('T')[0];
      
      if (data.date === today) {
        setAdData(data);
      } else {
        // Réinitialiser pour un nouveau jour
        const newData = { date: today, count: 0 };
        localStorage.setItem(AD_REWARDS_KEY, JSON.stringify(newData));
        setAdData(newData);
      }
    } else {
      // Première utilisation
      const newData = { 
        date: new Date().toISOString().split('T')[0], 
        count: 0 
      };
      localStorage.setItem(AD_REWARDS_KEY, JSON.stringify(newData));
      setAdData(newData);
    }
  };

  const updateAdCount = () => {
    if (!adData) return;
    
    const newData = {
      ...adData,
      count: adData.count + 1
    };
    localStorage.setItem(AD_REWARDS_KEY, JSON.stringify(newData));
    setAdData(newData);
  };

  const watchAd = async () => {
    if (!user) throw new Error('User not authenticated');
    if (!canWatchAd) throw new Error('Daily limit reached');

    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      if (!window.google || !window.google.ima) {
        reject(new Error('AdSense not loaded'));
        return;
      }

      try {
        // Simuler le visionnage d'une pub (à remplacer par l'intégration réelle)
        setTimeout(async () => {
          await tokenService.incrementTokens(user.id);
          updateAdCount();
          resolve();
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  };

  const canWatchAd = adData ? adData.count < MAX_ADS_PER_DAY : false;
  const remainingAdsToday = adData ? MAX_ADS_PER_DAY - adData.count : 0;

  return {
    canWatchAd,
    watchAd,
    remainingAdsToday
  };
};