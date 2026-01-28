/**
 * Simplified Tests for usePreloader Hook
 * 
 * Basic unit tests for image preloading functionality.
 * Focuses on essential behavior rather than complex property-based testing.
 * **Validates: Requirements 2.2, 2.5**
 */

import { renderHook, act } from '@testing-library/react';
import { usePreloader } from '../usePreloader';

// Mock Sanity image utilities
jest.mock('@/sanity/lib/image', () => ({
  urlForCarouselBackground: jest.fn((image) => ({
    url: () => `https://cdn.sanity.io/optimized/${image.asset._ref}`
  })),
  carouselImagePresets: {
    mobile: jest.fn((image) => ({
      url: () => `https://cdn.sanity.io/mobile/${image.asset._ref}`
    })),
    tablet: jest.fn((image) => ({
      url: () => `https://cdn.sanity.io/tablet/${image.asset._ref}`
    })),
    desktop: jest.fn((image) => ({
      url: () => `https://cdn.sanity.io/desktop/${image.asset._ref}`
    })),
    ultrawide: jest.fn((image) => ({
      url: () => `https://cdn.sanity.io/ultrawide/${image.asset._ref}`
    })),
  }
}));

// Mock Image constructor
const originalImage = global.Image;

beforeEach(() => {
  jest.useFakeTimers();
  
  global.Image = jest.fn(() => {
    const img = {
      onload: null as (() => void) | null,
      onerror: null as ((error: any) => void) | null,
      src: '',
      loading: 'lazy' as 'lazy' | 'eager',
      fetchPriority: 'auto' as 'auto' | 'high' | 'low'
    };
    
    // Simulate successful loading
    setTimeout(() => {
      if (img.onload) {
        img.onload();
      }
    }, 0);
    
    return img;
  }) as any;
  
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
  global.Image = originalImage;
});

describe('usePreloader Hook', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => usePreloader());
    
    expect(result.current.preloadedImages).toBeInstanceOf(Set);
    expect(result.current.preloadedImages.size).toBe(0);
    expect(result.current.loadingStates).toBeInstanceOf(Map);
    expect(result.current.loadingStates.size).toBe(0);
  });

  it('should provide all required methods', () => {
    const { result } = renderHook(() => usePreloader());
    
    expect(typeof result.current.preloadImage).toBe('function');
    expect(typeof result.current.preloadSanityImage).toBe('function');
    expect(typeof result.current.isImagePreloaded).toBe('function');
    expect(typeof result.current.getImageLoadState).toBe('function');
    expect(typeof result.current.preloadNextImages).toBe('function');
    expect(typeof result.current.cancelPreload).toBe('function');
    expect(typeof result.current.clearPreloadCache).toBe('function');
  });

  it('should handle basic image preloading', async () => {
    const { result } = renderHook(() => usePreloader());
    const testUrl = 'https://example.com/test-image.jpg';
    
    await act(() => {
      const promise = result.current.preloadImage(testUrl);
      jest.runAllTimers();
      return promise;
    });
    
    expect(result.current.isImagePreloaded(testUrl)).toBe(true);
  });

  it('should handle Sanity image preloading', async () => {
    const { result } = renderHook(() => usePreloader());
    const testImage = {
      asset: {
        _ref: 'image-test123-1920x1080-jpg',
        _type: 'reference' as const
      },
      _type: 'image' as const
    };
    
    await act(() => {
      const promise = result.current.preloadSanityImage(testImage);
      jest.runAllTimers();
      return promise;
    });
    
    // Should have attempted to preload the optimized version
    expect(global.Image).toHaveBeenCalled();
  });

  it('should handle carousel section preloading', async () => {
    const { result } = renderHook(() => usePreloader());
    const testSections = [
      {
        id: 'section1',
        title: 'Test Section 1',
        heading: 'Test Heading 1',
        content: [],
        backgroundImage: {
          asset: { _ref: 'image-test1-1920x1080-jpg', _type: 'reference' as const },
          _type: 'image' as const
        },
        order: 1
      },
      {
        id: 'section2',
        title: 'Test Section 2',
        heading: 'Test Heading 2',
        content: [],
        backgroundImage: {
          asset: { _ref: 'image-test2-1920x1080-jpg', _type: 'reference' as const },
          _type: 'image' as const
        },
        order: 2
      }
    ];
    
    await act(() => {
      const promise = result.current.preloadNextImages(0, testSections);
      jest.runAllTimers();
      return promise;
    });
    
    // Should have attempted to preload multiple images
    expect(global.Image).toHaveBeenCalledTimes(2);
  });

  it('should clear preload cache', () => {
    const { result } = renderHook(() => usePreloader());
    
    act(() => {
      result.current.clearPreloadCache();
    });
    
    expect(result.current.preloadedImages.size).toBe(0);
    expect(result.current.loadingStates.size).toBe(0);
  });
});