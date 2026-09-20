import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-black uppercase tracking-[0.15em] text-black">
          Terms & Conditions
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          Effective: September 20, 2026
        </p>

        <div className="space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <p>
            Welcome to ST CLOTHING. By accessing our platform or placing an order, you agree to comply with our terms of service.
          </p>
          <h2 className="text-base font-bold uppercase tracking-wider text-black">1. Product Availability & Pricing</h2>
          <p>
            Prices are listed in USD. While we endeavor to ensure exact stock inventory, rare inventory discrepancies will be communicated promptly with immediate full refunds.
          </p>
          <h2 className="text-base font-bold uppercase tracking-wider text-black">2. Return & Exchange Policy</h2>
          <p>
            Unworn garments with original tags attached can be returned within 30 days of delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
