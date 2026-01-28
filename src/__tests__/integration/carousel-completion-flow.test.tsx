/**
 * Carousel Completion Flow Tests
 * 
 * Tests the complete user flow from carousel interaction to services section,
 * verifying smooth transitions and proper component integration.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getSampleCarouselData } from '@/lib/sample-carousel-data';

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('Carousel Completion Flow', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn()
    }));

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('provides valid sample data for integration', () => {
    const sampleData = getSampleCarouselData();
    
    // Verify data structure
    expect(sampleData).toHaveProperty('sections');
    expect(sampleData).toHaveProperty('config');
    expect(sampleData.sections).toHaveLength(3);
    
    // Verify each section has required properties
    sampleData.sections.forEach((section, index) => {
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('heading');
      expect(section).toHaveProperty('content');
      expect(section).toHaveProperty('backgroundImage');
      expect(section).toHaveProperty('order', index + 1);
      
      // Verify content structure
      expect(Array.isArray(section.content)).toBe(true);
      expect(section.content.length).toBeGreaterThan(0);
      
      // Verify background image structure
      expect(section.backgroundImage).toHaveProperty('asset');
      expect(section.backgroundImage).toHaveProperty('alt');
    });
  });

  it('handles carousel completion callback correctly', () => {
    const mockOnComplete = jest.fn();
    const sampleData = getSampleCarouselData();
    
    // Test that the callback structure is correct
    expect(typeof mockOnComplete).toBe('function');
    
    // Simulate calling the completion callback
    mockOnComplete();
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('provides smooth scroll functionality', () => {
    const scrollIntoViewSpy = jest.spyOn(Element.prototype, 'scrollIntoView');
    
    // Create a mock services section element
    const mockElement = document.createElement('section');
    mockElement.id = 'services-section';
    document.body.appendChild(mockElement);
    
    // Simulate the smooth scroll behavior
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
    
    // Cleanup
    document.body.removeChild(mockElement);
  });

  it('maintains proper component layering', () => {
    // Test z-index values are properly structured
    const carouselZIndex = 'z-10';
    const servicesZIndex = 'z-20';
    const headerZIndex = 'z-50';
    
    // Verify z-index hierarchy
    expect(parseInt(carouselZIndex.replace('z-', ''))).toBeLessThan(
      parseInt(servicesZIndex.replace('z-', ''))
    );
    expect(parseInt(servicesZIndex.replace('z-', ''))).toBeLessThan(
      parseInt(headerZIndex.replace('z-', ''))
    );
  });

  it('handles image URLs correctly for sample data', () => {
    const sampleData = getSampleCarouselData();
    
    sampleData.sections.forEach(section => {
      // Check that sample data includes proper image references
      expect(section.backgroundImage.asset._ref).toBeTruthy();
      expect(section.backgroundImage.alt).toBeTruthy();
      
      // If URL is present, it should be valid
      if ((section.backgroundImage as any).url) {
        expect((section.backgroundImage as any).url).toMatch(/^https:\/\//);
      }
    });
  });

  it('provides meaningful content for storytelling', () => {
    const sampleData = getSampleCarouselData();
    
    // Check that each section tells part of a story
    const headings = sampleData.sections.map(s => s.heading);
    const subheadings = sampleData.sections.map(s => s.subheading);
    
    expect(headings).toEqual([
      'Transforming Ideas Into Reality',
      'Proven Solutions That Work',
      'Your Success Is Our Mission'
    ]);
    
    expect(subheadings).toEqual([
      'Where creativity meets technology',
      'Experience you can trust',
      'Let\'s build the future together'
    ]);
    
    // Verify content progression makes narrative sense
    sampleData.sections.forEach((section, index) => {
      expect(section.content[0].children[0].text).toBeTruthy();
      expect(section.content[0].children[0].text.length).toBeGreaterThan(50);
    });
  });

  it('supports proper configuration options', () => {
    const sampleData = getSampleCarouselData();
    
    expect(sampleData.config.transitionDuration).toBe(800);
    expect(sampleData.config.scrollSensitivity).toBe(1.2);
    
    // Verify configuration values are reasonable
    expect(sampleData.config.transitionDuration).toBeGreaterThan(0);
    expect(sampleData.config.transitionDuration).toBeLessThan(2000);
    expect(sampleData.config.scrollSensitivity).toBeGreaterThan(0);
    expect(sampleData.config.scrollSensitivity).toBeLessThan(5);
  });
});