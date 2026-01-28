/**
 * CarouselSection Component
 * 
 * Individual carousel section component.
 * This is a placeholder implementation that will be fully developed
 * in subsequent tasks.
 */

'use client';

import React from 'react';
import { CarouselSectionProps } from '@/types/carousel.types';

export function CarouselSection({ 
  section, 
  isActive, 
  progress, 
  className = '' 
}: CarouselSectionProps) {
  return (
    <div className={`carousel-section ${className}`}>
      <div className="carousel-content">
        <h2 className="text-3xl font-bold mb-2">{section.heading}</h2>
        {section.subheading && (
          <p className="text-xl opacity-80 mb-4">{section.subheading}</p>
        )}
        <div className="text-sm opacity-60">
          Section {section.order} | Active: {isActive ? 'Yes' : 'No'} | Progress: {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}