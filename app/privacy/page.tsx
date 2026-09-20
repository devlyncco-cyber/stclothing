import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-black uppercase tracking-[0.15em] text-black">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          Last updated: September 20, 2026
        </p>

        <div className="space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <p>
            At ST CLOTHING, we respect your personal privacy. We collect customer information strictly for order fulfillment, delivery tracking, and client communications.
          </p>
          <h2 className="text-base font-bold uppercase tracking-wider text-black">1. Information Collection</h2>
          <p>
            When placing an order or registering for our private collective, we collect your name, shipping address, email address, and phone number.
          </p>
          <h2 className="text-base font-bold uppercase tracking-wider text-black">2. Security Standards</h2>
          <p>
            All transactional data is encrypted using industry standard 256-bit SSL protocols. We do not sell or lease personal customer data to any third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
