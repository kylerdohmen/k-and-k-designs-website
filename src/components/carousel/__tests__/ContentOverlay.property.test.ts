/**
 * ContentOverlay Property-Based Tests
 * 
 * Property-based tests for the ContentOverlay component that validate
 * universal properties across all possible inputs and configurations.
 */

import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ContentOverlay } from '../ContentOverlay';
import { PortableTextBlock } from '@/types/sanity.types';

// Mock the carousel utils for property tests
jest.mock('@/lib/carousel-utils', () => ({
  parsePortableTextContent: jest.fn((blocks: PortableTextBlock[]) => ({
    html: blocks.map(block => 
      block.children?.map(child => child.text).join('') || ''
    ).join('<br>'),
    plainText: blocks.map(block => 
      block.children?.map(child => child.text).join('') || ''
    ).join('\n'),
    wordCount: Math.max(1, blocks.length * 5),
    estimatedReadTime: 1,
  })),
}));

describe('ContentOverlay Property Tests', () => {
  // Generators for test data
  const portableTextBlockGen = fc.record({
    _type: fc.constant('block'),
    _key: fc.string({ minLength: 1, maxLength: 20 }),
    style: fc.oneof(fc.constant('normal'), fc.constant('h2'), fc.constant('h3')),
    children: fc.array(
      fc.record({
        _type: fc.constant('span' as const),
        _key: fc.string({ minLength: 1, maxLength: 20 }),
        text: fc.string({ minLength: 0, maxLength: 200 }),
        marks: fc.array(fc.oneof(fc.constant('strong'), fc.constant('em')), { maxLength: 2 }),
      }),
      { minLength: 0, maxLength: 5 }
    ),
  });

  const contentOverlayPropsGen = fc.record({
    content: fc.array(portableTextBlockGen, { maxLength: 10 }),
    heading: fc.string({ minLength: 1, maxLength: 100 }),
    subheading: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
    progress: fc.float({ min: 0, max: 2, noNaN: true }),
    isActive: fc.boolean(),
    className: fc.option(fc.string({ maxLength: 50 })),
  });

  /**
   * Property 4: Content Updates Without Layout Shift
   * **Validates: Requirements 2.3**
   * 
   * For any content change within a carousel section, text, headings, and 
   * interactive elements should update without causing cumulative layout 
   * shift or visual disruption.
   */
  test('Property 4: Content updates without layout shift', () => {
    fc.assert(
      fc.property(
        contentOverlayPropsGen,
        contentOverlayPropsGen,
        (initialProps, updatedProps) => {
          // Render initial content
          const { container: initialContainer, rerender } = render(
            React.createElement(ContentOverlay, initialProps)
          );
          
          // Capture initial layout measurements
          const initialElement = initialContainer.firstChild as HTMLElement;
          const initialRect = {
            width: initialElement.offsetWidth,
            height: initialElement.offsetHeight,
            position: window.getComputedStyle(initialElement).position,
          };
          
          // Update content
          rerender(React.createElement(ContentOverlay, updatedProps));
          
          // Verify element still exists and is properly structured
          const updatedElement = initialContainer.firstChild as HTMLElement;
          expect(updatedElement).toBeInTheDocument();
          
          // Verify no layout shift indicators
          // 1. Element maintains consistent positioning strategy
          const updatedPosition = window.getComputedStyle(updatedElement).position;
          expect(updatedPosition).toBe(initialRect.position);
          
          // 2. Element maintains proper CSS classes for layout stability
          expect(updatedElement).toHaveClass('relative', 'z-10', 'flex', 'flex-col');
          
          // 3. Content container maintains max-width constraint
          const contentContainer = updatedElement.querySelector('.max-w-4xl');
          expect(contentContainer).toBeInTheDocument();
          
          // 4. Typography maintains responsive classes
          const heading = updatedElement.querySelector('h2');
          if (heading) {
            expect(heading).toHaveClass('leading-tight', 'tracking-tight');
          }
          
          // 5. Animations use transform/opacity (not layout-affecting properties)
          const style = updatedElement.style;
          if (style.transform || style.opacity) {
            // If animations are applied, they should use transform/opacity
            expect(style.transform).toMatch(/translateY|translate3d|none/);
            expect(parseFloat(style.opacity || '1')).toBeGreaterThanOrEqual(0);
            expect(parseFloat(style.opacity || '1')).toBeLessThanOrEqual(1);
          }
          
          // 6. No unexpected layout-affecting CSS properties
          const computedStyle = window.getComputedStyle(updatedElement);
          // In test environment, computed styles might be empty, so we check if they exist
          if (computedStyle.position) {
            expect(computedStyle.position).toMatch(/relative|absolute|fixed|static/);
          }
          if (computedStyle.display) {
            expect(computedStyle.display).not.toBe('none');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Animation Values Consistency
   * 
   * For any progress value and active state, animation values should be
   * mathematically consistent and within expected bounds.
   */
  test('Property: Animation values remain consistent and bounded', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 2, noNaN: true }),
        fc.boolean(),
        contentOverlayPropsGen,
        (progress, isActive, props) => {
          const testProps = { ...props, progress, isActive };
          const { container } = render(React.createElement(ContentOverlay, testProps));
          
          const element = container.firstChild as HTMLElement;
          const style = element.style;
          
          // Opacity should be between 0 and 1
          if (style.opacity) {
            const opacity = parseFloat(style.opacity);
            expect(opacity).toBeGreaterThanOrEqual(0);
            expect(opacity).toBeLessThanOrEqual(1);
          }
          
          // Transform should be valid CSS
          if (style.transform) {
            expect(style.transform).toMatch(/translateY\(-?\d+(\.\d+)?px\)/);
          }
          
          // When inactive, opacity should be 0
          if (!isActive) {
            expect(style.opacity).toBe('0');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Step Number Extraction Consistency
   * 
   * For any heading string, step number extraction should be consistent
   * and handle edge cases properly.
   */
  test('Property: Step number extraction handles all heading formats', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        contentOverlayPropsGen,
        (heading, props) => {
          const testProps = { ...props, heading };
          const { container } = render(React.createElement(ContentOverlay, testProps));
          
          const headingElement = container.querySelector('h2');
          expect(headingElement).toBeInTheDocument();
          
          // Check if heading follows step pattern (XX Title)
          const stepMatch = heading.match(/^(\d{2})\s+(.+)$/);
          
          if (stepMatch) {
            // Should have step number displayed
            const stepNumber = container.querySelector('.text-6xl, .sm\\:text-7xl, .lg\\:text-8xl');
            expect(stepNumber).toBeInTheDocument();
            expect(stepNumber?.textContent).toBe(stepMatch[1]);
            
            // Heading should show title without step number
            expect(headingElement?.textContent).toBe(stepMatch[2]);
          } else {
            // Should show full heading
            expect(headingElement?.textContent).toBe(heading);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Content Rendering Safety
   * 
   * For any portable text content, the component should render safely
   * without throwing errors or creating invalid HTML.
   */
  test('Property: Content renders safely for all portable text inputs', () => {
    fc.assert(
      fc.property(
        fc.array(portableTextBlockGen, { maxLength: 20 }),
        contentOverlayPropsGen,
        (content, props) => {
          const testProps = { ...props, content };
          
          // Should not throw during render
          expect(() => {
            render(React.createElement(ContentOverlay, testProps));
          }).not.toThrow();
          
          const { container } = render(React.createElement(ContentOverlay, testProps));
          
          // Should always render the main container
          expect(container.firstChild).toBeInTheDocument();
          
          // Should always render heading
          const heading = container.querySelector('h2');
          expect(heading).toBeInTheDocument();
          
          // If content exists, should render content area
          if (content.length > 0) {
            const contentArea = container.querySelector('.prose');
            expect(contentArea).toBeInTheDocument();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Responsive Classes Consistency
   * 
   * For any props combination, responsive classes should be consistently
   * applied and follow the design system patterns.
   */
  test('Property: Responsive classes are consistently applied', () => {
    fc.assert(
      fc.property(
        contentOverlayPropsGen,
        (props) => {
          const { container } = render(React.createElement(ContentOverlay, props));
          
          const element = container.firstChild as HTMLElement;
          
          // Main container should have responsive padding
          expect(element).toHaveClass('px-6', 'sm:px-8', 'lg:px-12');
          
          // Should have flex layout classes
          expect(element).toHaveClass('flex', 'flex-col', 'justify-center');
          
          // Heading should have responsive typography
          const heading = element.querySelector('h2');
          if (heading) {
            expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'lg:text-5xl', 'xl:text-6xl');
          }
          
          // Content container should have max-width
          const contentContainer = element.querySelector('.max-w-4xl');
          expect(contentContainer).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });
});