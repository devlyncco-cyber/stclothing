'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageCircle, Instagram, CheckCircle2, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { BRAND_CONFIG } from '@/lib/config/brand';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phoneOrEmail: '', subject: '', message: '' });
  const { settings } = useStoreSettings();

  const primaryWa = settings.primaryWhatsApp || '233544911015';
  const secondaryWa = settings.secondaryWhatsApp || '233209300106';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bone pt-28 pb-24 font-sans select-none gallery-canvas text-ink">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="max-w-3xl mb-16 border-b border-stone-border pb-8">
          <span className="font-mono text-[10px] uppercase tracking-ultra text-stone font-semibold block mb-2">
            ATELIER CONTACT // {(settings.city || 'TEMA').toUpperCase()}, {(settings.country || 'GHANA').toUpperCase()}
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight">
            Contact &amp; Studio Desk
          </h1>
          <p className="text-sm sm:text-base font-sans font-light text-stone-dark mt-3 leading-relaxed">
            Connect directly with our {settings.storeName || 'ST Clothing'} atelier team in {settings.city || 'Tema'} for sizing assistance, custom orders, delivery coordination, or press inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Form & Direct Messaging (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Quick WhatsApp Order Fast Track */}
            <div className="p-6 bg-sand border border-stone-border space-y-4">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-ultra text-clay font-semibold">
                <MessageCircle className="w-4 h-4 text-emerald-700 fill-current" />
                <span>{settings.ordersEnabled ? 'FASTEST WAY TO ORDER OR INQUIRE' : 'DIRECT ATELIER INQUIRIES'}</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-ink">
                {settings.ordersEnabled ? 'Direct WhatsApp Order Concierge' : 'Direct WhatsApp Atelier Concierge'}
              </h3>
              <p className="text-xs sm:text-sm font-sans font-light text-stone-dark leading-relaxed">
                Skip the form and chat directly with our team on WhatsApp for instant confirmation on sizing, fabric stock, and same-day {settings.region || 'Greater Accra'} delivery.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
                <a
                  href={`https://wa.me/${primaryWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-colors"
                >
                  <span>Primary: {settings.primaryPhoneDisplay || '054 491 1015'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${secondaryWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-sand hover:bg-stone-border text-ink border border-stone-border font-semibold transition-colors"
                >
                  <span>Secondary: {settings.secondaryPhoneDisplay || '020 930 0106'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Email / Studio Enquiry Form */}
            <div className="border-t border-stone-border pt-8">
              <h3 className="font-serif text-2xl font-normal text-ink mb-6">
                Send an Atelier Message
              </h3>

              {submitted ? (
                <div className="p-8 bg-sand border border-stone-border text-center space-y-4 animate-fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="font-serif text-xl font-normal text-ink">
                    Message Received
                  </h4>
                  <p className="text-xs font-sans text-stone-dark max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to {settings.storeName || 'ST Clothing'}. An atelier representative will respond promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 font-mono text-xs uppercase tracking-wider text-ink underline underline-offset-4"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-semibold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Kwame Mensah"
                        className="w-full bg-sand border border-stone-border px-3.5 py-3 text-xs text-ink placeholder:text-stone focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-semibold">
                        Phone / WhatsApp / Email *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.phoneOrEmail}
                        onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
                        placeholder="054 000 0000 / kwame@example.com"
                        className="w-full bg-sand border border-stone-border px-3.5 py-3 text-xs text-ink placeholder:text-stone focus:outline-none focus:border-ink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-semibold">
                      Subject / Topic *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Sizing Advice / Custom Order / Delivery Inquiry"
                      className="w-full bg-sand border border-stone-border px-3.5 py-3 text-xs text-ink placeholder:text-stone focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-ultra text-stone mb-1.5 font-semibold">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={`How may our ${settings.city || 'Tema'} atelier assist you?`}
                      className="w-full bg-sand border border-stone-border px-3.5 py-3 text-xs text-ink placeholder:text-stone focus:outline-none focus:border-ink"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-4 bg-ink text-bone text-xs uppercase tracking-ultra font-semibold hover:bg-clay hover:text-white transition-colors"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Studio Coordinates, Map & Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Atelier Contact Card */}
            <div className="bg-sand p-8 border border-stone-border space-y-6 font-mono">
              <h3 className="font-serif text-xl font-normal text-ink border-b border-stone-border pb-3">
                Studio Details
              </h3>

              <div className="space-y-4 text-xs">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-ink uppercase tracking-spec">Atelier Location</strong>
                    <p className="text-stone-dark font-sans font-light mt-0.5">
                      {settings.fullAddress || BRAND_CONFIG.location.fullAddress}
                    </p>
                  </div>
                </div>

                {/* Primary Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-ink uppercase tracking-spec">Primary Phone (Tap to Call)</strong>
                    <a
                      href={`tel:${settings.primaryPhone || '0544911015'}`}
                      className="text-stone-dark hover:text-ink underline block font-semibold mt-0.5"
                    >
                      {settings.primaryPhoneDisplay || '054 491 1015'}
                    </a>
                  </div>
                </div>

                {/* Secondary Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-ink uppercase tracking-spec">Secondary Phone (Tap to Call)</strong>
                    <a
                      href={`tel:${settings.secondaryPhone || '0209300106'}`}
                      className="text-stone-dark hover:text-ink underline block font-semibold mt-0.5"
                    >
                      {settings.secondaryPhoneDisplay || '020 930 0106'}
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-3">
                  <Instagram className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-ink uppercase tracking-spec">Instagram Channel</strong>
                    <a
                      href={settings.instagramUrl || BRAND_CONFIG.contacts.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-dark hover:text-ink underline block mt-0.5"
                    >
                      {settings.instagramHandle || BRAND_CONFIG.handle}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3 pt-2 border-t border-stone-border">
                  <Clock className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-ink uppercase tracking-spec">Atelier Hours</strong>
                    <p className="text-stone-dark font-sans font-light mt-0.5">
                      {settings.businessHours || BRAND_CONFIG.hours.weekdays}
                    </p>
                    <p className="text-stone text-[11px] font-sans font-light">
                      {settings.businessHoursSunday || BRAND_CONFIG.hours.sunday}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map to Tema, Ghana */}
            <div className="border border-stone-border bg-sand overflow-hidden">
              <div className="p-3 border-b border-stone-border font-mono text-[10px] uppercase tracking-ultra text-stone flex items-center justify-between">
                <span>{(settings.city || 'TEMA').toUpperCase()} HARBOR &amp; STUDIO MAP</span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.mapQuery || `${settings.fullAddress}, ${settings.city}, ${settings.country}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ink"
                >
                  Open in Maps
                </a>
              </div>
              <div className="relative h-64 w-full bg-sand">
                <iframe
                  title={`${settings.storeName || 'ST Clothing'} Atelier Map in ${settings.city || 'Tema'}, ${settings.country || 'Ghana'}`}
                  src={BRAND_CONFIG.location.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.6) contrast(1.1)' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
