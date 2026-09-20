'use client';

import React, { useState, useEffect } from 'react';
import { useStoreSettings, StoreSettings } from '@/lib/context/store-settings-context';
import {
  Settings,
  ShoppingBag,
  Store,
  Phone,
  MapPin,
  Share2,
  Truck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  MessageCircle,
  Eye,
  Sliders,
  Palette,
  Tag,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetSettings } = useStoreSettings();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [activeTab, setActiveTab] = useState<'ordering' | 'identity' | 'contact' | 'location' | 'social' | 'delivery'>('ordering');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize form if settings load asynchronously
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Pre-configured collection accent palette
  const presetAccents = [
    { name: 'Clay (Default)', hex: '#B5532F' },
    { name: 'Muted Olive', hex: '#5B6356' },
    { name: 'Smoked Cobalt', hex: '#414C5E' },
    { name: 'Terracotta Earth', hex: '#A65B47' },
    { name: 'Obsidian Noir', hex: '#18191E' },
    { name: 'Ghana Gold', hex: '#C5A880' },
  ];

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSavedSuccess(false);

    const ok = await updateSettings(formData);
    setSaving(false);

    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } else {
      setErrorMsg('Failed to persist store settings. Please try again.');
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all store settings to default Ghanaian values?')) {
      await resetSettings();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full font-sans text-neutral-900">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono font-semibold block mb-1">
            STUDIO CONFIGURATION // TEMA, GHANA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.15em] text-neutral-900 font-sans">
            Store Settings &amp; Controls
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Toggle frontend ordering capabilities, customize WhatsApp numbers, edit location, and manage brand identity.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto font-mono text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 uppercase tracking-wider font-semibold border border-neutral-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black text-white uppercase tracking-widest font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2.5 animate-fade-in font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Store settings and frontend controls updated successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-300 text-xs text-red-900 flex items-center gap-2.5 animate-fade-in font-mono">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('ordering')}
          className={`flex items-center gap-2 px-4 py-2.5 uppercase tracking-spec border transition-all ${
            activeTab === 'ordering'
              ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Ordering &amp; Bag Controls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-4 py-2.5 uppercase tracking-spec border transition-all ${
            activeTab === 'identity'
              ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Brand &amp; Accent Theme</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 uppercase tracking-spec border transition-all ${
            activeTab === 'contact'
              ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>WhatsApp &amp; Phones</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('location')}
          className={`flex items-center gap-2 px-4 py-2.5 uppercase tracking-spec border transition-all ${
            activeTab === 'location'
              ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Location &amp; Hours</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 uppercase tracking-spec border transition-all ${
            activeTab === 'social'
              ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2.5 uppercase tracking-spec border transition-all ${
            activeTab === 'delivery'
              ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Delivery &amp; MoMo</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* TAB 1: ORDERING & SHOWCASE CONTROLS */}
        {activeTab === 'ordering' && (
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-neutral-900" />
                <span>Commerce, Pricing &amp; Bag Switches</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Control WhatsApp ordering, shopping bag visibility, and whether product prices appear across the storefront.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Orders Toggle */}
              <div className="p-5 border border-neutral-200 bg-neutral-50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold text-neutral-900">
                      WhatsApp Ordering
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.ordersEnabled}
                        onChange={(e) => setFormData({ ...formData, ordersEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light mt-2.5">
                    {formData.ordersEnabled
                      ? 'ACTIVE. Direct WhatsApp ordering buttons and checkout triggers are active.'
                      : 'PAUSED. Store operates in quiet Showcase / Catalog mode.'}
                  </p>
                </div>
              </div>

              {/* Shopping Bag Toggle */}
              <div className="p-5 border border-neutral-200 bg-neutral-50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold text-neutral-900">
                      Shopping Bag
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.bagEnabled}
                        onChange={(e) => setFormData({ ...formData, bagEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                    </label>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light mt-2.5">
                    {formData.bagEnabled
                      ? 'ACTIVE. Customers can add items to bag and browse the cart drawer.'
                      : 'HIDDEN. Shopping bag icon is hidden from navbar and cards.'}
                  </p>
                </div>
              </div>

              {/* Price Display Toggle */}
              <div className="p-5 border border-neutral-200 bg-neutral-50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold text-neutral-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Display Prices</span>
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showPrices}
                        onChange={(e) => setFormData({ ...formData, showPrices: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                    </label>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light mt-2.5">
                    {formData.showPrices
                      ? 'VISIBLE. Product prices (GH₵) are displayed on all cards, lookbooks, and detail pages.'
                      : 'HIDDEN. Prices are hidden across all pages (shows "Price on Request" for private drops).'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notice Message when disabled */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-semibold">
                Showcase Mode Notice (Displayed when ordering is paused)
              </label>
              <textarea
                rows={3}
                value={formData.orderingDisabledNotice}
                onChange={(e) => setFormData({ ...formData, orderingDisabledNotice: e.target.value })}
                placeholder="Orders are temporarily paused for drop preparation. Showcase browsing active."
                className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
              />
            </div>
          </div>
        )}

        {/* TAB 2: BRAND IDENTITY & ACCENT THEME */}
        {activeTab === 'identity' && (
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-neutral-900" />
                <span>Store Identity &amp; Accent Palette</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Customize your brand name, tagline, and drop accent color.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-semibold">
                  Brand / Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="ST Clothing"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-semibold">
                  Brand Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Made for Tema. Worn everywhere."
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-semibold">
                Studio Manifesto / Overview
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 leading-relaxed"
              />
            </div>

            {/* Accent Theme Swatches */}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 font-semibold">
                Collection Accent Color (Swappable per Drop)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {presetAccents.map((accent) => (
                  <button
                    key={accent.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, accentColor: accent.hex })}
                    className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-mono transition-all ${
                      formData.accentColor.toLowerCase() === accent.hex.toLowerCase()
                        ? 'border-neutral-900 bg-neutral-100 font-bold ring-1 ring-neutral-900'
                        : 'border-neutral-300 bg-white hover:border-neutral-500'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: accent.hex }}
                    />
                    <span>{accent.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom Hex input */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-mono text-neutral-500">Custom Hex:</span>
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  placeholder="#B5532F"
                  className="w-32 bg-neutral-50 border border-neutral-300 px-2.5 py-1.5 text-xs font-mono text-neutral-900 uppercase"
                />
                <div
                  className="w-6 h-6 border border-neutral-300 rounded"
                  style={{ backgroundColor: formData.accentColor }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT & WHATSAPP NUMBERS */}
        {activeTab === 'contact' && (
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-900" />
                <span>Atelier Phone &amp; WhatsApp Configuration</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Update phone numbers and WhatsApp ordering destinations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primary Phone */}
              <div className="space-y-4 p-4 border border-neutral-200 bg-neutral-50">
                <h3 className="font-mono text-xs uppercase font-bold text-neutral-900">
                  Primary Line (WhatsApp &amp; Calls)
                </h3>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1">
                    Phone Display (e.g. 054 491 1015)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryPhoneDisplay}
                    onChange={(e) => setFormData({ ...formData, primaryPhoneDisplay: e.target.value })}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1">
                    WhatsApp International Format (e.g. 233544911015)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryWhatsApp}
                    onChange={(e) => setFormData({ ...formData, primaryWhatsApp: e.target.value })}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Secondary Phone */}
              <div className="space-y-4 p-4 border border-neutral-200 bg-neutral-50">
                <h3 className="font-mono text-xs uppercase font-bold text-neutral-900">
                  Secondary Line (WhatsApp &amp; Calls)
                </h3>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1">
                    Phone Display (e.g. 020 930 0106)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.secondaryPhoneDisplay}
                    onChange={(e) => setFormData({ ...formData, secondaryPhoneDisplay: e.target.value })}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1">
                    WhatsApp International Format (e.g. 233209300106)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.secondaryWhatsApp}
                    onChange={(e) => setFormData({ ...formData, secondaryWhatsApp: e.target.value })}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-semibold">
                Studio Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@stclothinggh.com"
                className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 font-mono"
              />
            </div>
          </div>
        )}

        {/* TAB 4: LOCATION & HOURS */}
        {activeTab === 'location' && (
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-900" />
                <span>Location, Address &amp; Studio Hours</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Configure your atelier address in Tema and operating schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Tema"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  Region *
                </label>
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="Greater Accra"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Ghana"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-semibold">
                Full Physical Address *
              </label>
              <input
                type="text"
                required
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                placeholder="Tema, Greater Accra Region, Ghana"
                className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  Weekday Hours (Mon – Sat)
                </label>
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                  placeholder="Monday – Saturday: 9:00 AM – 7:00 PM GMT"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  Sunday Hours
                </label>
                <input
                  type="text"
                  value={formData.businessHoursSunday}
                  onChange={(e) => setFormData({ ...formData, businessHoursSunday: e.target.value })}
                  placeholder="Sunday: Closed / WhatsApp Inquiries Only"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SOCIAL MEDIA */}
        {activeTab === 'social' && (
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-neutral-900" />
                <span>Social Media Channels</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Manage your public social links and Instagram profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                  placeholder="@st_clothing_gh"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/st_clothing_gh"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  TikTok URL
                </label>
                <input
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@st_clothing_gh"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-600 mb-1 font-semibold">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/stclothinggh"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DELIVERY & PAYMENT */}
        {activeTab === 'delivery' && (
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-900" />
                <span>Delivery Zones &amp; Payment Methods</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Customize the delivery notes and payment methods displayed across the website.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-semibold">
                Delivery Zones &amp; Timing
              </label>
              <textarea
                rows={3}
                value={formData.deliveryInfo}
                onChange={(e) => setFormData({ ...formData, deliveryInfo: e.target.value })}
                placeholder="Same-day or next-day delivery in Tema & Greater Accra; 2–3 business days nationwide."
                className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs text-neutral-900 leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 mb-1.5 font-semibold">
                Payment Options in Ghana
              </label>
              <textarea
                rows={2}
                value={formData.paymentMethods}
                onChange={(e) => setFormData({ ...formData, paymentMethods: e.target.value })}
                placeholder="Mobile Money (MTN MoMo, Telecel Cash), Pay on Delivery (Greater Accra)"
                className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs text-neutral-900 leading-relaxed font-mono"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 font-mono text-xs">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-neutral-900 hover:bg-black text-white uppercase tracking-widest font-semibold shadow-md transition-colors disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
