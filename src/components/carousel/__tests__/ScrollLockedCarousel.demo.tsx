/**
 * ScrollLockedCarousel Demo Component
 * 
 * Demonstrates the ScrollLockedCarousel component with sample data.
 * This can be used for development and testing purposes.
 */

'use client';

import React from 'react';
import { ScrollLockedCarousel } from '../ScrollLockedCarousel';
import { CarouselSection } from '@/types/carousel.types';

// Sample carousel sections for demonstration
const demoSections: CarouselSection[] = [
  {
    id: 'section-1',
    title: 'Introduction',
    heading: '01 Welcome to Our Story',
    subheading: 'Discover the journey that brought us here',
    content: [
      {
        _type: 'block',
        _key: 'intro-block-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro-span-1',
            text: 'Every great story has a beginning. Ours started with a simple idea: to create something meaningful that would make a difference in people\'s lives.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'intro-block-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro-span-2',
            text: 'Through dedication, innovation, and countless hours of hard work, we\'ve built something we\'re truly proud of.',
            marks: ['strong'],
          },
        ],
        markDefs: [],
      },
    ],
    backgroundImage: {
      _type: 'image',
      asset: {
        _ref: 'image-demo-1',
        _type: 'reference',
      },
      alt: 'Beautiful landscape representing our beginning',
    },
    order: 1,
  },
  {
    id: 'section-2',
    title: 'Our Mission',
    heading: '02 Driving Innovation Forward',
    subheading: 'Technology that empowers and inspires',
    content: [
      {
        _type: 'block',
        _key: 'mission-block-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'mission-span-1',
            text: 'We believe in the power of technology to transform lives. Our mission is to create innovative solutions that bridge the gap between complex problems and elegant solutions.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'mission-block-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'mission-span-2',
            text: 'Every line of code, every design decision, and every user interaction is crafted with ',
            marks: [],
          },
          {
            _type: 'span',
            _key: 'mission-span-3',
            text: 'purpose and passion',
            marks: ['em'],
          },
          {
            _type: 'span',
            _key: 'mission-span-4',
            text: '.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    backgroundImage: {
      _type: 'image',
      asset: {
        _ref: 'image-demo-2',
        _type: 'reference',
      },
      alt: 'Modern technology workspace',
    },
    order: 2,
  },
  {
    id: 'section-3',
    title: 'The Future',
    heading: '03 Building Tomorrow Today',
    subheading: 'Join us on this incredible journey',
    content: [
      {
        _type: 'block',
        _key: 'future-block-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'future-span-1',
            text: 'The future is not something that happens to us—it\'s something we create. Together, we\'re building the tools and experiences that will shape tomorrow.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'future-block-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'future-span-2',
            text: 'Ready to be part of something extraordinary? ',
            marks: [],
          },
          {
            _type: 'span',
            _key: 'future-span-3',
            text: 'Let\'s build the future together.',
            marks: ['strong'],
          },
        ],
        markDefs: [],
      },
    ],
    backgroundImage: {
      _type: 'image',
      asset: {
        _ref: 'image-demo-3',
        _type: 'reference',
      },
      alt: 'Futuristic cityscape at sunset',
    },
    order: 3,
  },
];

export function ScrollLockedCarouselDemo() {
  const handleComplete = () => {
    console.log('Carousel completed! User has scrolled through all sections.');
  };

  return (
    <div className="w-full">
      <ScrollLockedCarousel 
        sections={demoSections}
        onComplete={handleComplete}
        className="demo-carousel"
      />
      
      {/* Demo instructions */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg max-w-xs">
        <h3 className="font-bold mb-2">Demo Instructions</h3>
        <ul className="text-sm space-y-1">
          <li>• Scroll to navigate through sections</li>
          <li>• Use arrow keys for keyboard navigation</li>
          <li>• Watch the progress indicators</li>
          <li>• Notice the smooth transitions</li>
        </ul>
      </div>
    </div>
  );
}

export default ScrollLockedCarouselDemo;