/**
 * useCarouselAccessibility Hook
 * 
 * Custom hook for managing accessibility features in the carousel.
 * Handles screen reader announcements, reduced motion preferences,
 * and WCAG compliance features.
 */

import { useCallback, useEffect, useState } from 'react';
import { AccessibilityConfig } from '@/types/carousel.types';

interface UseCarouselAccessibilityOptions {
  totalSections: number;
  sectionTitles: string[];
}

export function useCarouselAccessibility({
  totalSections,
  sectionTitles,
}: UseCarouselAccessibilityOptions) {
  const [config, setConfig] = useState<AccessibilityConfig>({
    enableKeyboardNavigation: true,
    announceTransitions: true,
    respectReducedMotion: false,
    skipToContentEnabled: true,
  });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, respectReducedMotion: e.matches }));
    };

    setConfig(prev => ({ ...prev, respectReducedMotion: mediaQuery.matches }));
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const announceSection = useCallback((sectionIndex: number) => {
    if (!config.announceTransitions) return;

    const sectionTitle = sectionTitles[sectionIndex] || `Section ${sectionIndex + 1}`;
    const announcement = `Now viewing ${sectionTitle}, section ${sectionIndex + 1} of ${totalSections}`;
    
    // Create a live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    
    document.body.appendChild(liveRegion);
    
    // Announce the section change
    setTimeout(() => {
      liveRegion.textContent = announcement;
    }, 100);
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, [config.announceTransitions, sectionTitles, totalSections]);

  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
    }
  }, []);

  return {
    config,
    announceSection,
    skipToContent,
    respectsReducedMotion: config.respectReducedMotion,
  };
}