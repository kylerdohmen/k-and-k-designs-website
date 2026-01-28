/**
 * useCarouselProgress Hook
 * 
 * Custom hook for managing carousel progression through sections.
 * Handles scroll distance to section progress calculation, bidirectional
 * scroll handling, and progress state management.
 */

import { useCallback, useState, useRef } from 'react';
import { UseCarouselProgressReturn, CarouselDirection } from '@/types/carousel.types';

interface UseCarouselProgressOptions {
  totalSections: number;
  scrollSensitivity?: number;
  onSectionChange?: (section: number) => void;
  onComplete?: () => void;
}

export function useCarouselProgress({
  totalSections,
  scrollSensitivity = 1.0,
  onSectionChange,
  onComplete,
}: UseCarouselProgressOptions): UseCarouselProgressReturn {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [direction, setDirection] = useState<CarouselDirection>('forward');
  
  const accumulatedScrollRef = useRef(0);
  const lastSectionRef = useRef(0);
  const scrollThreshold = 100; // Pixels needed to progress through one section

  const updateProgress = useCallback((deltaY: number) => {
    // Apply scroll sensitivity
    const adjustedDelta = deltaY * scrollSensitivity;
    
    // Accumulate scroll distance
    accumulatedScrollRef.current += adjustedDelta;
    
    // Determine direction
    const newDirection: CarouselDirection = adjustedDelta > 0 ? 'forward' : 'backward';
    setDirection(newDirection);
    
    // Calculate total progress (0 to totalSections)
    const rawTotalProgress = accumulatedScrollRef.current / scrollThreshold;
    const clampedTotalProgress = Math.max(0, Math.min(totalSections, rawTotalProgress));
    
    // Calculate current section (0 to totalSections - 1)
    const newCurrentSection = Math.min(totalSections - 1, Math.floor(clampedTotalProgress));
    
    // Calculate section progress (0 to 1)
    let newSectionProgress: number;
    if (newCurrentSection === totalSections - 1) {
      // For the last section, calculate progress based on how far past the section boundary we are
      const lastSectionStart = totalSections - 1;
      newSectionProgress = Math.min(1, Math.max(0, clampedTotalProgress - lastSectionStart));
    } else {
      // For other sections, use the fractional part
      newSectionProgress = clampedTotalProgress - newCurrentSection;
    }
    
    // Update state
    setCurrentSection(newCurrentSection);
    setSectionProgress(newSectionProgress);
    
    // Trigger section change callback
    if (newCurrentSection !== lastSectionRef.current) {
      lastSectionRef.current = newCurrentSection;
      onSectionChange?.(newCurrentSection);
    }
    
    // Check for completion
    if (newCurrentSection === totalSections - 1 && newSectionProgress >= 1) {
      onComplete?.();
    }
  }, [totalSections, scrollSensitivity, onSectionChange, onComplete]);

  const reset = useCallback(() => {
    setCurrentSection(0);
    setSectionProgress(0);
    setDirection('forward');
    accumulatedScrollRef.current = 0;
    lastSectionRef.current = 0;
  }, []);

  const totalProgress = currentSection + sectionProgress;

  return {
    currentSection,
    sectionProgress,
    totalProgress,
    direction,
    updateProgress,
    reset,
  };
}