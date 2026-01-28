/**
 * Sample Carousel Data
 * 
 * This file provides sample data for the ScrollLockedCarousel component
 * to demonstrate the functionality when Sanity CMS is not configured
 * or when testing the carousel integration.
 */

import { CarouselSection, CarouselData } from '@/types/carousel.types';
import { PortableTextBlock } from '@/types/sanity.types';

// Sample portable text content
const sampleContent1: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'sample-1',
    children: [
      {
        _type: 'span',
        _key: 'sample-span-1',
        text: 'Welcome to our immersive storytelling experience. Discover how we transform businesses through innovative solutions and creative thinking.',
        marks: []
      }
    ],
    markDefs: [],
    style: 'normal'
  }
];

const sampleContent2: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'sample-2',
    children: [
      {
        _type: 'span',
        _key: 'sample-span-2',
        text: 'Our expertise spans across multiple industries, bringing cutting-edge technology and proven methodologies to every project we undertake.',
        marks: []
      }
    ],
    markDefs: [],
    style: 'normal'
  }
];

const sampleContent3: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'sample-3',
    children: [
      {
        _type: 'span',
        _key: 'sample-span-3',
        text: 'Ready to transform your business? Let\'s work together to create something extraordinary that drives real results and lasting impact.',
        marks: []
      }
    ],
    markDefs: [],
    style: 'normal'
  }
];

// Sample carousel sections
export const sampleCarouselSections: CarouselSection[] = [
  {
    id: 'section-1',
    title: 'Innovation & Vision',
    heading: 'Transforming Ideas Into Reality',
    subheading: 'Where creativity meets technology',
    content: sampleContent1,
    backgroundImage: {
      asset: {
        _ref: 'image-sample-1',
        _type: 'reference' as const,
      },
      alt: 'Modern office space with creative professionals collaborating',
    },
    order: 1,
  },
  {
    id: 'section-2',
    title: 'Expertise & Excellence',
    heading: 'Proven Solutions That Work',
    subheading: 'Experience you can trust',
    content: sampleContent2,
    backgroundImage: {
      asset: {
        _ref: 'image-sample-2',
        _type: 'reference' as const,
      },
      alt: 'Team of experts working on innovative technology solutions',
    },
    order: 2,
  },
  {
    id: 'section-3',
    title: 'Partnership & Growth',
    heading: 'Your Success Is Our Mission',
    subheading: 'Let\'s build the future together',
    content: sampleContent3,
    backgroundImage: {
      asset: {
        _ref: 'image-sample-3',
        _type: 'reference' as const,
      },
      alt: 'Successful business partnership and growth visualization',
    },
    order: 3,
  },
];

// Sample carousel configuration
export const sampleCarouselData: CarouselData = {
  sections: sampleCarouselSections,
  config: {
    transitionDuration: 800,
    scrollSensitivity: 1.2,
  },
};

// Fallback image URLs for sample data
export const sampleImageUrls = {
  'image-sample-1': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'image-sample-2': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
  'image-sample-3': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80',
};

/**
 * Get sample carousel data with proper image URLs
 */
export function getSampleCarouselData(): CarouselData {
  return {
    ...sampleCarouselData,
    sections: sampleCarouselData.sections.map(section => ({
      ...section,
      backgroundImage: {
        ...section.backgroundImage,
        // Add a fallback URL for development
        url: sampleImageUrls[section.backgroundImage.asset._ref as keyof typeof sampleImageUrls],
      },
    })),
  };
}