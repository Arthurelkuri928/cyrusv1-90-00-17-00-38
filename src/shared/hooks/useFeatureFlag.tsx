
import { useState, useEffect } from 'react';

interface FeatureFlags {
  newToolsLayout: boolean;
  enhancedSearch: boolean;
  darkModeV2: boolean;
  betaFeatures: boolean;
  zustandMigration: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  newToolsLayout: false,
  enhancedSearch: false,
  darkModeV2: false,
  betaFeatures: false,
  zustandMigration: true, // Enable for gradual migration
};

// In production, this would come from a remote config service
const getRemoteFlags = async (): Promise<Partial<FeatureFlags>> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        zustandMigration: true,
        enhancedSearch: true,
      });
    }, 100);
  });
};

export const useFeatureFlag = (flagName: keyof FeatureFlags): boolean => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlags = async () => {
      try {
        // Try to get from localStorage first (cache)
        const cachedFlags = localStorage.getItem('feature-flags');
        if (cachedFlags) {
          const parsed = JSON.parse(cachedFlags);
          setFlags({ ...DEFAULT_FLAGS, ...parsed });
        }

        // Then fetch remote flags
        const remoteFlags = await getRemoteFlags();
        const updatedFlags = { ...DEFAULT_FLAGS, ...remoteFlags };
        
        setFlags(updatedFlags);
        localStorage.setItem('feature-flags', JSON.stringify(updatedFlags));
      } catch (error) {
        console.warn('Failed to load feature flags:', error);
        // Fall back to cached or default flags
      } finally {
        setLoading(false);
      }
    };

    loadFlags();
  }, []);

  if (loading) {
    return DEFAULT_FLAGS[flagName];
  }

  return flags[flagName];
};

export const useAllFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  
  useEffect(() => {
    const loadFlags = async () => {
      try {
        const remoteFlags = await getRemoteFlags();
        setFlags({ ...DEFAULT_FLAGS, ...remoteFlags });
      } catch (error) {
        console.warn('Failed to load feature flags:', error);
      }
    };

    loadFlags();
  }, []);

  return flags;
};
