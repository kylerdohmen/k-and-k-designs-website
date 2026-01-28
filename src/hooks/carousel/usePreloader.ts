/**
 * usePreloader Hook
 * 
 * Custom hook for managing image preloading in the carousel.
 * Implements preloading strategy for smooth transitions, error handling,
 * and loading state management with retry logic and fallback images.
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { UsePreloaderReturn, CarouselSection, ImageLoadState } from '@/types/carousel.types';
import { urlForCarouselBackground, carouselImagePresets } from '@/sanity/lib/image';
import { SanityImage } from '@/types/sanity.types';

interface PreloadState {
  status: ImageLoadState;
  retryCount: number;
  lastError?: string;
}

interface PreloadOptions {
  maxRetries?: number;
  retryDelay?: number;
  priority?: boolean;
  fallbackUrl?: string;
}

const DEFAULT_OPTIONS: Required<PreloadOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  priority: false,
  fallbackUrl: '/images/carousel-fallback.svg'
};

export function usePreloader(): UsePreloaderReturn {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState<Map<string, PreloadState>>(new Map());
  const loadingImagesRef = useRef<Set<string>>(new Set());
  const imageElementsRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // Cleanup function to abort ongoing requests
  const cleanup = useCallback(() => {
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();
    loadingImagesRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const generateImageUrls = useCallback((image: SanityImage) => {
    try {
      return {
        desktop: carouselImagePresets.desktop(image).url(),
        tablet: carouselImagePresets.tablet(image).url(),
        mobile: carouselImagePresets.mobile(image).url(),
        optimized: urlForCarouselBackground(image).url(),
      };
    } catch (error) {
      console.warn('Failed to generate image URLs:', error);
      return null;
    }
  }, []);

  const preloadImageWithRetry = useCallback(async (
    imageUrl: string,
    options: PreloadOptions = {}
  ): Promise<void> => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const imageKey = imageUrl;
    
    // Skip if already preloaded or currently loading
    if (preloadedImages.has(imageKey) || loadingImagesRef.current.has(imageKey)) {
      return;
    }

    // Add to loading set
    loadingImagesRef.current.add(imageKey);
    
    // Create abort controller for this request
    const abortController = new AbortController();
    abortControllersRef.current.set(imageKey, abortController);

    // Initialize loading state
    setLoadingStates(prev => new Map(prev).set(imageKey, {
      status: 'loading',
      retryCount: 0
    }));

    const attemptLoad = async (retryCount: number): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        if (abortController.signal.aborted) {
          reject(new Error('Aborted'));
          return;
        }

        const img = new Image();
        
        // Set priority loading for critical images
        if (opts.priority) {
          img.loading = 'eager';
          img.fetchPriority = 'high';
        }

        img.onload = () => {
          if (abortController.signal.aborted) {
            reject(new Error('Aborted'));
            return;
          }

          // Store the image element for potential reuse
          imageElementsRef.current.set(imageKey, img);
          
          // Update preloaded set
          setPreloadedImages(prev => new Set(prev).add(imageKey));
          
          // Update loading state
          setLoadingStates(prev => new Map(prev).set(imageKey, {
            status: 'loaded',
            retryCount
          }));
          
          // Remove from loading set and cleanup
          loadingImagesRef.current.delete(imageKey);
          abortControllersRef.current.delete(imageKey);
          
          resolve();
        };

        img.onerror = (error) => {
          if (abortController.signal.aborted) {
            reject(new Error('Aborted'));
            return;
          }

          const errorMessage = `Failed to load image: ${imageUrl} (attempt ${retryCount + 1})`;
          console.warn(errorMessage, error);

          // Update loading state with error
          setLoadingStates(prev => new Map(prev).set(imageKey, {
            status: 'error',
            retryCount,
            lastError: errorMessage
          }));

          if (retryCount < opts.maxRetries) {
            // Retry after delay
            setTimeout(() => {
              if (!abortController.signal.aborted) {
                attemptLoad(retryCount + 1).then(resolve).catch(reject);
              } else {
                reject(new Error('Aborted'));
              }
            }, opts.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
          } else {
            // Max retries reached, try fallback
            if (opts.fallbackUrl && imageUrl !== opts.fallbackUrl) {
              console.warn(`Max retries reached for ${imageUrl}, trying fallback`);
              img.src = opts.fallbackUrl;
            } else {
              // Remove from loading set and cleanup
              loadingImagesRef.current.delete(imageKey);
              abortControllersRef.current.delete(imageKey);
              reject(new Error(errorMessage));
            }
          }
        };

        // Start loading the image
        img.src = imageUrl;
      });
    };

    try {
      await attemptLoad(0);
    } catch (error) {
      // Final cleanup on error
      loadingImagesRef.current.delete(imageKey);
      abortControllersRef.current.delete(imageKey);
      
      if (error instanceof Error && error.message !== 'Aborted') {
        console.warn('Image preload failed after all retries:', error);
      }
    }
  }, [preloadedImages]);

  const preloadImage = useCallback(async (imageRef: string): Promise<void> => {
    // For backward compatibility, treat imageRef as a direct URL
    return preloadImageWithRetry(imageRef);
  }, [preloadImageWithRetry]);

  const preloadSanityImage = useCallback(async (
    image: SanityImage,
    options: PreloadOptions = {}
  ): Promise<void> => {
    const urls = generateImageUrls(image);
    if (!urls) {
      throw new Error('Failed to generate image URLs');
    }

    // Preload the optimized version by default
    return preloadImageWithRetry(urls.optimized, options);
  }, [generateImageUrls, preloadImageWithRetry]);

  const isImagePreloaded = useCallback((imageRef: string): boolean => {
    return preloadedImages.has(imageRef);
  }, [preloadedImages]);

  const getImageLoadState = useCallback((imageRef: string): ImageLoadState => {
    const state = loadingStates.get(imageRef);
    return state?.status || 'loading';
  }, [loadingStates]);

  const preloadNextImages = useCallback(async (
    currentIndex: number, 
    sections: CarouselSection[]
  ): Promise<void> => {
    const preloadPromises: Promise<void>[] = [];
    
    // Preload current section image with high priority
    const currentSection = sections[currentIndex];
    if (currentSection?.backgroundImage) {
      preloadPromises.push(
        preloadSanityImage(currentSection.backgroundImage, { priority: true })
      );
    }
    
    // Preload next section image
    const nextSection = sections[currentIndex + 1];
    if (nextSection?.backgroundImage) {
      preloadPromises.push(
        preloadSanityImage(nextSection.backgroundImage, { priority: false })
      );
    }
    
    // Preload previous section image (for backward navigation)
    const prevSection = sections[currentIndex - 1];
    if (prevSection?.backgroundImage) {
      preloadPromises.push(
        preloadSanityImage(prevSection.backgroundImage, { priority: false })
      );
    }

    // Execute all preloads concurrently
    try {
      await Promise.allSettled(preloadPromises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }, [preloadSanityImage]);

  const cancelPreload = useCallback((imageRef: string) => {
    const controller = abortControllersRef.current.get(imageRef);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(imageRef);
      loadingImagesRef.current.delete(imageRef);
    }
  }, []);

  const clearPreloadCache = useCallback(() => {
    cleanup();
    setPreloadedImages(new Set());
    setLoadingStates(new Map());
    imageElementsRef.current.clear();
  }, [cleanup]);

  return {
    preloadedImages,
    preloadImage,
    preloadSanityImage,
    isImagePreloaded,
    getImageLoadState,
    preloadNextImages,
    cancelPreload,
    clearPreloadCache,
    loadingStates,
  };
}