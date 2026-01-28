/**
 * BackgroundImage Component
 * 
 * Optimized background image component for carousel sections.
 * Renders responsive images with smooth transitions, preloading,
 * and proper optimization for the immersive carousel experience.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BackgroundImageProps } from '@/types/carousel.types';
import { urlForCarouselBackground, carouselImagePresets } from '@/sanity/lib/image';
import { sampleImageUrls } from '@/lib/sample-carousel-data';

export function BackgroundImage({ 
  image,
  isActive, 
  progress, 
  priority = false,
  className = '' 
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  // Generate responsive image URLs
  const imageUrls = React.useMemo(() => {
    if (!image?.asset?._ref) return null;
    
    // Check if this is a sample image reference
    const sampleUrl = sampleImageUrls[image.asset._ref as keyof typeof sampleImageUrls];
    if (sampleUrl) {
      return {
        mobile: sampleUrl,
        tablet: sampleUrl,
        desktop: sampleUrl,
        ultrawide: sampleUrl,
        optimized: sampleUrl,
      };
    }
    
    // Check if image has a direct URL (for sample data)
    if ((image as any).url) {
      const directUrl = (image as any).url;
      return {
        mobile: directUrl,
        tablet: directUrl,
        desktop: directUrl,
        ultrawide: directUrl,
        optimized: directUrl,
      };
    }
    
    try {
      return {
        mobile: carouselImagePresets.mobile(image).url(),
        tablet: carouselImagePresets.tablet(image).url(),
        desktop: carouselImagePresets.desktop(image).url(),
        ultrawide: carouselImagePresets.ultrawide(image).url(),
        optimized: urlForCarouselBackground(image).url(),
      };
    } catch (error) {
      // Handle malformed asset references gracefully
      console.warn('Invalid image asset reference:', image.asset._ref, error);
      return null;
    }
  }, [image]);

  // Set the current image URL based on screen size
  useEffect(() => {
    if (!imageUrls) return;

    const updateImageUrl = () => {
      const width = window.innerWidth;
      if (width >= 2560) {
        setCurrentImageUrl(imageUrls.ultrawide);
      } else if (width >= 1920) {
        setCurrentImageUrl(imageUrls.desktop);
      } else if (width >= 1024) {
        setCurrentImageUrl(imageUrls.tablet);
      } else {
        setCurrentImageUrl(imageUrls.mobile);
      }
    };

    updateImageUrl();
    window.addEventListener('resize', updateImageUrl);
    return () => window.removeEventListener('resize', updateImageUrl);
  }, [imageUrls]);

  // Handle image load success
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  // Handle image load error
  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  // Calculate opacity based on active state and progress
  const opacity = React.useMemo(() => {
    if (!isActive) return 0;
    
    // Fade in/out based on progress for smooth transitions
    if (progress < 0.1) {
      return progress * 10; // Fade in from 0 to 1 over first 10% of progress
    } else if (progress > 0.9) {
      return (1 - progress) * 10; // Fade out from 1 to 0 over last 10% of progress
    }
    
    return 1; // Full opacity in the middle
  }, [isActive, progress]);

  // Calculate transform for subtle parallax effect
  const transform = React.useMemo(() => {
    if (!isActive) return 'scale(1.05)';
    
    // Subtle zoom effect based on progress
    const scale = 1 + (progress * 0.05); // Scale from 1 to 1.05
    return `scale(${scale})`;
  }, [isActive, progress]);

  // Fallback gradient for loading/error states
  const fallbackGradient = 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900';

  if (!image?.asset?._ref || !currentImageUrl) {
    return (
      <div 
        className={`absolute inset-0 ${fallbackGradient} ${className}`}
        style={{
          opacity,
          transform,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
    );
  }

  return (
    <div 
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        opacity,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Main background image */}
      <div
        className="absolute inset-0"
        style={{
          transform,
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Image
          src={currentImageUrl}
          alt={image.alt || 'Carousel background'}
          fill
          priority={priority}
          quality={85}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-800 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      {/* Fallback background for loading/error states */}
      {(!isLoaded || hasError) && (
        <div 
          className={`absolute inset-0 ${fallbackGradient}`}
          style={{
            transform,
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      
      {/* Additional overlay that responds to progress for dynamic lighting */}
      <div 
        className="absolute inset-0 bg-black/10"
        style={{
          opacity: Math.sin(progress * Math.PI) * 0.3, // Creates a subtle lighting effect
          transition: 'opacity 0.3s ease-out',
        }}
      />
    </div>
  );
}