/**
 * Simple Carousel Integration Tests
 * 
 * Basic tests for carousel integration without complex dependencies
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getSampleCarouselData } from '@/lib/sample-carousel-data';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('Carousel Integration - Sample Data', () => {
  it('provides valid sample carousel data', () => {
    const sampleData = getSampleCarouselData();
    
    expect(sampleData).toHaveProperty('sections');
    expect(sampleData).toHaveProperty('config');
    expect(sampleData.sections).toHaveLength(3);
    
    // Check first section structure
    const firstSection = sampleData.sections[0];
    expect(firstSection).toHaveProperty('id', 'section-1');
    expect(firstSection).toHaveProperty('heading', 'Transforming Ideas Into Reality');
    expect(firstSection).toHaveProperty('subheading', 'Where creativity meets technology');
    expect(firstSection).toHaveProperty('content');
    expect(firstSection).toHaveProperty('backgroundImage');
    expect(firstSection).toHaveProperty('order', 1);
    
    // Check that content is properly structured
    expect(Array.isArray(firstSection.content)).toBe(true);
    expect(firstSection.content.length).toBeGreaterThan(0);
    
    // Check background image structure
    expect(firstSection.backgroundImage).toHaveProperty('asset');
    expect(firstSection.backgroundImage).toHaveProperty('alt');
    expect(firstSection.backgroundImage.asset).toHaveProperty('_ref');
    expect(firstSection.backgroundImage.asset).toHaveProperty('_type', 'reference');
  });

  it('includes proper image URLs for all sections', () => {
    const sampleData = getSampleCarouselData();
    
    sampleData.sections.forEach((section, index) => {
      expect(section.backgroundImage).toHaveProperty('asset');
      expect(section.backgroundImage).toHaveProperty('alt');
      
      // Check that sample data includes direct URL
      if ((section.backgroundImage as any).url) {
        expect((section.backgroundImage as any).url).toMatch(/^https:\/\//);
        expect((section.backgroundImage as any).url).toContain('unsplash.com');
      }
      
      // Check alt text is descriptive
      expect(section.backgroundImage.alt).toBeTruthy();
      expect(section.backgroundImage.alt.length).toBeGreaterThan(10);
    });
  });

  it('has proper section ordering', () => {
    const sampleData = getSampleCarouselData();
    
    // Check that sections are ordered correctly
    expect(sampleData.sections[0].order).toBe(1);
    expect(sampleData.sections[1].order).toBe(2);
    expect(sampleData.sections[2].order).toBe(3);
    
    // Check that sections have unique IDs
    const ids = sampleData.sections.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('includes valid configuration', () => {
    const sampleData = getSampleCarouselData();
    
    expect(sampleData.config).toHaveProperty('transitionDuration');
    expect(sampleData.config).toHaveProperty('scrollSensitivity');
    
    expect(typeof sampleData.config.transitionDuration).toBe('number');
    expect(typeof sampleData.config.scrollSensitivity).toBe('number');
    
    expect(sampleData.config.transitionDuration).toBeGreaterThan(0);
    expect(sampleData.config.scrollSensitivity).toBeGreaterThan(0);
  });

  it('has meaningful content for each section', () => {
    const sampleData = getSampleCarouselData();
    
    sampleData.sections.forEach((section, index) => {
      // Check headings are meaningful
      expect(section.heading).toBeTruthy();
      expect(section.heading.length).toBeGreaterThan(5);
      
      // Check subheadings are meaningful
      expect(section.subheading).toBeTruthy();
      expect(section.subheading!.length).toBeGreaterThan(5);
      
      // Check content blocks exist and have text
      expect(section.content).toBeTruthy();
      expect(section.content.length).toBeGreaterThan(0);
      
      const firstBlock = section.content[0];
      expect(firstBlock).toHaveProperty('_type', 'block');
      expect(firstBlock).toHaveProperty('children');
      expect(Array.isArray(firstBlock.children)).toBe(true);
      expect(firstBlock.children.length).toBeGreaterThan(0);
      
      const firstChild = firstBlock.children[0];
      expect(firstChild).toHaveProperty('text');
      expect(firstChild.text.length).toBeGreaterThan(20);
    });
  });
});