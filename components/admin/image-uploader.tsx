'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadProductImage } from '@/lib/data/store';
import {
  Upload,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  Plus,
  Link as LinkIcon,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedImageItem {
  id?: string;
  image_url: string;
  storage_path?: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

interface ImageUploaderProps {
  images: UploadedImageItem[];
  onChange: (images: UploadedImageItem[]) => void;
  productId?: string;
}

export function ImageUploader({ images, onChange, productId = 'temp-prod' }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMsg('');

    try {
      const newItems: UploadedImageItem[] = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          setErrorMsg('Only image files (JPG, PNG, WebP) are supported.');
          continue;
        }

        const uploaded = await uploadProductImage(file, productId);
        newItems.push({
          id: `img-${Date.now()}-${i}`,
          image_url: uploaded.imageUrl,
          storage_path: uploaded.storagePath,
          alt_text: file.name,
          is_primary: newItems.length === 0,
          sort_order: newItems.length + 1,
        });
      }

      onChange(newItems);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setErrorMsg('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = () => {
    if (!customUrl.trim()) return;
    const newItems: UploadedImageItem[] = [
      ...images,
      {
        id: `img-url-${Date.now()}`,
        image_url: customUrl.trim(),
        alt_text: 'Product Image',
        is_primary: images.length === 0,
        sort_order: images.length + 1,
      },
    ];
    onChange(newItems);
    setCustomUrl('');
    setShowUrlInput(false);
  };

  const handleDelete = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    // If the deleted image was primary, set first remaining image as primary
    if (images[index].is_primary && updated.length > 0) {
      updated[0].is_primary = true;
    }
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      is_primary: idx === index,
    }));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const next = [...images];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;

    // re-assign sort order
    next.forEach((img, idx) => {
      img.sort_order = idx + 1;
    });

    onChange(next);
  };

  return (
    <div className="space-y-4 font-sans">
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex-1 border-2 border-dashed border-neutral-300 hover:border-black p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50 group',
            isUploading && 'opacity-50 pointer-events-none'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Upload className="w-6 h-6 text-neutral-400 group-hover:text-black mb-2 transition-colors" />
          <p className="text-xs uppercase tracking-wider font-semibold text-neutral-800">
            {isUploading ? 'Uploading to Supabase Storage...' : 'Click or Drag images to upload'}
          </p>
          <p className="text-[10px] text-neutral-500 mt-1">
            Supports PNG, JPG, WebP up to 10MB each
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="px-4 py-3 bg-white border border-neutral-300 hover:border-black text-xs uppercase tracking-wider text-neutral-800 font-medium flex items-center justify-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          <span>Add Image by URL</span>
        </button>
      </div>

      {/* Direct Image URL input */}
      {showUrlInput && (
        <div className="p-4 bg-neutral-50 border border-neutral-200 flex gap-2 animate-fade-in">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 bg-white border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800"
          >
            Add
          </button>
        </div>
      )}

      {/* Images Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-500">
            <span>Uploaded Images ({images.length})</span>
            <span>Primary image is displayed on catalog cards</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="relative group bg-neutral-100 border border-neutral-200 overflow-hidden aspect-[3/4] flex flex-col justify-between"
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || 'Product image'}
                  fill
                  className="object-cover object-center"
                  sizes="160px"
                />

                {/* Primary Tag */}
                {img.is_primary && (
                  <div className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold shadow">
                    Primary
                  </div>
                )}

                {/* Controls overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className={cn(
                        'p-1 text-white hover:text-amber-400 transition-colors',
                        img.is_primary && 'text-amber-400'
                      )}
                      title="Set as Primary"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      className="p-1 text-white hover:text-red-400 transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Move Left / Right */}
                  <div className="flex justify-between items-center text-white">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'left')}
                      disabled={idx === 0}
                      className="p-1 hover:text-neutral-300 disabled:opacity-30"
                      title="Move left"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono font-bold">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'right')}
                      disabled={idx === images.length - 1}
                      className="p-1 hover:text-neutral-300 disabled:opacity-30"
                      title="Move right"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
