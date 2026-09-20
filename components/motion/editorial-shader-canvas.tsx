'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uHover;
  uniform float uHoverProgress;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Smooth weighted wave displacement
    float wave = sin(uv.y * 6.0 + uTime * 1.5) * cos(uv.x * 4.0 + uTime * 1.0) * 0.035;
    float dist = distance(uv, uHover);
    float hoverWave = sin(dist * 10.0 - uTime * 2.5) * exp(-dist * 3.5) * uHoverProgress * 0.06;
    
    pos.z += wave + hoverWave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uTextureAlt;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uHover;

  void main() {
    vec2 uv = vUv;
    
    // Liquid displacement distortion
    vec2 displacement = vec2(
      sin(uv.y * 12.0 + uTime * 1.2),
      cos(uv.x * 12.0 + uTime * 1.2)
    ) * (0.015 * uProgress);

    vec4 tex1 = texture2D(uTexture, uv + displacement);
    vec4 tex2 = texture2D(uTextureAlt, uv - displacement);
    
    // Silk curtain cross-fade transition
    vec4 finalColor = mix(tex1, tex2, smoothstep(0.0, 1.0, uProgress));
    gl_FragColor = finalColor;
  }
`;

interface ShaderCanvasProps {
  imageSrc: string;
  imageAltSrc?: string;
  altText?: string;
  className?: string;
}

export function EditorialShaderCanvas({
  imageSrc,
  imageAltSrc,
  altText = 'Editorial garment drape',
  className = '',
}: ShaderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverProgress = useRef(0);
  const targetHoverProgress = useRef(0);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 2.4;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const tex1 = loader.load(imageSrc);
    const tex2 = loader.load(imageAltSrc || imageSrc);

    tex1.minFilter = THREE.LinearFilter;
    tex2.minFilter = THREE.LinearFilter;

    const uniforms = {
      uTime: { value: 0 },
      uTexture: { value: tex1 },
      uTextureAlt: { value: tex2 },
      uProgress: { value: 0 },
      uHover: { value: new THREE.Vector2(0.5, 0.5) },
      uHoverProgress: { value: 0 },
    };

    const geometry = new THREE.PlaneGeometry(1.6, 2.1, 48, 48);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId: number;
    const clock = new THREE.Clock();

    function render() {
      uniforms.uTime.value = clock.getElapsedTime();
      
      // Interpolate hover damping with velvet spring
      hoverProgress.current += (targetHoverProgress.current - hoverProgress.current) * 0.08;
      uniforms.uHoverProgress.value = hoverProgress.current;
      uniforms.uProgress.value = hoverProgress.current;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    }

    render();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      uniforms.uHover.value.set(x, y);
    };

    const handleMouseEnter = () => {
      targetHoverProgress.current = 1.0;
    };
    const handleMouseLeave = () => {
      targetHoverProgress.current = 0.0;
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      tex1.dispose();
      tex2.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc, imageAltSrc]);

  if (!webglSupported) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-linen-200 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    />
  );
}
