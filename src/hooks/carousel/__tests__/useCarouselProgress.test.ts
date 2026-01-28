/**
 * Unit Tests for useCarouselProgress Hook
 * 
 * Tests specific scenarios for scroll distance to section progress calculation,
 * bidirectional scroll handling, and progress state management.
 */

import { renderHook, act } from '@testing-library/react';
import { useCarouselProgress } from '../useCarouselProgress';

describe('useCarouselProgress', () => {
  const defaultOptions = {
    totalSections: 3,
    scrollSensitivity: 1.0,
  };

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(0);
      expect(result.current.direction).toBe('forward');
    });
  });

  describe('progress calculation', () => {
    it('should calculate progress correctly for forward scroll', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(50); // Half of scroll threshold (100)
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0.5);
      expect(result.current.totalProgress).toBe(0.5);
      expect(result.current.direction).toBe('forward');
    });

    it('should progress to next section when threshold is reached', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(100); // Full scroll threshold
      });

      expect(result.current.currentSection).toBe(1);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(1);
    });

    it('should handle partial progress in second section', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(150); // 1.5 sections worth of scroll
      });

      expect(result.current.currentSection).toBe(1);
      expect(result.current.sectionProgress).toBe(0.5);
      expect(result.current.totalProgress).toBe(1.5);
    });

    describe('progress calculation accuracy', () => {
      it('should calculate precise fractional progress values', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Test various precise fractional values
        const testCases = [
          { scroll: 33.33, expectedSection: 0, expectedSectionProgress: 0.3333, expectedTotal: 0.3333 },
          { scroll: 66.67, expectedSection: 0, expectedSectionProgress: 0.6667, expectedTotal: 0.6667 },
          { scroll: 133.33, expectedSection: 1, expectedSectionProgress: 0.3333, expectedTotal: 1.3333 },
          { scroll: 266.67, expectedSection: 2, expectedSectionProgress: 0.6667, expectedTotal: 2.6667 },
        ];

        testCases.forEach(({ scroll, expectedSection, expectedSectionProgress, expectedTotal }) => {
          act(() => {
            result.current.reset();
            result.current.updateProgress(scroll);
          });

          expect(result.current.currentSection).toBe(expectedSection);
          expect(result.current.sectionProgress).toBeCloseTo(expectedSectionProgress, 4);
          expect(result.current.totalProgress).toBeCloseTo(expectedTotal, 4);
        });
      });

      it('should maintain calculation accuracy with very small increments', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Build up progress with very small increments
        for (let i = 0; i < 100; i++) {
          act(() => {
            result.current.updateProgress(1); // 1 pixel at a time
          });
        }

        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(1);
      });

      it('should maintain accuracy with mixed positive and negative deltas', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Complex sequence of forward and backward movements
        const movements = [50, -10, 30, -5, 25, -15, 40];
        let expectedAccumulated = 0;

        movements.forEach(delta => {
          act(() => {
            result.current.updateProgress(delta);
          });
          expectedAccumulated += delta;
          
          const expectedTotal = Math.max(0, Math.min(3, expectedAccumulated / 100));
          expect(result.current.totalProgress).toBeCloseTo(expectedTotal, 4);
        });

        // Final state should be: 50-10+30-5+25-15+40 = 115
        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBeCloseTo(0.15, 4);
        expect(result.current.totalProgress).toBeCloseTo(1.15, 4);
      });

      it('should calculate accurate progress with different scroll sensitivities', () => {
        const sensitivities = [0.5, 1.0, 1.5, 2.0, 3.0];
        
        sensitivities.forEach(sensitivity => {
          const { result } = renderHook(() => 
            useCarouselProgress({ ...defaultOptions, scrollSensitivity: sensitivity })
          );

          act(() => {
            result.current.updateProgress(50); // Base scroll amount
          });

          const expectedProgress = (50 * sensitivity) / 100;
          const clampedProgress = Math.max(0, Math.min(3, expectedProgress));
          
          expect(result.current.totalProgress).toBeCloseTo(clampedProgress, 4);
          
          if (clampedProgress < 1) {
            expect(result.current.currentSection).toBe(0);
            expect(result.current.sectionProgress).toBeCloseTo(clampedProgress, 4);
          } else if (clampedProgress < 2) {
            expect(result.current.currentSection).toBe(1);
            expect(result.current.sectionProgress).toBeCloseTo(clampedProgress - 1, 4);
          } else {
            expect(result.current.currentSection).toBe(2);
            expect(result.current.sectionProgress).toBeCloseTo(Math.min(1, clampedProgress - 2), 4);
          }
        });
      });

      it('should handle floating point precision correctly', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Test with values that might cause floating point precision issues
        const precisionTestCases = [
          0.1 + 0.2, // Classic floating point issue (0.30000000000000004)
          1.0 / 3.0, // Repeating decimal
          Math.PI / 100, // Irrational number
          Math.sqrt(2) / 100, // Another irrational
        ];

        precisionTestCases.forEach(scroll => {
          act(() => {
            result.current.reset();
            result.current.updateProgress(scroll * 100); // Scale to meaningful scroll amount
          });

          // Should handle these without NaN or unexpected values
          expect(result.current.currentSection).toBeGreaterThanOrEqual(0);
          expect(result.current.currentSection).toBeLessThan(3);
          expect(result.current.sectionProgress).toBeGreaterThanOrEqual(0);
          expect(result.current.sectionProgress).toBeLessThanOrEqual(1);
          expect(result.current.totalProgress).toBeGreaterThanOrEqual(0);
          expect(result.current.totalProgress).toBeLessThanOrEqual(3);
          
          // Values should be finite numbers
          expect(Number.isFinite(result.current.currentSection)).toBe(true);
          expect(Number.isFinite(result.current.sectionProgress)).toBe(true);
          expect(Number.isFinite(result.current.totalProgress)).toBe(true);
        });
      });

      it('should maintain consistency between currentSection, sectionProgress, and totalProgress', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Test various scroll amounts
        const scrollAmounts = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300];

        scrollAmounts.forEach(scroll => {
          act(() => {
            result.current.reset();
            result.current.updateProgress(scroll);
          });

          // Verify the relationship: totalProgress = currentSection + sectionProgress
          const calculatedTotal = result.current.currentSection + result.current.sectionProgress;
          expect(result.current.totalProgress).toBeCloseTo(calculatedTotal, 10);

          // Verify section progress is always between 0 and 1
          expect(result.current.sectionProgress).toBeGreaterThanOrEqual(0);
          expect(result.current.sectionProgress).toBeLessThanOrEqual(1);

          // Verify current section is within valid range
          expect(result.current.currentSection).toBeGreaterThanOrEqual(0);
          expect(result.current.currentSection).toBeLessThan(defaultOptions.totalSections);
        });
      });

      it('should handle last section progress calculation accurately', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Test progress within the last section
        const lastSectionTests = [
          { scroll: 200, expectedSectionProgress: 0 },
          { scroll: 225, expectedSectionProgress: 0.25 },
          { scroll: 250, expectedSectionProgress: 0.5 },
          { scroll: 275, expectedSectionProgress: 0.75 },
          { scroll: 300, expectedSectionProgress: 1 },
          { scroll: 350, expectedSectionProgress: 1 }, // Clamped
        ];

        lastSectionTests.forEach(({ scroll, expectedSectionProgress }) => {
          act(() => {
            result.current.reset();
            result.current.updateProgress(scroll);
          });

          expect(result.current.currentSection).toBe(2); // Last section
          expect(result.current.sectionProgress).toBeCloseTo(expectedSectionProgress, 4);
        });
      });
    });
  });

  describe('bidirectional scroll handling', () => {
    it('should handle backward scroll correctly', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      // First scroll forward
      act(() => {
        result.current.updateProgress(150);
      });

      // Then scroll backward
      act(() => {
        result.current.updateProgress(-50);
      });

      expect(result.current.currentSection).toBe(1);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(1);
      expect(result.current.direction).toBe('backward');
    });

    it('should return to previous section when scrolling backward', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      // Scroll to second section
      act(() => {
        result.current.updateProgress(100);
      });

      // Scroll backward to first section
      act(() => {
        result.current.updateProgress(-100);
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(0);
      expect(result.current.direction).toBe('backward');
    });

    describe('comprehensive backward scroll progression', () => {
      it('should handle backward progression through multiple sections', () => {
        const onSectionChange = jest.fn();
        const { result } = renderHook(() => 
          useCarouselProgress({ ...defaultOptions, onSectionChange })
        );

        // Start at the end
        act(() => {
          result.current.updateProgress(300);
        });

        expect(result.current.currentSection).toBe(2);
        // onSectionChange is called only when section changes, not for each section passed through
        // The hook implementation only tracks the final section change
        expect(onSectionChange).toHaveBeenCalledWith(2);
        onSectionChange.mockClear();

        // Scroll backward through section 2
        act(() => {
          result.current.updateProgress(-50);
        });

        expect(result.current.currentSection).toBe(2);
        expect(result.current.sectionProgress).toBe(0.5);
        expect(result.current.totalProgress).toBe(2.5);
        expect(result.current.direction).toBe('backward');

        // Continue backward to section 1
        act(() => {
          result.current.updateProgress(-50);
        });

        expect(result.current.currentSection).toBe(2);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(2);

        // Cross boundary to section 1
        act(() => {
          result.current.updateProgress(-1);
        });

        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBe(0.99);
        expect(result.current.totalProgress).toBe(1.99);
        expect(onSectionChange).toHaveBeenCalledWith(1);
        expect(onSectionChange).toHaveBeenCalledTimes(1);
      });

      it('should handle rapid backward scroll direction changes', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Start in middle section
        act(() => {
          result.current.updateProgress(150);
        });

        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBe(0.5);

        // Rapid direction changes
        act(() => {
          result.current.updateProgress(-25); // Backward
        });
        expect(result.current.direction).toBe('backward');
        expect(result.current.sectionProgress).toBe(0.25);

        act(() => {
          result.current.updateProgress(10); // Forward
        });
        expect(result.current.direction).toBe('forward');
        expect(result.current.sectionProgress).toBeCloseTo(0.35, 4);

        act(() => {
          result.current.updateProgress(-5); // Backward again
        });
        expect(result.current.direction).toBe('backward');
        expect(result.current.sectionProgress).toBeCloseTo(0.3, 4);
      });

      it('should maintain accurate progress during backward scroll with sensitivity', () => {
        const { result } = renderHook(() => 
          useCarouselProgress({ ...defaultOptions, scrollSensitivity: 2.0 })
        );

        // Forward with sensitivity
        act(() => {
          result.current.updateProgress(75); // 75 * 2 = 150
        });

        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBe(0.5);
        expect(result.current.totalProgress).toBe(1.5);

        // Backward with sensitivity
        act(() => {
          result.current.updateProgress(-25); // -25 * 2 = -50
        });

        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(1);
        expect(result.current.direction).toBe('backward');
      });

      it('should handle backward scroll from partial section progress', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Get to middle of section 1
        act(() => {
          result.current.updateProgress(75);
        });

        expect(result.current.currentSection).toBe(0);
        expect(result.current.sectionProgress).toBe(0.75);

        // Scroll backward within same section
        act(() => {
          result.current.updateProgress(-25);
        });

        expect(result.current.currentSection).toBe(0);
        expect(result.current.sectionProgress).toBe(0.5);
        expect(result.current.totalProgress).toBe(0.5);
        expect(result.current.direction).toBe('backward');

        // Continue backward to cross section boundary
        act(() => {
          result.current.updateProgress(-75);
        });

        expect(result.current.currentSection).toBe(0);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(0);
      });

      it('should handle backward scroll triggering section change callbacks', () => {
        const onSectionChange = jest.fn();
        const { result } = renderHook(() => 
          useCarouselProgress({ ...defaultOptions, onSectionChange })
        );

        // Start at section 2
        act(() => {
          result.current.updateProgress(200);
        });

        // onSectionChange is called only for the final section change
        expect(onSectionChange).toHaveBeenCalledWith(2);
        onSectionChange.mockClear();

        // Scroll backward to trigger section change
        act(() => {
          result.current.updateProgress(-101); // Cross boundary: 200 - 101 = 99
        });

        expect(result.current.currentSection).toBe(0); // 99 / 100 = 0.99, so section 0
        expect(onSectionChange).toHaveBeenCalledWith(0);
        expect(onSectionChange).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('boundary conditions', () => {
    it('should not go below zero progress', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(-200); // Large negative scroll
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(0);
    });

    it('should not exceed maximum progress', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(500); // Scroll beyond all sections
      });

      expect(result.current.currentSection).toBe(2); // Last section (0-indexed)
      expect(result.current.sectionProgress).toBe(1); // Capped at 1
      expect(result.current.totalProgress).toBe(3); // Total sections
    });

    it('should handle completion at the end of last section', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, onComplete })
      );

      act(() => {
        result.current.updateProgress(300); // Complete all sections
      });

      expect(result.current.currentSection).toBe(2);
      expect(result.current.sectionProgress).toBe(1);
      expect(onComplete).toHaveBeenCalled();
    });

    describe('start boundary conditions', () => {
      it('should handle exact start of first section', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Should remain at start even with zero delta
        act(() => {
          result.current.updateProgress(0);
        });

        expect(result.current.currentSection).toBe(0);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(0);
      });

      it('should handle minimal forward progress from start', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        act(() => {
          result.current.updateProgress(0.1); // Minimal scroll
        });

        expect(result.current.currentSection).toBe(0);
        expect(result.current.sectionProgress).toBe(0.001);
        expect(result.current.totalProgress).toBe(0.001);
      });

      it('should handle backward scroll from start position', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        act(() => {
          result.current.updateProgress(-50); // Backward from start
        });

        expect(result.current.currentSection).toBe(0);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(0);
        expect(result.current.direction).toBe('backward');
      });
    });

    describe('end boundary conditions', () => {
      it('should handle exact end of last section', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        act(() => {
          result.current.updateProgress(300); // Exactly at end
        });

        expect(result.current.currentSection).toBe(2);
        expect(result.current.sectionProgress).toBe(1);
        expect(result.current.totalProgress).toBe(3);
      });

      it('should handle excessive forward scroll beyond end', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        act(() => {
          result.current.updateProgress(1000); // Way beyond end
        });

        expect(result.current.currentSection).toBe(2);
        expect(result.current.sectionProgress).toBe(1);
        expect(result.current.totalProgress).toBe(3);
      });

      it('should handle backward scroll from end position', () => {
        const onComplete = jest.fn();
        const { result } = renderHook(() => 
          useCarouselProgress({ ...defaultOptions, onComplete })
        );

        // First reach the end
        act(() => {
          result.current.updateProgress(300);
        });

        expect(onComplete).toHaveBeenCalledTimes(1);

        // Then scroll backward slightly
        act(() => {
          result.current.updateProgress(-10);
        });

        expect(result.current.currentSection).toBe(2);
        expect(result.current.sectionProgress).toBeCloseTo(0.9, 4);
        expect(result.current.totalProgress).toBeCloseTo(2.9, 4);
        expect(result.current.direction).toBe('backward');
      });
    });

    describe('section transition boundaries', () => {
      it('should handle exact section boundary transitions', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Exactly at section 1 boundary
        act(() => {
          result.current.updateProgress(100);
        });

        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(1);

        // Exactly at section 2 boundary
        act(() => {
          result.current.updateProgress(100);
        });

        expect(result.current.currentSection).toBe(2);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(2);
      });

      it('should handle fractional progress near section boundaries', () => {
        const { result } = renderHook(() => useCarouselProgress(defaultOptions));

        // Just before section 1 boundary
        act(() => {
          result.current.updateProgress(99.9);
        });

        expect(result.current.currentSection).toBe(0);
        expect(result.current.sectionProgress).toBeCloseTo(0.999, 4);
        expect(result.current.totalProgress).toBeCloseTo(0.999, 4);

        // Just after section 1 boundary
        act(() => {
          result.current.updateProgress(0.2);
        });

        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBeCloseTo(0.001, 4);
        expect(result.current.totalProgress).toBeCloseTo(1.001, 4);
      });
    });
  });

  describe('scroll sensitivity', () => {
    it('should apply scroll sensitivity correctly', () => {
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, scrollSensitivity: 2.0 })
      );

      act(() => {
        result.current.updateProgress(50); // With 2x sensitivity, this becomes 100
      });

      expect(result.current.currentSection).toBe(1);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(1);
    });

    it('should handle reduced sensitivity', () => {
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, scrollSensitivity: 0.5 })
      );

      act(() => {
        result.current.updateProgress(100); // With 0.5x sensitivity, this becomes 50
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0.5);
      expect(result.current.totalProgress).toBe(0.5);
    });
  });

  describe('callbacks', () => {
    it('should call onSectionChange when section changes', () => {
      const onSectionChange = jest.fn();
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, onSectionChange })
      );

      act(() => {
        result.current.updateProgress(100);
      });

      expect(onSectionChange).toHaveBeenCalledWith(1);
    });

    it('should not call onSectionChange for progress within same section', () => {
      const onSectionChange = jest.fn();
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, onSectionChange })
      );

      act(() => {
        result.current.updateProgress(50);
      });

      act(() => {
        result.current.updateProgress(25);
      });

      expect(onSectionChange).not.toHaveBeenCalled();
    });

    it('should call onComplete when reaching the end', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, onComplete })
      );

      act(() => {
        result.current.updateProgress(300);
      });

      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('reset functionality', () => {
    it('should reset all values to initial state', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      // Progress through sections
      act(() => {
        result.current.updateProgress(150);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(0);
      expect(result.current.direction).toBe('forward');
    });
  });

  describe('edge cases', () => {
    it('should handle single section carousel', () => {
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, totalSections: 1 })
      );

      act(() => {
        result.current.updateProgress(50);
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0.5);
    });

    it('should handle zero scroll delta', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(0);
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(0);
    });

    it('should handle very small scroll deltas', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(1);
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0.01);
      expect(result.current.totalProgress).toBe(0.01);
    });

    it('should handle extremely large scroll values', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(Number.MAX_SAFE_INTEGER);
      });

      // Should be clamped to maximum values
      expect(result.current.currentSection).toBe(2);
      expect(result.current.sectionProgress).toBe(1);
      expect(result.current.totalProgress).toBe(3);
    });

    it('should handle extremely negative scroll values', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      // Start somewhere in the middle
      act(() => {
        result.current.updateProgress(150);
      });

      // Apply extremely negative scroll
      act(() => {
        result.current.updateProgress(-Number.MAX_SAFE_INTEGER);
      });

      // Should be clamped to minimum values
      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(0);
    });

    it('should handle zero sensitivity gracefully', () => {
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, scrollSensitivity: 0 })
      );

      act(() => {
        result.current.updateProgress(1000); // Large scroll with zero sensitivity
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(0);
    });

    it('should handle negative sensitivity', () => {
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, scrollSensitivity: -1.0 })
      );

      // Forward scroll with negative sensitivity should go backward
      act(() => {
        result.current.updateProgress(100);
      });

      expect(result.current.currentSection).toBe(0);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(0);
      expect(result.current.direction).toBe('backward');
    });

    it('should handle very high sensitivity values', () => {
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, scrollSensitivity: 100.0 })
      );

      act(() => {
        result.current.updateProgress(1); // 1 * 100 = 100, which is exactly one section
      });

      // Should progress exactly one section
      expect(result.current.currentSection).toBe(1);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(1);
    });

    it('should maintain state consistency after multiple resets', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      // Progress, reset, progress, reset multiple times
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.updateProgress(150);
        });

        expect(result.current.currentSection).toBe(1);
        expect(result.current.sectionProgress).toBe(0.5);

        act(() => {
          result.current.reset();
        });

        expect(result.current.currentSection).toBe(0);
        expect(result.current.sectionProgress).toBe(0);
        expect(result.current.totalProgress).toBe(0);
        expect(result.current.direction).toBe('forward');
      }
    });

    it('should handle rapid alternating scroll directions', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      // Start in middle
      act(() => {
        result.current.updateProgress(150);
      });

      // Rapid alternating directions
      const directions = [10, -5, 15, -8, 12, -3, 20, -10];
      let expectedAccumulated = 150;

      directions.forEach(delta => {
        act(() => {
          result.current.updateProgress(delta);
        });
        expectedAccumulated += delta;
        
        const expectedTotal = Math.max(0, Math.min(3, expectedAccumulated / 100));
        expect(result.current.totalProgress).toBeCloseTo(expectedTotal, 4);
        
        // Direction should match the last delta
        expect(result.current.direction).toBe(delta > 0 ? 'forward' : 'backward');
      });
    });

    it('should handle section boundary edge cases with callbacks', () => {
      const onSectionChange = jest.fn();
      const onComplete = jest.fn();
      const { result } = renderHook(() => 
        useCarouselProgress({ ...defaultOptions, onSectionChange, onComplete })
      );

      // Test exact boundary crossing
      act(() => {
        result.current.updateProgress(99.999); // Just before boundary
      });
      expect(result.current.currentSection).toBe(0);
      expect(onSectionChange).not.toHaveBeenCalled();

      act(() => {
        result.current.updateProgress(0.001); // Cross boundary
      });
      expect(result.current.currentSection).toBe(1);
      expect(onSectionChange).toHaveBeenCalledWith(1);

      // Test completion boundary
      act(() => {
        result.current.updateProgress(199.999); // Just before completion
      });
      expect(result.current.currentSection).toBe(2);
      expect(result.current.sectionProgress).toBeCloseTo(0.99999, 4);
      expect(onComplete).not.toHaveBeenCalled();

      act(() => {
        result.current.updateProgress(0.001); // Complete
      });
      expect(result.current.sectionProgress).toBe(1);
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('accumulated scroll behavior', () => {
    it('should accumulate multiple small scrolls', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      // Multiple small scrolls that add up to one section
      act(() => {
        result.current.updateProgress(25);
        result.current.updateProgress(25);
        result.current.updateProgress(25);
        result.current.updateProgress(25);
      });

      expect(result.current.currentSection).toBe(1);
      expect(result.current.sectionProgress).toBe(0);
      expect(result.current.totalProgress).toBe(1);
    });

    it('should handle mixed forward and backward scrolls', () => {
      const { result } = renderHook(() => useCarouselProgress(defaultOptions));

      act(() => {
        result.current.updateProgress(100); // Forward to section 1
        result.current.updateProgress(-50); // Back halfway
        result.current.updateProgress(100); // Forward again
      });

      expect(result.current.currentSection).toBe(1);
      expect(result.current.sectionProgress).toBe(0.5);
      expect(result.current.totalProgress).toBe(1.5);
    });
  });
});