/**
 * useCarouselKeyboard Hook
 * 
 * Custom hook for managing keyboard navigation in the carousel.
 * Provides accessibility support through arrow key navigation and
 * focus management.
 */

import { useEffect, useCallback } from 'react';

interface UseCarouselKeyboardOptions {
  isActive: boolean;
  currentSection: number;
  totalSections: number;
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
  onEscape: () => void;
}

export function useCarouselKeyboard({
  isActive,
  currentSection,
  totalSections,
  onNavigateNext,
  onNavigatePrevious,
  onEscape,
}: UseCarouselKeyboardOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        if (currentSection < totalSections - 1) {
          onNavigateNext();
        }
        break;
      
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (currentSection > 0) {
          onNavigatePrevious();
        }
        break;
      
      case 'Escape':
        event.preventDefault();
        onEscape();
        break;
      
      default:
        break;
    }
  }, [isActive, currentSection, totalSections, onNavigateNext, onNavigatePrevious, onEscape]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
    return undefined;
  }, [isActive, handleKeyDown]);

  return {
    // This hook primarily manages side effects, no return values needed for now
  };
}