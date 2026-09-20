'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BRAND_CONFIG } from '@/lib/config/brand';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export interface StoreSettings {
  // Ordering, Pricing & Bag Controls
  ordersEnabled: boolean;
  bagEnabled: boolean;
  showPrices: boolean;
  orderingDisabledNotice: string;

  // General Store Identity
  storeName: string;
  tagline: string;
  description: string;
  accentColor: string;

  // Contact Details
  primaryPhone: string;
  primaryPhoneDisplay: string;
  primaryWhatsApp: string;
  secondaryPhone: string;
  secondaryPhoneDisplay: string;
  secondaryWhatsApp: string;
  email: string;

  // Location & Hours
  city: string;
  region: string;
  country: string;
  fullAddress: string;
  mapQuery: string;
  businessHours: string;
  businessHoursSunday: string;

  // Social Channels
  instagramHandle: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;

  // Delivery & Payment Notes
  currencySymbol: string;
  deliveryInfo: string;
  paymentMethods: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  ordersEnabled: true,
  bagEnabled: true,
  showPrices: true,
  orderingDisabledNotice: 'Online orders are temporarily paused for drop preparation. Showcase browsing active.',

  storeName: BRAND_CONFIG.name,
  tagline: BRAND_CONFIG.tagline,
  description: 'Contemporary minimalist silhouettes engineered in Tema, Ghana. We balance heavyweight organic cottons, tailored drapes, and quiet Ghanaian craftsmanship.',
  accentColor: BRAND_CONFIG.accentColor.hex,

  primaryPhone: BRAND_CONFIG.contacts.primaryPhone,
  primaryPhoneDisplay: BRAND_CONFIG.contacts.primaryPhoneDisplay,
  primaryWhatsApp: '233544911015',
  secondaryPhone: BRAND_CONFIG.contacts.secondaryPhone,
  secondaryPhoneDisplay: BRAND_CONFIG.contacts.secondaryPhoneDisplay,
  secondaryWhatsApp: '233209300106',
  email: BRAND_CONFIG.contacts.email,

  city: BRAND_CONFIG.location.city,
  region: BRAND_CONFIG.location.region,
  country: BRAND_CONFIG.location.country,
  fullAddress: BRAND_CONFIG.location.fullAddress,
  mapQuery: BRAND_CONFIG.location.mapQuery,
  businessHours: BRAND_CONFIG.hours.weekdays,
  businessHoursSunday: BRAND_CONFIG.hours.sunday,

  instagramHandle: BRAND_CONFIG.handle,
  instagramUrl: BRAND_CONFIG.contacts.instagramUrl,
  facebookUrl: 'https://facebook.com/stclothinggh',
  tiktokUrl: 'https://tiktok.com/@st_clothing_gh',

  currencySymbol: BRAND_CONFIG.currency.symbol,
  deliveryInfo: BRAND_CONFIG.delivery.locations,
  paymentMethods: BRAND_CONFIG.delivery.paymentMethods,
};

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'st_clothing_store_settings_v2';

function mapRowToSettings(row: any): Partial<StoreSettings> {
  if (!row) return {};
  const jsonSettings = row.settings && typeof row.settings === 'object' ? row.settings : {};
  const mapped: Partial<StoreSettings> = { ...jsonSettings };

  if (row.orders_enabled !== undefined && row.orders_enabled !== null) mapped.ordersEnabled = row.orders_enabled;
  if (row.bag_enabled !== undefined && row.bag_enabled !== null) mapped.bagEnabled = row.bag_enabled;
  if (row.show_prices !== undefined && row.show_prices !== null) mapped.showPrices = row.show_prices;
  if (row.ordering_disabled_notice) mapped.orderingDisabledNotice = row.ordering_disabled_notice;
  if (row.store_name) mapped.storeName = row.store_name;
  if (row.tagline) mapped.tagline = row.tagline;
  if (row.description) mapped.description = row.description;
  if (row.accent_color) mapped.accentColor = row.accent_color;
  if (row.currency_symbol) mapped.currencySymbol = row.currency_symbol;
  if (row.primary_phone) mapped.primaryPhone = row.primary_phone;
  if (row.primary_phone_display) mapped.primaryPhoneDisplay = row.primary_phone_display;
  if (row.primary_whatsapp) mapped.primaryWhatsApp = row.primary_whatsapp;
  if (row.secondary_phone) mapped.secondaryPhone = row.secondary_phone;
  if (row.secondary_phone_display) mapped.secondaryPhoneDisplay = row.secondary_phone_display;
  if (row.secondary_whatsapp) mapped.secondaryWhatsApp = row.secondary_whatsapp;
  if (row.email) mapped.email = row.email;
  if (row.city) mapped.city = row.city;
  if (row.region) mapped.region = row.region;
  if (row.country) mapped.country = row.country;
  if (row.full_address) mapped.fullAddress = row.full_address;
  if (row.map_query) mapped.mapQuery = row.map_query;
  if (row.business_hours) mapped.businessHours = row.business_hours;
  if (row.business_hours_sunday) mapped.businessHoursSunday = row.business_hours_sunday;
  if (row.instagram_handle) mapped.instagramHandle = row.instagram_handle;
  if (row.instagram_url) mapped.instagramUrl = row.instagram_url;
  if (row.facebook_url) mapped.facebookUrl = row.facebook_url;
  if (row.tiktok_url) mapped.tiktokUrl = row.tiktok_url;
  if (row.delivery_info) mapped.deliveryInfo = row.delivery_info;
  if (row.payment_methods) mapped.paymentMethods = row.payment_methods;

  return mapped;
}

function mapSettingsToRow(settings: StoreSettings) {
  return {
    id: 'default',
    orders_enabled: settings.ordersEnabled,
    bag_enabled: settings.bagEnabled,
    show_prices: settings.showPrices,
    ordering_disabled_notice: settings.orderingDisabledNotice,
    store_name: settings.storeName,
    tagline: settings.tagline,
    description: settings.description,
    accent_color: settings.accentColor,
    currency_symbol: settings.currencySymbol,
    primary_phone: settings.primaryPhone,
    primary_phone_display: settings.primaryPhoneDisplay,
    primary_whatsapp: settings.primaryWhatsApp,
    secondary_phone: settings.secondaryPhone,
    secondary_phone_display: settings.secondaryPhoneDisplay,
    secondary_whatsapp: settings.secondaryWhatsApp,
    email: settings.email,
    city: settings.city,
    region: settings.region,
    country: settings.country,
    full_address: settings.fullAddress,
    map_query: settings.mapQuery,
    business_hours: settings.businessHours,
    business_hours_sunday: settings.businessHoursSunday,
    instagram_handle: settings.instagramHandle,
    instagram_url: settings.instagramUrl,
    facebook_url: settings.facebookUrl,
    tiktok_url: settings.tiktokUrl,
    delivery_info: settings.deliveryInfo,
    payment_methods: settings.paymentMethods,
    settings: settings,
    updated_at: new Date().toISOString(),
  };
}

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Sync settings on mount (localStorage first, then Supabase if configured)
  useEffect(() => {
    async function loadSettings() {
      try {
        if (typeof window !== 'undefined') {
          const localSaved = localStorage.getItem(SETTINGS_STORAGE_KEY);
          if (localSaved) {
            const parsed = JSON.parse(localSaved);
            setSettings((prev) => ({ ...prev, ...parsed }));
          }
        }

        // Fetch from Supabase if active
        if (isSupabaseConfigured()) {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('store_settings')
            .select('*')
            .eq('id', 'default')
            .maybeSingle();

          if (data && !error) {
            const mapped = mapRowToSettings(data);
            setSettings((prev) => {
              const updated = { ...prev, ...mapped };
              if (typeof window !== 'undefined') {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
              }
              return updated;
            });
          }
        }
      } catch (e) {
        console.error('Error loading store settings:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Update CSS accent variable dynamically when accent color changes
  useEffect(() => {
    if (typeof document !== 'undefined' && settings.accentColor) {
      document.documentElement.style.setProperty('--accent', settings.accentColor);
    }
  }, [settings.accentColor]);

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    try {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);

      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      }

      // If Supabase is configured, persist to store_settings table
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const payload = mapSettingsToRow(merged);
        const { error } = await supabase
          .from('store_settings')
          .upsert([payload])
          .select();

        if (error) {
          console.warn('Supabase store_settings sync warning:', error.message);
        }
      }

      return true;
    } catch (e) {
      console.error('Error saving store settings:', e);
      return false;
    }
  };

  const resetSettings = async () => {
    setSettings(DEFAULT_STORE_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_STORE_SETTINGS));
    }
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const payload = mapSettingsToRow(DEFAULT_STORE_SETTINGS);
      await supabase.from('store_settings').upsert([payload]);
    }
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
}
