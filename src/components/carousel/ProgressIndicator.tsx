/**
 * ProgressIndicator Component
 * 
 * Progress indicator component for showing carousel progression.
 * Displays visual indicators for each section with smooth animations
 * and responsive design for different screen sizes.
 */

'use client';

import React from 'react';
import { ProgressIndicatorProps } from '@/types/carousel.types';

export function ProgressIndicator({ 
  currentSection, 
  totalSections, 
  sectionProgress, 
  className = '' 
}: ProgressIndicatorProps) {
  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {Array.from({ length: totalSections }, (_, index) => {
        const isActive = index === currentSection;
        const isCompleted = index < currentSection;
        const progress = isActive ? sectionProgress : (isCompleted ? 1 : 0);
        
        return (
          <div
            key={index}
            className="relative flex items-center justify-center"
          >
            {/* Background circle */}
            <div className="
              w-3 h-3 rounded-full border border-white/30 
              transition-all duration-300 ease-out
            " />
            
            {/* Progress fill */}
            <div 
              className="
                absolute inset-0 rounded-full bg-white
                transition-all duration-300 ease-out
              "
              style={{
                opacity: isCompleted ? 1 : (isActive ? 0.4 + (progress * 0.6) : 0.2),
                transform: `scale(${isActive ? 0.8 + (progress * 0.4) : (isCompleted ? 1 : 0.6)})`,
              }}
            />
            
            {/* Active indicator glow */}
            {isActive && (
              <div 
                className="
                  absolute inset-0 rounded-full bg-white/20
                  transition-all duration-300 ease-out
                "
                style={{
                  transform: `scale(${1.5 + (progress * 0.5)})`,
                  opacity: 0.3 + (progress * 0.3),
                }}
              />
            )}
          </div>
        );
      })}
      
      {/* Section labels for desktop */}
      <div className="hidden lg:block text-white/60 text-xs font-light text-center mt-4">
        <div className="mb-1">
          {currentSection + 1} / {totalSections}
        </div>
        <div className="w-px h-4 bg-white/20 mx-auto" />
      </div>
    </div>
  );
}