/**
 * useScrollLock Hook
 * 
 * Custom hook for managing scroll lock functionality in the carousel.
 * Captures scroll events, prevents default page scrolling, and provides
 * methods to activate and deactivate scroll lock.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { UseScrollLockReturn } from '@/types/carousel.types';
import { throttle } from '@/lib/carousel-utils';

export function useScrollLock(): UseScrollLockReturn {
  const [isLocked, setIsLocked] = useState(false);
  const scrollPositionRef = useRef(0);
  const bodyStyleRef = useRef<string>('');
  const scrollHandlerRef = useRef<((event: WheelEvent) => void) | null>(null);
  const touchHandlerRef = useRef<((event: TouchEvent) => void) | null>(null);
  const keyboardHandlerRef = useRef<((event: KeyboardEvent) => void) | null>(null);

  // Prevent scroll events when locked
  const preventScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  // Prevent touch scroll events when locked
  const preventTouchScroll = useCallback((event: TouchEvent) => {
    if (event.touches.length === 1) {
      // Allow pinch-to-zoom but prevent single-finger scrolling
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  // Prevent keyboard scroll events when locked
  const preventKeyboardScroll = useCallback((event: KeyboardEvent) => {
    const scrollKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'PageUp', 'PageDown', 'Home', 'End', 'Space'
    ];
    
    if (scrollKeys.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  // Throttled event handlers for performance
  const throttledWheelHandler = useRef(throttle(preventScroll, 16)); // ~60fps
  const throttledTouchHandler = useRef(throttle(preventTouchScroll, 16));

  const lockScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Store current scroll position
    scrollPositionRef.current = window.pageYOffset;
    
    // Store current body styles
    bodyStyleRef.current = document.body.style.cssText;
    
    // Apply scroll lock styles
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to prevent scrolling
    const wheelHandler = throttledWheelHandler.current;
    const touchHandler = throttledTouchHandler.current;
    const keyboardHandler = preventKeyboardScroll;

    // Store handlers for cleanup
    scrollHandlerRef.current = wheelHandler;
    touchHandlerRef.current = touchHandler;
    keyboardHandlerRef.current = keyboardHandler;

    // Add event listeners with passive: false to allow preventDefault
    document.addEventListener('wheel', wheelHandler, { passive: false, capture: true });
    document.addEventListener('touchmove', touchHandler, { passive: false, capture: true });
    document.addEventListener('keydown', keyboardHandler, { passive: false, capture: true });
    
    // Prevent scrolling on mobile devices
    document.addEventListener('touchstart', touchHandler, { passive: false });
    
    setIsLocked(true);
  }, [preventKeyboardScroll]);

  const unlockScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Remove event listeners
    if (scrollHandlerRef.current) {
      document.removeEventListener('wheel', scrollHandlerRef.current, { capture: true } as any);
      scrollHandlerRef.current = null;
    }
    
    if (touchHandlerRef.current) {
      document.removeEventListener('touchmove', touchHandlerRef.current, { capture: true } as any);
      document.removeEventListener('touchstart', touchHandlerRef.current);
      touchHandlerRef.current = null;
    }
    
    if (keyboardHandlerRef.current) {
      document.removeEventListener('keydown', keyboardHandlerRef.current, { capture: true } as any);
      keyboardHandlerRef.current = null;
    }

    // Restore original body styles
    document.body.style.cssText = bodyStyleRef.current;
    
    // Restore scroll position
    window.scrollTo(0, scrollPositionRef.current);
    
    setIsLocked(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isLocked) {
        unlockScroll();
      }
    };
  }, [isLocked, unlockScroll]);

  // Handle page visibility changes to prevent issues when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isLocked) {
        // Temporarily unlock when page is hidden to prevent issues
        unlockScroll();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLocked, unlockScroll]);

  return {
    isLocked,
    lockScroll,
    unlockScroll,
  };
}