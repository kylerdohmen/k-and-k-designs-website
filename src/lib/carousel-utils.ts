/**
 * Carousel Utility Functions
 * 
 * This file contains utility functions for the carousel component,
 * including content parsing, image URL generation, and validation.
 */

import { PortableTextBlock, SanityImage } from '@/types/sanity.types';
import { ParsedContent } from '@/types/carousel.types';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';

// Initialize the image URL builder
const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URL from Sanity image asset
 */
export function urlFor(source: SanityImage) {
  return builder.image(source);
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function generateResponsiveImageUrls(image: SanityImage) {
  const baseUrl = urlFor(image);
  
  return {
    mobile: baseUrl.width(480).height(800).quality(80).format('webp').url(),
    tablet: baseUrl.width(768).height(1024).quality(85).format('webp').url(),
    desktop: baseUrl.width(1920).height(1080).quality(90).format('webp').url(),
    // Fallback formats for browsers that don't support WebP
    mobileFallback: baseUrl.width(480).height(800).quality(80).format('jpg').url(),
    tabletFallback: baseUrl.width(768).height(1024).quality(85).format('jpg').url(),
    desktopFallback: baseUrl.width(1920).height(1080).quality(90).format('jpg').url(),
  };
}

/**
 * Parse portable text content to plain text
 */
export function parsePortableTextToPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .filter(block => block._type === 'block')
    .map(block => 
      block.children
        ?.filter(child => child._type === 'span')
        .map(child => child.text)
        .join('') || ''
    )
    .join('\n\n');
}

/**
 * Parse portable text content with configuration
 */
export function parsePortableTextContent(
  blocks: PortableTextBlock[]
): ParsedContent {
  const plainText = parsePortableTextToPlainText(blocks);
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

  // Enhanced HTML conversion with proper portable text handling
  const html = blocks
    .map(block => {
      if (block._type === 'block') {
        const text = block.children
          ?.map(child => {
            if (child._type === 'span') {
              let content = child.text;
              
              // Apply marks with proper HTML tags
              if (child.marks?.includes('strong')) {
                content = `<strong>${content}</strong>`;
              }
              if (child.marks?.includes('em')) {
                content = `<em>${content}</em>`;
              }
              if (child.marks?.includes('underline')) {
                content = `<u>${content}</u>`;
              }
              if (child.marks?.includes('code')) {
                content = `<code class="bg-white/10 px-1 py-0.5 rounded text-sm">${content}</code>`;
              }
              
              // Handle links
              const linkMark = child.marks?.find(mark => 
                block.markDefs?.some(def => def._key === mark && def._type === 'link')
              );
              if (linkMark) {
                const linkDef = block.markDefs?.find(def => def._key === linkMark);
                if (linkDef?.href) {
                  content = `<a href="${linkDef.href}" class="text-white underline hover:text-white/80 transition-colors" target="_blank" rel="noopener noreferrer">${content}</a>`;
                }
              }
              
              return content;
            }
            return '';
          })
          .join('') || '';

        // Apply block styles with proper semantic HTML
        switch (block.style) {
          case 'h1':
            return `<h1 class="text-2xl font-bold mb-4 text-white">${text}</h1>`;
          case 'h2':
            return `<h2 class="text-xl font-semibold mb-3 text-white">${text}</h2>`;
          case 'h3':
            return `<h3 class="text-lg font-medium mb-2 text-white">${text}</h3>`;
          case 'h4':
            return `<h4 class="text-base font-medium mb-2 text-white">${text}</h4>`;
          case 'blockquote':
            return `<blockquote class="border-l-4 border-white/30 pl-4 italic text-white/80 my-4">${text}</blockquote>`;
          case 'normal':
          default:
            // Handle list items
            if (block.listItem) {
              const listClass = block.listItem === 'bullet' 
                ? 'list-disc list-inside' 
                : 'list-decimal list-inside';
              return `<li class="${listClass} text-white/80 mb-2">${text}</li>`;
            }
            return text ? `<p class="text-white/80 mb-4 leading-relaxed">${text}</p>` : '';
        }
      }
      return '';
    })
    .join('');

  return {
    html,
    plainText,
    wordCount,
    estimatedReadTime,
  };
}

/**
 * Validate carousel section data
 */
export function validateCarouselSection(section: any): boolean {
  return !!(
    section &&
    typeof section.id === 'string' &&
    typeof section.heading === 'string' &&
    section.backgroundImage &&
    section.backgroundImage.asset &&
    typeof section.order === 'number'
  );
}

/**
 * Calculate scroll progress based on scroll distance
 */
export function calculateScrollProgress(
  scrollDistance: number,
  sectionHeight: number,
  totalSections: number
): { section: number; progress: number; totalProgress: number } {
  // Handle edge cases
  if (!Number.isFinite(scrollDistance) || !Number.isFinite(sectionHeight) || sectionHeight <= 0 || totalSections <= 0) {
    return {
      section: 0,
      progress: 0,
      totalProgress: 0,
    };
  }

  const totalProgress = Math.max(0, Math.min(totalSections, scrollDistance / sectionHeight));
  const section = Math.floor(totalProgress);
  const progress = totalProgress - section;

  // Handle boundary conditions properly
  const boundedSection = Math.max(0, Math.min(totalSections - 1, section));
  let boundedProgress = progress;
  
  // If we're at the last section, ensure progress doesn't exceed 1
  if (boundedSection === totalSections - 1) {
    boundedProgress = Math.min(1, progress);
  }
  
  // Special case: if totalProgress equals totalSections, we should be at the end
  if (totalProgress >= totalSections) {
    return {
      section: totalSections - 1,
      progress: 1,
      totalProgress: totalSections,
    };
  }

  return {
    section: boundedSection,
    progress: boundedProgress,
    totalProgress,
  };
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll event handling
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions() {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Generate CSS custom properties for carousel theming
 */
export function generateCarouselCSSProperties(config: {
  transitionDuration: number;
  scrollSensitivity: number;
}) {
  return {
    '--carousel-transition-duration': `${config.transitionDuration}ms`,
    '--carousel-scroll-sensitivity': config.scrollSensitivity.toString(),
  };
}