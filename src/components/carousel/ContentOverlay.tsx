/**
 * ContentOverlay Component
 * 
 * Displays animated text content over carousel backgrounds with support for:
 * - Scroll-based animation timing
 * - Responsive typography and spacing
 * - Rich text content from Sanity CMS
 * - Step-by-step narrative format with numbering
 * - Mobile-optimized layouts
 */

'use client';

import React, { useMemo } from 'react';
import { ContentOverlayProps } from '@/types/carousel.types';
import { parsePortableTextContent } from '@/lib/carousel-utils';

export function ContentOverlay({ 
  content, 
  heading, 
  subheading, 
  progress, 
  isActive,
  className = '' 
}: ContentOverlayProps) {
  // Parse portable text content to HTML
  const parsedContent = useMemo(() => {
    return parsePortableTextContent(content);
  }, [content]);

  // Calculate animation values based on scroll progress
  const animationValues = useMemo(() => {
    // Content appears when section becomes active and progresses
    const baseOpacity = isActive ? Math.min(1, progress * 2) : 0;
    const translateY = isActive ? Math.max(0, (1 - progress) * 20) : 20;
    
    // Stagger animations for different elements
    const headingOpacity = Math.min(1, Math.max(0, (progress - 0.1) * 2));
    const subheadingOpacity = Math.min(1, Math.max(0, (progress - 0.2) * 2));
    const contentOpacity = Math.min(1, Math.max(0, (progress - 0.3) * 2));
    
    return {
      baseOpacity,
      translateY,
      headingOpacity,
      subheadingOpacity,
      contentOpacity,
    };
  }, [progress, isActive]);

  // Extract step number from heading if it follows the pattern "01 Title", "02 Title", etc.
  const stepInfo = useMemo(() => {
    const stepMatch = heading.match(/^(\d{2})\s+(.+)$/);
    if (stepMatch) {
      return {
        number: stepMatch[1],
        title: stepMatch[2],
      };
    }
    return null;
  }, [heading]);

  return (
    <div 
      className={`
        relative z-10 flex flex-col justify-center min-h-screen px-6 sm:px-8 lg:px-12
        transition-all duration-700 ease-out
        ${className}
      `}
      style={{
        opacity: animationValues.baseOpacity,
        transform: `translateY(${animationValues.translateY}px)`,
      }}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Step Number (if present) */}
        {stepInfo && (
          <div 
            className="
              text-6xl sm:text-7xl lg:text-8xl font-bold text-white/20 mb-4
              transition-opacity duration-700 ease-out
            "
            style={{
              opacity: animationValues.headingOpacity,
            }}
          >
            {stepInfo.number}
          </div>
        )}

        {/* Main Heading */}
        <h2 
          className="
            text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6
            leading-tight tracking-tight
            transition-opacity duration-700 ease-out
          "
          style={{
            opacity: animationValues.headingOpacity,
          }}
        >
          {stepInfo ? stepInfo.title : heading}
        </h2>

        {/* Subheading */}
        {subheading && (
          <p 
            className="
              text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 font-light
              leading-relaxed max-w-3xl
              transition-opacity duration-700 ease-out
            "
            style={{
              opacity: animationValues.subheadingOpacity,
            }}
          >
            {subheading}
          </p>
        )}

        {/* Rich Text Content */}
        {content && content.length > 0 && (
          <div 
            className="
              prose prose-lg prose-invert max-w-none
              prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-white prose-em:text-white/90
              prose-h3:text-white prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3
              prose-blockquote:border-white/30 prose-blockquote:text-white/80
              transition-opacity duration-700 ease-out
            "
            style={{
              opacity: animationValues.contentOpacity,
            }}
            dangerouslySetInnerHTML={{ __html: parsedContent.html }}
          />
        )}

        {/* Progress Indicator (for development/debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 text-xs text-white/40 font-mono">
            Progress: {Math.round(progress * 100)}% | Active: {isActive ? 'Yes' : 'No'}
          </div>
        )}
      </div>

      {/* Background Overlay for Better Text Readability */}
      <div 
        className="
          absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent
          pointer-events-none -z-10
        "
        style={{
          opacity: animationValues.baseOpacity * 0.8,
        }}
      />
    </div>
  );
}