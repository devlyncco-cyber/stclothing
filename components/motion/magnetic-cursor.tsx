'use client';

import React, { useEffect, useRef, useState } from 'react';

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on devices with fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // Spring physics interpolation loop
    let rafId: number;
    const loop = () => {
      const factor = 0.16; // Velvet spring factor
      cursorX += (mouseX - cursorX) * factor;
      cursorY += (mouseY - cursorY) * factor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();

    // Contextual element detection
    const handleElementHover = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else {
        const interactive = (e.target as HTMLElement).closest('button, a, input, select');
        if (interactive) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    window.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', handleElementHover);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 pointer-events-none z-[99999] transition-all duration-300 ease-luxury-out mix-blend-difference hidden md:flex items-center justify-center ${
        !isVisible ? 'opacity-0 scale-0' : 'opacity-100'
      } ${
        isHovered
          ? cursorText
            ? 'w-24 h-24 rounded-full bg-linen-100 text-slate-ink shadow-2xl scale-100'
            : 'w-10 h-10 rounded-full bg-linen-100/90 scale-110'
          : 'w-3 h-3 rounded-full bg-linen-100 scale-100'
      }`}
    >
      {isHovered && cursorText && (
        <span className="text-[9px] tracking-spec uppercase font-mono font-semibold text-slate-ink text-center px-1 animate-fade-in select-none">
          {cursorText}
        </span>
      )}
    </div>
  );
}
