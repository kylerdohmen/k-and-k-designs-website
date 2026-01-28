/**
 * Carousel Component Type Definitions
 * 
 * This file defines TypeScript interfaces for the scroll-locked carousel
 * components and data structures. These types ensure type safety when
 * implementing the immersive storytelling carousel experience.
 */

import { PortableTextBlock, SanityImage } from './sanity.types';

// Core carousel data structures
export interface CarouselSection {
  id: string;
  title: string;
  heading: string;
  subheading?: string | undefined;
  content: PortableTextBlock[];
  backgroundImage: SanityImage;
  order: number;
}

export interface CarouselConfig {
  transitionDuration: number;
  scrollSensitivity: number;
}

export interface CarouselData {
  sections: CarouselSection[];
  config: CarouselConfig;
}

// Scroll controller types
export interface ScrollProgress {
  section: number;
  progress: number;
  direction: 'forward' | 'backward';
}

export interface ScrollControllerState {
  isActive: boolean;
  currentSection: number;
  sectionProgress: number;
  totalProgress: number;
}

export interface ScrollControllerActions {
  activate: () => void;
  deactivate: () => void;
  handleScroll: (event: WheelEvent) => void;
}

// Component prop interfaces
export interface ScrollLockedCarouselProps {
  sections: CarouselSection[];
  className?: string;
  onComplete?: () => void;
}

export interface CarouselSectionProps {
  section: CarouselSection;
  isActive: boolean;
  progress: number;
  className?: string;
}

export interface BackgroundImageProps {
  image: SanityImage;
  isActive: boolean;
  progress: number;
  priority?: boolean;
  className?: string;
}

export interface ContentOverlayProps {
  content: PortableTextBlock[];
  heading: string;
  subheading?: string | undefined;
  progress: number;
  isActive: boolean;
  className?: string;
}

export interface ProgressIndicatorProps {
  currentSection: number;
  totalSections: number;
  sectionProgress: number;
  className?: string;
}

// Custom hook return types
export interface UseScrollLockReturn {
  isLocked: boolean;
  lockScroll: () => void;
  unlockScroll: () => void;
}

export interface UseCarouselProgressReturn {
  currentSection: number;
  sectionProgress: number;
  totalProgress: number;
  direction: 'forward' | 'backward';
  updateProgress: (deltaY: number) => void;
  reset: () => void;
}

export interface UsePreloaderReturn {
  preloadedImages: Set<string>;
  preloadImage: (imageRef: string) => Promise<void>;
  preloadSanityImage: (image: SanityImage, options?: { maxRetries?: number; retryDelay?: number; priority?: boolean; fallbackUrl?: string }) => Promise<void>;
  isImagePreloaded: (imageRef: string) => boolean;
  getImageLoadState: (imageRef: string) => ImageLoadState;
  preloadNextImages: (currentIndex: number, sections: CarouselSection[]) => Promise<void>;
  cancelPreload: (imageRef: string) => void;
  clearPreloadCache: () => void;
  loadingStates: Map<string, { status: ImageLoadState; retryCount: number; lastError?: string }>;
}

export interface UseSanityContentReturn {
  carouselData: CarouselData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Animation and transition types
export interface TransitionConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface AnimationState {
  opacity: number;
  transform: string;
  transition: string;
}

// Error handling types
export interface CarouselError {
  type: 'scroll' | 'image' | 'content' | 'performance';
  message: string;
  section?: number;
  recoverable: boolean;
}

// Performance monitoring types
export interface PerformanceMetrics {
  frameRate: number;
  scrollLatency: number;
  imageLoadTime: number;
  transitionDuration: number;
}

// Accessibility types
export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;
  announceTransitions: boolean;
  respectReducedMotion: boolean;
  skipToContentEnabled: boolean;
}

// Responsive behavior types
export interface ResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  touchEnabled: boolean;
  mobileStackLayout: boolean;
}

// Content parsing types
export interface ContentParserConfig {
  allowedBlocks: string[];
  allowedMarks: string[];
  imageOptimization: boolean;
  linkHandling: 'internal' | 'external' | 'both';
}

export interface ParsedContent {
  html: string;
  plainText: string;
  wordCount: number;
  estimatedReadTime: number;
}

// Event types
export interface CarouselScrollEvent {
  deltaY: number;
  currentSection: number;
  progress: number;
  timestamp: number;
}

export interface CarouselTransitionEvent {
  fromSection: number;
  toSection: number;
  progress: number;
  direction: 'forward' | 'backward';
}

export interface CarouselCompleteEvent {
  totalSections: number;
  totalScrollDistance: number;
  duration: number;
}

// Utility types
export type CarouselEventHandler<T = void> = (event: T) => void;
export type CarouselDirection = 'forward' | 'backward';
export type CarouselState = 'idle' | 'scrolling' | 'transitioning' | 'complete';
export type ImageLoadState = 'loading' | 'loaded' | 'error';