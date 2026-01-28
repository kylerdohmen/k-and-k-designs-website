/**
 * Property-Based Tests for Background Image Display
 * 
 * **Property 2: Background Image Display and Responsiveness**
 * **Validates: Requirements 2.1, 2.4**
 * 
 * For any carousel section and viewport dimensions, the background image should 
 * display uniquely, maintain aspect ratio, cover the full section area, and 
 * adapt appropriately across all responsive breakpoints.
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { render } from '@testing-library/react'
import React from 'react'
import fc from 'fast-check'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage(props: any) {
    return React.createElement('img', {
      src: props.src,
      alt: props.alt,
      className: props.className,
      'data-priority': props.priority,
      'data-quality': props.quality,
      'data-sizes': props.sizes,
      'data-fill': props.fill,
      onLoad: props.onLoad,
      onError: props.onError,
    })
  }
})

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
}))

// Import after mocks
import { BackgroundImage } from '@/components/carousel/BackgroundImage'

// Helper to generate valid Sanity asset references
const validAssetRef = () => fc.oneof(
  // Valid Sanity asset reference format
  fc.tuple(
    fc.constantFrom('image'),
    fc.hexaString({ minLength: 40, maxLength: 40 }),
    fc.integer({ min: 100, max: 4000 }),
    fc.integer({ min: 100, max: 4000 }),
    fc.constantFrom('jpg', 'png', 'webp')
  ).map(([type, hash, width, height, ext]) => 
    `${type}-${hash}-${width}x${height}-${ext}`
  ),
  // Some known valid examples
  fc.constant('image-Tb9Ew8CXIwaY6R1kjMvI0uRR2000x3000-jpg'),
  fc.constant('image-AbCdEf1234567890AbCdEf1234567890AbCdEf12-1920x1080-png')
)

const validImageRecord = () => fc.record({
  asset: fc.record({
    _ref: validAssetRef()
  }),
  alt: fc.option(fc.string({ maxLength: 200 }))
})

// Mock window properties
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1920,
})

const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()
Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
})
Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
})

describe('Property-Based Tests: Background Image Display', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(window as any).innerWidth = 1920
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Property 2: Background Image Display and Responsiveness', () => {
    it('should display unique background images for any carousel section', () => {
      fc.assert(fc.property(
        validImageRecord(),
        fc.boolean(), // isActive
        fc.float({ min: 0, max: 1 }), // progress
        (image, isActive, progress) => {
          const { container } = render(
            React.createElement(BackgroundImage, {
              image: image,
              isActive: isActive,
              progress: progress,
              priority: false
            })
          )

          // Should render with unique image source
          const imgElement = container.querySelector('img')
          expect(imgElement).toBeTruthy()
          expect(imgElement?.src).toContain(image.asset._ref)
          
          // Should have proper alt text
          if (image.alt) {
            expect(imgElement?.alt).toBe(image.alt)
          } else {
            expect(imgElement?.alt).toBe('Carousel background')
          }
        }
      ), { numRuns: 100 })
    })

    it('should maintain aspect ratio and cover full section area across all viewport dimensions', () => {
      fc.assert(fc.property(
        validImageRecord(),
        fc.integer({ min: 320, max: 3840 }), // Viewport width
        fc.boolean(), // isActive
        fc.float({ min: 0, max: 1 }), // progress
        (image, viewportWidth, isActive, progress) => {
          ;(window as any).innerWidth = viewportWidth

          const { container } = render(
            React.createElement(BackgroundImage, {
              image: image,
              isActive: isActive,
              progress: progress
            })
          )

          // Should have absolute positioning to cover full area
          const backgroundDiv = container.firstChild as HTMLElement
          expect(backgroundDiv).toHaveClass('absolute', 'inset-0')

          // Image should have object-cover class for aspect ratio maintenance
          const imgElement = container.querySelector('img')
          expect(imgElement).toHaveClass('object-cover', 'object-center')
          
          // Should have fill prop for Next.js Image
          expect(imgElement?.getAttribute('data-fill')).toBe('true')
          
          // Should have proper sizes attribute for responsive behavior
          expect(imgElement?.getAttribute('data-sizes')).toBe('100vw')
        }
      ), { numRuns: 100 })
    })

    it('should adapt image sources appropriately across all responsive breakpoints', () => {
      fc.assert(fc.property(
        validImageRecord(),
        fc.oneof(
          fc.integer({ min: 320, max: 767 }),   // Mobile
          fc.integer({ min: 768, max: 1023 }),  // Tablet
          fc.integer({ min: 1024, max: 1919 }), // Desktop
          fc.integer({ min: 1920, max: 2559 }), // Large desktop
          fc.integer({ min: 2560, max: 3840 })  // Ultrawide
        ),
        fc.boolean(), // isActive
        fc.float({ min: 0, max: 1 }), // progress
        (image, viewportWidth, isActive, progress) => {
          ;(window as any).innerWidth = viewportWidth

          const { container, rerender } = render(
            React.createElement(BackgroundImage, {
              image: image,
              isActive: isActive,
              progress: progress
            })
          )

          // Trigger resize event to update image URL
          const resizeHandler = mockAddEventListener.mock.calls.find(
            call => call[0] === 'resize'
          )?.[1]
          
          if (resizeHandler) {
            resizeHandler()
          }

          // Re-render to apply the new image URL
          rerender(
            React.createElement(BackgroundImage, {
              image: image,
              isActive: isActive,
              progress: progress
            })
          )

          const imgElement = container.querySelector('img')
          expect(imgElement).toBeTruthy()

          // Verify correct image preset is used based on viewport width
          if (viewportWidth >= 2560) {
            expect(imgElement?.src).toContain('ultrawide')
          } else if (viewportWidth >= 1920) {
            expect(imgElement?.src).toContain('desktop')
          } else if (viewportWidth >= 1024) {
            expect(imgElement?.src).toContain('tablet')
          } else {
            expect(imgElement?.src).toContain('mobile')
          }
        }
      ), { numRuns: 100 })
    })

    it('should handle opacity transitions consistently based on active state and progress', () => {
      fc.assert(fc.property(
        validImageRecord(),
        fc.boolean(), // isActive
        fc.float({ min: 0, max: 1 }), // progress
        (image, isActive, progress) => {
          const { container } = render(
            React.createElement(BackgroundImage, {
              image: image,
              isActive: isActive,
              progress: progress
            })
          )

          const backgroundDiv = container.firstChild as HTMLElement
          const style = backgroundDiv.style
          const opacity = parseFloat(style.opacity || '1')

          if (!isActive) {
            // Inactive images should have 0 opacity
            expect(opacity).toBe(0)
          } else {
            // Active images should have opacity based on progress
            if (progress < 0.1) {
              // Fade in during first 10% of progress
              const expectedOpacity = progress * 10
              expect(opacity).toBeCloseTo(expectedOpacity, 2)
            } else if (progress > 0.9) {
              // Fade out during last 10% of progress
              const expectedOpacity = (1 - progress) * 10
              expect(opacity).toBeCloseTo(expectedOpacity, 2)
            } else {
              // Full opacity in the middle
              expect(opacity).toBe(1)
            }
          }
        }
      ), { numRuns: 100 })
    })

    it('should provide fallback backgrounds consistently when image data is invalid', () => {
      fc.assert(fc.property(
        fc.oneof(
          fc.constant(null), // Null image
          fc.constant(undefined), // Undefined image
          fc.record({ asset: fc.constant(null) }), // Null asset
          fc.record({ asset: fc.record({ _ref: fc.constant('') }) }), // Empty ref
          fc.record({ asset: fc.record({ _ref: fc.constant(undefined) }) }) // Undefined ref
        ),
        fc.boolean(), // isActive
        fc.float({ min: 0, max: 1 }), // progress
        (invalidImage, isActive, progress) => {
          const { container } = render(
            React.createElement(BackgroundImage, {
              image: invalidImage as any,
              isActive: isActive,
              progress: progress
            })
          )

          // Should render fallback gradient background
          const fallbackDiv = container.querySelector('.bg-gradient-to-br')
          expect(fallbackDiv).toBeTruthy()
          expect(fallbackDiv).toHaveClass('from-slate-800', 'via-slate-700', 'to-slate-900')

          // Should not render img element
          const imgElement = container.querySelector('img')
          expect(imgElement).toBeFalsy()
        }
      ), { numRuns: 100 })
    })

    it('should handle image quality and optimization settings consistently', () => {
      fc.assert(fc.property(
        validImageRecord(),
        fc.boolean(), // isActive
        fc.float({ min: 0, max: 1 }), // progress
        fc.boolean(), // priority
        (image, isActive, progress, priority) => {
          const { container } = render(
            React.createElement(BackgroundImage, {
              image: image,
              isActive: isActive,
              progress: progress,
              priority: priority
            })
          )

          const imgElement = container.querySelector('img')
          expect(imgElement).toBeTruthy()

          // Should have consistent quality setting
          expect(imgElement?.getAttribute('data-quality')).toBe('85')

          // Should have proper sizes for responsive behavior
          expect(imgElement?.getAttribute('data-sizes')).toBe('100vw')

          // Should use fill for proper aspect ratio handling
          expect(imgElement?.getAttribute('data-fill')).toBe('true')

          // Priority should be set correctly
          expect(imgElement?.getAttribute('data-priority')).toBe(priority.toString())
        }
      ), { numRuns: 100 })
    })

    it('should handle custom className prop consistently across all states', () => {
      fc.assert(fc.property(
        validImageRecord(),
        fc.boolean(), // isActive
        fc.float({ min: 0, max: 1 }), // progress
        fc.option(fc.string({ minLength: 1, maxLength: 50 })), // className
        (image, isActive, progress, className) => {
          const { container } = render(
            React.createElement(BackgroundImage, {
              image: image,
              isActive: isActive,
              progress: progress,
              className: className
            })
          )

          const backgroundDiv = container.firstChild as HTMLElement
          
          // Should always have base classes
          expect(backgroundDiv).toHaveClass('absolute', 'inset-0', 'overflow-hidden')

          // Should include custom className if provided
          if (className) {
            expect(backgroundDiv).toHaveClass(className)
          }
        }
      ), { numRuns: 100 })
    })
  })
})