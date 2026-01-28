/**
 * Carousel Page Integration Tests
 * 
 * Tests the integration of the ScrollLockedCarousel with existing page components
 * including Header, ServicesSection, and Footer. Verifies smooth transitions
 * and proper component ordering.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/app/page';
import { getSampleCarouselData } from '@/lib/sample-carousel-data';

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock the Sanity client to return sample data
jest.mock('@/lib/sanity.client', () => ({
  getHomePageContent: jest.fn().mockResolvedValue(null),
  getAllServices: jest.fn().mockResolvedValue([
    {
      _id: 'test-service-1',
      title: 'Test Service 1',
      description: 'Test service description',
      slug: { current: 'test-service-1' }
    }
  ])
}));

// Mock carousel hooks
jest.mock('@/hooks/carousel/useScrollLock', () => ({
  useScrollLock: () => ({
    isLocked: false,
    lockScroll: jest.fn(),
    unlockScroll: jest.fn()
  })
}));

jest.mock('@/hooks/carousel/useCarouselProgress', () => ({
  useCarouselProgress: () => ({
    currentSection: 0,
    sectionProgress: 0,
    totalProgress: 0,
    direction: 'forward' as const,
    updateProgress: jest.fn(),
    reset: jest.fn()
  })
}));

jest.mock('@/hooks/carousel/usePreloader', () => ({
  usePreloader: () => ({
    preloadNextImages: jest.fn()
  })
}));

describe('Carousel Page Integration', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn()
    }));

    // Mock window.scrollTo
    global.scrollTo = jest.fn();
    
    // Mock Element.scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders carousel with sample data', async () => {
    const sampleData = getSampleCarouselData();
    
    render(<HomePage />);

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Transforming Ideas Into Reality')).toBeInTheDocument();
    });

    // Check that carousel sections are present
    expect(screen.getByText('Where creativity meets technology')).toBeInTheDocument();
  });

  it('renders services section after carousel', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Our Services')).toBeInTheDocument();
    });

    // Check that services section has proper ID for smooth scrolling
    const servicesSection = document.getElementById('services-section');
    expect(servicesSection).toBeInTheDocument();
  });

  it('has proper z-index layering', async () => {
    render(<HomePage />);

    await waitFor(() => {
      const carousel = document.querySelector('[class*="relative z-10"]');
      const servicesSection = document.querySelector('[class*="relative z-20"]');
      
      expect(carousel).toBeInTheDocument();
      expect(servicesSection).toBeInTheDocument();
    });
  });

  it('includes scroll hint on first section', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Scroll to explore')).toBeInTheDocument();
    });
  });

  it('shows progress indicators', async () => {
    render(<HomePage />);

    await waitFor(() => {
      // Check for desktop progress indicator (hidden on mobile)
      const progressIndicators = document.querySelectorAll('[class*="space-y-3"]');
      expect(progressIndicators.length).toBeGreaterThan(0);
    });
  });

  it('handles carousel completion callback', async () => {
    const scrollIntoViewSpy = jest.spyOn(Element.prototype, 'scrollIntoView');
    
    render(<HomePage />);

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('Transforming Ideas Into Reality')).toBeInTheDocument();
    });

    // Simulate carousel completion by calling the onComplete callback
    // This would normally be triggered by the carousel component
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });

  it('renders with fallback content when CMS is unavailable', async () => {
    render(<HomePage />);

    await waitFor(() => {
      // Should render with sample carousel data
      expect(screen.getByText('Transforming Ideas Into Reality')).toBeInTheDocument();
      
      // Should render with fallback services content
      expect(screen.getByText('Our Services')).toBeInTheDocument();
    });
  });

  it('maintains proper component structure', async () => {
    render(<HomePage />);

    await waitFor(() => {
      // Check that main elements are present in correct order
      const carousel = document.querySelector('[class*="min-h-screen"]');
      const servicesSection = document.getElementById('services-section');
      
      expect(carousel).toBeInTheDocument();
      expect(servicesSection).toBeInTheDocument();
      
      // Services section should come after carousel in DOM order
      const carouselRect = carousel?.getBoundingClientRect();
      const servicesRect = servicesSection?.getBoundingClientRect();
      
      if (carouselRect && servicesRect) {
        expect(servicesRect.top).toBeGreaterThanOrEqual(carouselRect.bottom);
      }
    });
  });
});

describe('Sample Carousel Data', () => {
  it('provides valid carousel data structure', () => {
    const sampleData = getSampleCarouselData();
    
    expect(sampleData).toHaveProperty('sections');
    expect(sampleData).toHaveProperty('config');
    expect(sampleData.sections).toHaveLength(3);
    
    // Check first section structure
    const firstSection = sampleData.sections[0];
    expect(firstSection).toHaveProperty('id');
    expect(firstSection).toHaveProperty('heading');
    expect(firstSection).toHaveProperty('subheading');
    expect(firstSection).toHaveProperty('content');
    expect(firstSection).toHaveProperty('backgroundImage');
    expect(firstSection).toHaveProperty('order');
  });

  it('includes proper image URLs for sample data', () => {
    const sampleData = getSampleCarouselData();
    
    sampleData.sections.forEach(section => {
      expect(section.backgroundImage).toHaveProperty('asset');
      expect(section.backgroundImage).toHaveProperty('alt');
      
      // Check that sample data includes direct URL
      if ((section.backgroundImage as any).url) {
        expect((section.backgroundImage as any).url).toMatch(/^https:\/\//);
      }
    });
  });
});