/**
 * Carousel Components Index
 * 
 * This file exports all carousel-related components for easy importing
 * throughout the application.
 */

export { ScrollLockedCarousel } from './ScrollLockedCarousel';
export { CarouselSection } from './CarouselSection';
export { BackgroundImage } from './BackgroundImage';
export { ContentOverlay } from './ContentOverlay';
export { ProgressIndicator } from './ProgressIndicator';
export { ScrollController } from './ScrollController';

// Re-export types for convenience
export type {
  ScrollLockedCarouselProps,
  CarouselSectionProps,
  BackgroundImageProps,
  ContentOverlayProps,
  ProgressIndicatorProps,
} from '@/types/carousel.types';