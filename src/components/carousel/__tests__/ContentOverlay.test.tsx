/**
 * ContentOverlay Component Tests
 * 
 * Unit tests for the ContentOverlay component covering:
 * - Basic rendering and content display
 * - Animation based on scroll progress
 * - Step number extraction and display
 * - Responsive typography and spacing
 * - Portable text content rendering
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContentOverlay } from '../ContentOverlay';
import { PortableTextBlock } from '@/types/sanity.types';

// Mock the carousel utils to avoid dependency issues in tests
jest.mock('@/lib/carousel-utils', () => ({
  parsePortableTextContent: jest.fn((blocks: PortableTextBlock[]) => ({
    html: blocks.map(block => 
      block.children?.map(child => child.text).join('') || ''
    ).join('<br>'),
    plainText: blocks.map(block => 
      block.children?.map(child => child.text).join('') || ''
    ).join('\n'),
    wordCount: 10,
    estimatedReadTime: 1,
  })),
}));

describe('ContentOverlay', () => {
  const mockPortableTextContent: PortableTextBlock[] = [
    {
      _type: 'block',
      _key: 'block1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'This is a test content block with some descriptive text.',
          marks: [],
        },
      ],
    },
  ];

  const defaultProps = {
    content: mockPortableTextContent,
    heading: 'Test Heading',
    subheading: 'Test Subheading',
    progress: 0.5,
    isActive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders heading correctly', () => {
      render(<ContentOverlay {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Heading');
    });

    it('renders subheading when provided', () => {
      render(<ContentOverlay {...defaultProps} />);
      expect(screen.getByText('Test Subheading')).toBeInTheDocument();
    });

    it('does not render subheading when not provided', () => {
      render(<ContentOverlay {...defaultProps} subheading="" />);
      expect(screen.queryByText('Test Subheading')).not.toBeInTheDocument();
    });

    it('renders portable text content', () => {
      render(<ContentOverlay {...defaultProps} />);
      expect(screen.getByText(/This is a test content block/)).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(<ContentOverlay {...defaultProps} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Step Number Extraction', () => {
    it('extracts and displays step number from heading', () => {
      render(<ContentOverlay {...defaultProps} heading="01 Choose the right plan" />);
      
      // Should display step number
      expect(screen.getByText('01')).toBeInTheDocument();
      // Should display title without step number
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Choose the right plan');
    });

    it('handles headings without step numbers', () => {
      render(<ContentOverlay {...defaultProps} heading="Regular Heading" />);
      
      // Should not display step number
      expect(screen.queryByText(/^\d{2}$/)).not.toBeInTheDocument();
      // Should display full heading
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Regular Heading');
    });

    it('handles different step number formats', () => {
      render(<ContentOverlay {...defaultProps} heading="02 Get your new SIM card" />);
      
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Get your new SIM card');
    });
  });

  describe('Animation and Progress', () => {
    it('applies correct opacity when active', () => {
      const { container } = render(<ContentOverlay {...defaultProps} isActive={true} progress={0.5} />);
      const overlay = container.firstChild as HTMLElement;
      
      // Should have some opacity when active
      expect(overlay.style.opacity).not.toBe('0');
    });

    it('applies zero opacity when inactive', () => {
      const { container } = render(<ContentOverlay {...defaultProps} isActive={false} progress={0.5} />);
      const overlay = container.firstChild as HTMLElement;
      
      // Should have zero opacity when inactive
      expect(overlay.style.opacity).toBe('0');
    });

    it('applies transform based on progress', () => {
      const { container } = render(<ContentOverlay {...defaultProps} isActive={true} progress={0.3} />);
      const overlay = container.firstChild as HTMLElement;
      
      // Should have translateY transform
      expect(overlay.style.transform).toContain('translateY');
    });

    it('handles edge case progress values', () => {
      // Test progress = 0
      const { rerender, container } = render(<ContentOverlay {...defaultProps} progress={0} />);
      let overlay = container.firstChild as HTMLElement;
      expect(overlay.style.opacity).toBeDefined();

      // Test progress = 1
      rerender(<ContentOverlay {...defaultProps} progress={1} />);
      overlay = container.firstChild as HTMLElement;
      expect(overlay.style.opacity).toBeDefined();

      // Test progress > 1
      rerender(<ContentOverlay {...defaultProps} progress={1.5} />);
      overlay = container.firstChild as HTMLElement;
      expect(overlay.style.opacity).toBeDefined();
    });
  });

  describe('Content Handling', () => {
    it('handles empty content array', () => {
      render(<ContentOverlay {...defaultProps} content={[]} />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('handles multiple content blocks', () => {
      const multipleBlocks: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'First block of content.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Second block of content.',
              marks: [],
            },
          ],
        },
      ];

      render(<ContentOverlay {...defaultProps} content={multipleBlocks} />);
      expect(screen.getByText(/First block of content/)).toBeInTheDocument();
      expect(screen.getByText(/Second block of content/)).toBeInTheDocument();
    });

    it('handles content with special characters', () => {
      const specialContent: PortableTextBlock[] = [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Content with special chars: <>&"\'',
              marks: [],
            },
          ],
        },
      ];

      render(<ContentOverlay {...defaultProps} content={specialContent} />);
      expect(screen.getByText(/Content with special chars/)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes for typography', () => {
      const { container } = render(<ContentOverlay {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 2 });
      
      // Should have responsive text classes
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'lg:text-5xl', 'xl:text-6xl');
    });

    it('applies responsive padding classes', () => {
      render(<ContentOverlay {...defaultProps} />);
      const overlay = screen.getByRole('heading', { level: 2 }).closest('div')?.parentElement;
      
      // Should have responsive padding classes
      expect(overlay).toHaveClass('px-6', 'sm:px-8', 'lg:px-12');
    });
  });

  describe('Development Mode', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      // Reset to original value
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
      });
    });

    it('shows progress indicator in development mode', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
      });
      render(<ContentOverlay {...defaultProps} progress={0.75} />);
      
      expect(screen.getByText(/Progress: 75%/)).toBeInTheDocument();
      expect(screen.getByText(/Active: Yes/)).toBeInTheDocument();
    });

    it('hides progress indicator in production mode', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
      });
      render(<ContentOverlay {...defaultProps} progress={0.75} />);
      
      expect(screen.queryByText(/Progress: 75%/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading hierarchy', () => {
      render(<ContentOverlay {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('provides proper contrast with background overlay', () => {
      const { container } = render(<ContentOverlay {...defaultProps} />);
      const backgroundOverlay = container.querySelector('.bg-gradient-to-r');
      expect(backgroundOverlay).toBeInTheDocument();
    });

    it('handles long headings gracefully', () => {
      const longHeading = 'This is a very long heading that should wrap properly on smaller screens and maintain readability';
      render(<ContentOverlay {...defaultProps} heading={longHeading} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent(longHeading);
      expect(heading).toHaveClass('leading-tight');
    });
  });
});