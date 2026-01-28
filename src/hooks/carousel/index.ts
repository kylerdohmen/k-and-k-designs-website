/**
 * Carousel Hooks Index
 * 
 * This file exports all carousel-related custom hooks for easy importing
 * throughout the application. These hooks provide the core functionality
 * for the scroll-locked carousel component.
 */

export { useScrollLock } from './useScrollLock';
export { useCarouselProgress } from './useCarouselProgress';
export { usePreloader } from './usePreloader';
export { useSanityContent } from './useSanityContent';
export { useCarouselKeyboard } from './useCarouselKeyboard';
export { useCarouselPerformance } from './useCarouselPerformance';
export { useCarouselAccessibility } from './useCarouselAccessibility';

// Re-export types for convenience
export type {
  UseScrollLockReturn,
  UseCarouselProgressReturn,
  UsePreloaderReturn,
  UseSanityContentReturn,
  ScrollProgress,
  CarouselError,
  PerformanceMetrics,
} from '@/types/carousel.types';