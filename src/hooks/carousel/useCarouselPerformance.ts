/**
 * useCarouselPerformance Hook
 * 
 * Custom hook for monitoring and optimizing carousel performance.
 * Tracks frame rates, scroll latency, and provides performance metrics.
 */

import { useCallback, useRef, useState } from 'react';
import { PerformanceMetrics } from '@/types/carousel.types';

export function useCarouselPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    frameRate: 60,
    scrollLatency: 0,
    imageLoadTime: 0,
    transitionDuration: 0,
  });

  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const scrollStartTimeRef = useRef(0);

  const measureFrameRate = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastFrameTimeRef.current;
    
    if (deltaTime >= 1000) { // Measure over 1 second intervals
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      setMetrics(prev => ({ ...prev, frameRate: fps }));
      
      frameCountRef.current = 0;
      lastFrameTimeRef.current = now;
    } else {
      frameCountRef.current++;
    }
  }, []);

  const measureScrollLatency = useCallback(() => {
    scrollStartTimeRef.current = performance.now();
  }, []);

  const recordScrollEnd = useCallback(() => {
    if (scrollStartTimeRef.current > 0) {
      const latency = performance.now() - scrollStartTimeRef.current;
      setMetrics(prev => ({ ...prev, scrollLatency: latency }));
      scrollStartTimeRef.current = 0;
    }
  }, []);

  const measureImageLoadTime = useCallback((startTime: number) => {
    const loadTime = performance.now() - startTime;
    setMetrics(prev => ({ ...prev, imageLoadTime: loadTime }));
  }, []);

  const measureTransitionDuration = useCallback((startTime: number) => {
    const duration = performance.now() - startTime;
    setMetrics(prev => ({ ...prev, transitionDuration: duration }));
  }, []);

  return {
    metrics,
    measureFrameRate,
    measureScrollLatency,
    recordScrollEnd,
    measureImageLoadTime,
    measureTransitionDuration,
  };
}