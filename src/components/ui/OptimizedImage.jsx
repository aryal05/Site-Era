'use client';

import { useState } from 'react';

/**
 * Optimized Image Component with Cloudinary support
 * Automatically optimizes images for fast loading
 */

// Get optimized Cloudinary URL
function getOptimizedUrl(src, width, height, quality = 'auto') {
  if (!src) return '';
  
  // If it's a Cloudinary URL, add optimizations
  if (src.includes('cloudinary.com')) {
    const parts = src.split('/upload/');
    if (parts.length === 2) {
      const transforms = [];
      if (width) transforms.push(`w_${width}`);
      if (height) transforms.push(`h_${height}`);
      transforms.push(`q_${quality}`);
      transforms.push('f_auto'); // Auto format (WebP, AVIF)
      transforms.push('c_limit'); // Don't upscale
      
      return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
    }
  }
  
  return src;
}

export default function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  quality = 'auto',
  sizes,
  style,
  onLoad,
  onClick,
  loading = 'lazy',
}) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-800 ${className}`}
        style={style}
      >
        <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  const optimizedSrc = getOptimizedUrl(src, width, height, quality);

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  // Build inline style for positioning
  const imgStyle = {
    ...style,
    ...(fill ? {
      position: 'absolute',
      height: '100%',
      width: '100%',
      inset: 0,
      objectFit: 'cover',
    } : {}),
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 300ms',
  };

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      style={imgStyle}
      onLoad={handleLoad}
      onError={handleError}
      onClick={onClick}
      loading={priority ? 'eager' : loading}
    />
  );
}
