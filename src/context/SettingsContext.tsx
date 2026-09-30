import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppSettings {
  brand_title: string;
  tagline: string;
  upi_id: string;
  business_name: string;
  whatsapp_number: string;
  gst_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  order_prefix: string;
  custom_drive_folder_id?: string;
  script_url?: string;
  google_script_url?: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  brand_title: 'Creaftique (Craftique)',
  tagline: 'Artisan Frames & Custom Print Studio',
  upi_id: 'aksharstudio-3@okisbii',
  business_name: 'Craftique',
  whatsapp_number: '916354871446',
  gst_rate: 18,
  shipping_fee: 80,
  free_shipping_threshold: 1500,
  order_prefix: 'CRQ',
  custom_drive_folder_id: '1sX5j-E5gN6l49d5h9fGzE6f6004u5g2e',
  script_url: 'https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec',
  google_script_url: 'https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec'
};


interface SettingsContextType {
  settings: AppSettings;
  refreshSettings: () => Promise<void>;
  updateSettingsCache: (newSettings: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  refreshSettings: async () => {},
  updateSettingsCache: () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const cached = localStorage.getItem('craftique_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse cached settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const merged = { ...DEFAULT_SETTINGS, ...data.data };
          setSettings(merged);
          try {
            localStorage.setItem('craftique_settings', JSON.stringify(merged));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('Could not fetch settings from API, using cached/defaults:', e);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleSettingsUpdated = () => {
      try {
        const cached = localStorage.getItem('craftique_settings');
        if (cached) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(cached) });
        }
      } catch (e) {}
    };

    window.addEventListener('craftique_settings_updated', handleSettingsUpdated);
    window.addEventListener('storage', handleSettingsUpdated);

    return () => {
      window.removeEventListener('craftique_settings_updated', handleSettingsUpdated);
      window.removeEventListener('storage', handleSettingsUpdated);
    };
  }, []);

  const updateSettingsCache = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('craftique_settings', JSON.stringify(updated));
        window.dispatchEvent(new Event('craftique_settings_updated'));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        refreshSettings: fetchSettings,
        updateSettingsCache
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
