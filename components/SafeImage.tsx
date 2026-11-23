'use client';

import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export function SafeImage({ src, alt, className, fallbackText = 'AERORA', ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  // High quality SVG placeholder if external image fails
  const svgPlaceholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%230F172A"/><rect x="40" y="40" width="720" height="420" rx="16" fill="%231E293B"/><circle cx="400" cy="220" r="60" fill="%230EA5E9" fill-opacity="0.2"/><path d="M380 220L400 200L420 220" stroke="%2338BDF8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="50%25" y="320" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="sans-serif" font-size="20" font-weight="600">${encodeURIComponent(fallbackText)}</text></svg>`;

  return (
    <img
      src={error || !src ? svgPlaceholder : src}
      alt={alt || 'AERORA Hotel'}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
}

