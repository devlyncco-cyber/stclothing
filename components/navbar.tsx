'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useAuth } from '@/lib/context/auth-context';
import { useStoreSettings } from '@/lib/context/store-settings-context';
import { cn } from '@/lib/utils';
import { BRAND_CONFIG } from '@/lib/config/brand';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { user, isAdmin } = useAuth();
  const { settings } = useStoreSettings();

  // Scroll direction detection (hide on scroll down, return on scroll up)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if past initial threshold
      setIsScrolled(currentScrollY > 20);

      // Hide when scrolling down fast, show when scrolling up
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current && !mobileMenuOpen && !searchOpen) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, searchOpen]);

  // Close mobile menu and search on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'COLLECTIONS', href: '/shop' },
    { label: 'NEW IN', href: '/shop?filter=new' },
    { label: 'LOOKBOOK', href: '/lookbook' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) {
    return null; // Admin layout has its own sidebar
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500 font-sans',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isScrolled
            ? 'bg-bone/95 backdrop-blur-md border-b border-stone-border py-3.5 shadow-sm text-ink'
            : 'bg-bone/75 backdrop-blur-sm border-b border-stone-border/60 py-5 text-ink'
        )}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Trigger + Desktop Nav */}
            <div className="flex items-center space-x-8">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-ink hover:text-stone-dark transition-colors focus:outline-none"
                aria-label="Toggle menu"
                data-cursor="MENU"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <nav className="hidden md:flex items-center space-x-7 font-mono text-[11px] uppercase tracking-ultra font-medium">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      data-cursor="NAV"
                      className={cn(
                        'transition-colors hover:text-clay py-1 relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-ink after:transition-all hover:after:w-full',
                        isActive ? 'text-ink font-semibold after:w-full' : 'text-stone-dark'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center: Brand Logo with Ghanaian Micro-Label */}
            <div className="text-center absolute left-1/2 -translate-x-1/2">
              <Link href="/" data-cursor="HOME" className="inline-block text-center group">
                <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight uppercase text-ink inline-block leading-none">
                  {settings.storeName || 'ST CLOTHING'}
                </span>
                <span className="block font-mono text-[8px] sm:text-[9px] uppercase tracking-ultra text-stone pt-0.5">
                  {(settings.city || 'TEMA').toUpperCase()} · {(settings.country || 'GHANA').toUpperCase()}
                </span>
              </Link>
            </div>

            {/* Right Actions: Search & Shopping Bag */}
            <div className="flex items-center space-x-3 sm:space-x-6 font-mono">
              {/* Search button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-ink hover:text-clay transition-colors focus:outline-none"
                aria-label="Search collection"
                data-cursor="SEARCH"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Cart Drawer Trigger (Only if Bag is Enabled) */}
              {settings.bagEnabled && (
                <button
                  type="button"
                  onClick={openCart}
                  className="flex items-center space-x-1.5 text-[11px] uppercase tracking-ultra text-ink hover:text-clay transition-colors py-1 focus:outline-none relative group"
                  aria-label="Shopping bag"
                  data-cursor="BAG"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4 text-ink group-hover:scale-110 transition-transform" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-clay text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in font-mono">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium text-[11px] ml-1">
                    BAG {totalItems > 0 ? `(${totalItems})` : '(0)'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="border-t border-stone-border bg-bone px-4 py-4 animate-fade-in">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="max-w-2xl mx-auto flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-stone" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection, oversized tees, hoodies, selvedge..."
                className="w-full bg-transparent text-sm font-mono text-ink placeholder:text-stone focus:outline-none tracking-wide"
                autoFocus
              />
              <button
                type="submit"
                className="font-mono text-[10px] uppercase tracking-ultra bg-ink text-bone px-4 py-2 hover:bg-clay hover:text-white transition-colors font-semibold"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-stone hover:text-ink p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Full-Screen Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-md md:hidden animate-fade-in">
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-bone text-ink shadow-2xl p-6 flex flex-col justify-between animate-slide-left border-r border-stone-border">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-stone-border">
                <div>
                  <span className="text-xl font-serif font-bold tracking-tight uppercase text-ink">
                    {settings.storeName || 'ST CLOTHING'}
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-ultra text-stone">
                    {(settings.city || 'TEMA').toUpperCase()} · {(settings.country || 'GHANA').toUpperCase()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone hover:text-ink"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-8 flex flex-col space-y-5 font-mono">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm uppercase tracking-ultra font-semibold text-ink hover:text-clay flex items-center justify-between py-1.5"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-stone" />
                  </Link>
                ))}
              </div>

              {/* Direct Order & Inquiries */}
              <div className="mt-8 pt-6 border-t border-stone-border font-mono space-y-3">
                <p className="text-[10px] uppercase tracking-ultra text-stone">
                  DIRECT CONTACT &amp; INQUIRIES
                </p>
                <a
                  href={`https://wa.me/${settings.primaryWhatsApp || '233544911015'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-sand text-ink text-xs font-semibold border border-stone-border"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700 fill-current" />
                  <span>WhatsApp: {settings.primaryPhoneDisplay || '054 491 1015'}</span>
                </a>
                <a
                  href={`tel:${settings.primaryPhone || '0544911015'}`}
                  className="flex items-center gap-2 p-3 bg-bone text-ink text-xs border border-stone-border"
                >
                  <Phone className="w-4 h-4 text-stone" />
                  <span>Call: {settings.primaryPhoneDisplay || '054 491 1015'}</span>
                </a>
              </div>
            </div>

            {/* Bottom Footer Details */}
            <div className="pt-6 border-t border-stone-border font-mono text-center">
              <p className="text-[10px] text-stone tracking-wider uppercase">
                © {new Date().getFullYear()} {settings.storeName || 'ST CLOTHING'}. {(settings.city || 'TEMA').toUpperCase()}, {(settings.country || 'GHANA').toUpperCase()}.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
