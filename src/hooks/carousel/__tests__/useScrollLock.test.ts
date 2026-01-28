/**
 * useScrollLock Hook Tests
 * 
 * Unit tests for the useScrollLock custom hook that manages scroll lock
 * functionality in the carousel component.
 */

import { renderHook, act } from '@testing-library/react';
import { useScrollLock } from '../useScrollLock';

// Mock the throttle utility
jest.mock('@/lib/carousel-utils', () => ({
  throttle: jest.fn((fn) => fn), // Return the function as-is for testing
}));

// Mock window and document methods
const mockScrollTo = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'pageYOffset', {
  value: 100,
  writable: true,
});

Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

Object.defineProperty(document, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(document, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

// Mock document.body.style
const mockBodyStyle = {
  cssText: '',
  position: '',
  top: '',
  width: '',
  overflow: '',
};

Object.defineProperty(document.body, 'style', {
  value: mockBodyStyle,
  writable: true,
});

describe('useScrollLock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBodyStyle.cssText = '';
    mockBodyStyle.position = '';
    mockBodyStyle.top = '';
    mockBodyStyle.width = '';
    mockBodyStyle.overflow = '';
    (window as any).pageYOffset = 100;
  });

  it('should initialize with isLocked as false', () => {
    const { result } = renderHook(() => useScrollLock());
    
    expect(result.current.isLocked).toBe(false);
  });

  it('should provide lockScroll and unlockScroll functions', () => {
    const { result } = renderHook(() => useScrollLock());
    
    expect(typeof result.current.lockScroll).toBe('function');
    expect(typeof result.current.unlockScroll).toBe('function');
  });

  describe('lockScroll', () => {
    it('should set isLocked to true when called', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      expect(result.current.isLocked).toBe(true);
    });

    it('should apply scroll lock styles to document.body', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      expect(mockBodyStyle.position).toBe('fixed');
      expect(mockBodyStyle.top).toBe('-100px');
      expect(mockBodyStyle.width).toBe('100%');
      expect(mockBodyStyle.overflow).toBe('hidden');
    });

    it('should add event listeners for scroll prevention', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'wheel',
        expect.any(Function),
        { passive: false, capture: true }
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function),
        { passive: false, capture: true }
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
        { passive: false, capture: true }
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        { passive: false }
      );
    });

    it('should store current scroll position', () => {
      (window as any).pageYOffset = 250;
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      act(() => {
        result.current.unlockScroll();
      });
      
      expect(mockScrollTo).toHaveBeenCalledWith(0, 250);
    });
  });

  describe('unlockScroll', () => {
    it('should set isLocked to false when called', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      expect(result.current.isLocked).toBe(true);
      
      act(() => {
        result.current.unlockScroll();
      });
      
      expect(result.current.isLocked).toBe(false);
    });

    it('should remove event listeners', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      act(() => {
        result.current.unlockScroll();
      });
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'wheel',
        expect.any(Function),
        { capture: true }
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function),
        { capture: true }
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
        { capture: true }
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function)
      );
    });

    it('should restore original body styles', () => {
      mockBodyStyle.cssText = 'original-styles';
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      act(() => {
        result.current.unlockScroll();
      });
      
      expect(mockBodyStyle.cssText).toBe('original-styles');
    });

    it('should restore scroll position', () => {
      (window as any).pageYOffset = 300;
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      act(() => {
        result.current.unlockScroll();
      });
      
      expect(mockScrollTo).toHaveBeenCalledWith(0, 300);
    });
  });

  describe('cleanup', () => {
    it('should unlock scroll on unmount if locked', () => {
      const { result, unmount } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      expect(result.current.isLocked).toBe(true);
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalled();
    });
  });

  describe('scroll event prevention', () => {
    it('should prevent wheel events when locked', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      // Get the wheel event handler that was added
      const wheelHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'wheel'
      )?.[1];
      
      expect(wheelHandler).toBeDefined();
      
      // Create a mock wheel event
      const mockWheelEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
      
      // Call the handler
      wheelHandler(mockWheelEvent);
      
      expect(mockWheelEvent.preventDefault).toHaveBeenCalled();
      expect(mockWheelEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should prevent keyboard scroll events when locked', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      // Get the keyboard event handler that was added
      const keyboardHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )?.[1];
      
      expect(keyboardHandler).toBeDefined();
      
      // Test various scroll keys
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', 'PageDown'];
      
      scrollKeys.forEach(key => {
        const mockKeyboardEvent = {
          key,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        };
        
        keyboardHandler(mockKeyboardEvent);
        
        expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
        expect(mockKeyboardEvent.stopPropagation).toHaveBeenCalled();
      });
    });

    it('should prevent touch scroll events when locked', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      // Get the touch event handler that was added
      const touchHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchmove'
      )?.[1];
      
      expect(touchHandler).toBeDefined();
      
      // Create a mock touch event with single touch
      const mockTouchEvent = {
        touches: [{}], // Single touch
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
      
      // Call the handler
      touchHandler(mockTouchEvent);
      
      expect(mockTouchEvent.preventDefault).toHaveBeenCalled();
      expect(mockTouchEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should allow pinch-to-zoom (multi-touch) when locked', () => {
      const { result } = renderHook(() => useScrollLock());
      
      act(() => {
        result.current.lockScroll();
      });
      
      // Get the touch event handler that was added
      const touchHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchmove'
      )?.[1];
      
      expect(touchHandler).toBeDefined();
      
      // Create a mock touch event with multiple touches (pinch)
      const mockTouchEvent = {
        touches: [{}, {}], // Multi-touch
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
      
      // Call the handler
      touchHandler(mockTouchEvent);
      
      // Should not prevent multi-touch events (pinch-to-zoom)
      expect(mockTouchEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockTouchEvent.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle multiple lock/unlock calls gracefully', () => {
      const { result } = renderHook(() => useScrollLock());
      
      // Multiple locks
      act(() => {
        result.current.lockScroll();
        result.current.lockScroll();
        result.current.lockScroll();
      });
      
      expect(result.current.isLocked).toBe(true);
      
      // Multiple unlocks
      act(() => {
        result.current.unlockScroll();
        result.current.unlockScroll();
        result.current.unlockScroll();
      });
      
      expect(result.current.isLocked).toBe(false);
    });
  });
});