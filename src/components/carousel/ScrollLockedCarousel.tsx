/**
 * ScrollLockedCarousel Component
 * 
 * Main carousel component that orchestrates the scroll-locked experience.
 * Combines scroll controller, background images, and content overlay to create
 * an immersive storytelling experience with smooth transitions between sections.
 */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollLockedCarouselProps, CarouselState } from '@/types/carousel.types';
import { useScrollLock } from '@/hooks/carousel/useScrollLock';
import { useCarouselProgress } from '@/hooks/carousel/useCarouselProgress';
import { usePreloader } from '@/hooks/carousel/usePreloader';
import { BackgroundImage } from './BackgroundImage';
import { ContentOverlay } from './ContentOverlay';
import { ProgressIndicator } from './ProgressIndicator';
import { throttle } from '@/lib/carousel-utils';

export function ScrollLockedCarousel({ 
  sections, 
  className = '',
  onComplete
}: ScrollLockedCarouselProps) {
  const [carouselState, setCarouselState] = useState<CarouselState>('idle');
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isCompletedRef = useRef(false);

  // Initialize hooks
  const { isLocked, lockScroll, unlockScroll } = useScrollLock();
  const { preloadNextImages } = usePreloader();
  
  const {
    currentSection,
    sectionProgress,
    totalProgress,
    direction,
    updateProgress,
    reset
  } = useCarouselProgress({
    totalSections: sections.length,
    scrollSensitivity: 1.2,
    onSectionChange: useCallback((section: number) => {
      // Preload images for smooth transitions
      preloadNextImages(section, sections);
    }, [preloadNextImages, sections]),
    onComplete: useCallback(() => {
      if (!isCompletedRef.current) {
        isCompletedRef.current = true;
        setCarouselState('complete');
        
        // Delay unlock to allow final animations to complete
        setTimeout(() => {
          unlockScroll();
          onComplete?.();
        }, 800);
      }
    }, [unlockScroll, onComplete])
  });

  // Throttled scroll handler for performance
  const handleScroll = useCallback(
    throttle((event: WheelEvent) => {
      if (carouselState === 'complete') return;
      
      event.preventDefault();
      event.stopPropagation();
      
      setCarouselState('scrolling');
      updateProgress(event.deltaY);
      
      // Reset to idle after scroll stops
      setTimeout(() => {
        setCarouselState(prevState => prevState === 'complete' ? 'complete' : 'idle');
      }, 150);
    }, 16), // ~60fps
    [updateProgress, carouselState]
  );

  // Handle touch events for mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      if (touch) {
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY
        };
      }
    }
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!touchStartRef.current || event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    if (!touch) return;
    
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaX = touch.clientX - touchStartRef.current.x;
    
    // Only handle vertical scrolling (ignore horizontal swipes)
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      event.preventDefault();
      
      // Convert touch movement to scroll delta
      const scrollDelta = -deltaY * 2; // Invert and amplify for natural feel
      updateProgress(scrollDelta);
      
      // Update touch start position for continuous scrolling
      touchStartRef.current.y = touch.clientY;
    }
  }, [updateProgress]);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  // Initialize carousel when component mounts
  useEffect(() => {
    if (!isInitialized && sections.length > 0) {
      // Preload first few images
      preloadNextImages(0, sections);
      setIsInitialized(true);
    }
  }, [isInitialized, sections, preloadNextImages]);

  // Set up scroll lock and event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isInitialized) return;

    // Activate scroll lock when carousel is in view
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        
        if (entry.isIntersecting && !isLocked && carouselState !== 'complete') {
          lockScroll();
          setCarouselState('idle');
        } else if (!entry.isIntersecting && isLocked) {
          unlockScroll();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (isLocked) {
        unlockScroll();
      }
    };
  }, [isInitialized, isLocked, lockScroll, unlockScroll, carouselState]);

  // Add scroll and touch event listeners when locked
  useEffect(() => {
    if (!isLocked) return;

    const container = containerRef.current;
    if (!container) return;

    // Add wheel event listener
    container.addEventListener('wheel', handleScroll, { passive: false });
    
    // Add touch event listeners for mobile
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLocked, handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (carouselState === 'complete') return;

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Space key
          event.preventDefault();
          updateProgress(100);
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          updateProgress(-100);
          break;
        case 'Home':
          event.preventDefault();
          reset();
          break;
        case 'End':
          event.preventDefault();
          // Jump to end
          for (let i = 0; i < sections.length * 100; i++) {
            updateProgress(1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, updateProgress, reset, carouselState, sections.length]);

  if (!sections || sections.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">No carousel sections available</h2>
          <p className="text-gray-400">Please configure carousel sections in your CMS.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`
        relative min-h-screen overflow-hidden bg-black
        ${className}
      `}
      style={{
        height: '100vh',
        touchAction: isLocked ? 'none' : 'auto',
      }}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {sections.map((section, index) => (
          <BackgroundImage
            key={section.id}
            image={section.backgroundImage}
            isActive={index === currentSection}
            progress={index === currentSection ? sectionProgress : 0}
            priority={index === 0} // Prioritize first image
            className="transition-opacity duration-800 ease-out"
          />
        ))}
      </div>

      {/* Content Overlays */}
      <div className="relative z-10">
        {sections.map((section, index) => (
          <ContentOverlay
            key={section.id}
            content={section.content}
            heading={section.heading}
            {...(section.subheading && { subheading: section.subheading })}
            progress={index === currentSection ? sectionProgress : 0}
            isActive={index === currentSection}
            className="absolute inset-0"
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator
        currentSection={currentSection}
        totalSections={sections.length}
        sectionProgress={sectionProgress}
        className="
          fixed right-6 top-1/2 transform -translate-y-1/2 z-20
          hidden md:flex flex-col space-y-3
        "
      />

      {/* Mobile Progress Indicator */}
      <div className="
        fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20
        md:hidden flex space-x-2
      ">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentSection 
                ? 'bg-white' 
                : index < currentSection 
                  ? 'bg-white/60' 
                  : 'bg-white/20'
              }
            `}
            style={{
              transform: index === currentSection 
                ? `scale(${1 + sectionProgress * 0.5})` 
                : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Scroll Hint (only show on first section) */}
      {currentSection === 0 && sectionProgress < 0.1 && (
        <div className="
          fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20
          text-white/60 text-sm font-light text-center
          animate-pulse
        ">
          <div className="mb-2">
            <svg 
              className="w-6 h-6 mx-auto animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
          <p className="hidden sm:block">Scroll to explore</p>
        </div>
      )}

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="
          fixed top-4 left-4 z-30 bg-black/80 text-white text-xs p-3 rounded
          font-mono space-y-1
        ">
          <div>Section: {currentSection + 1}/{sections.length}</div>
          <div>Progress: {Math.round(sectionProgress * 100)}%</div>
          <div>Total: {Math.round(totalProgress * 100)}%</div>
          <div>Direction: {direction}</div>
          <div>State: {carouselState}</div>
          <div>Locked: {isLocked ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}