/**
 * Hero Component
 * 
 * A customizable hero section component that supports background images,
 * flexible content alignment, and call-to-action buttons. Designed to be
 * responsive and work seamlessly with Sanity CMS content.
 */

import React from 'react';
import { HeroProps } from '../types/component.types';

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaButtons = [],
  alignment = 'center',
  variant = 'default'
}) => {
  // Determine alignment classes
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  // Determine variant classes
  const variantClasses = {
    default: 'py-20 lg:py-32',
    minimal: 'py-12 lg:py-16',
    overlay: 'py-24 lg:py-40'
  };

  // Handle background image (string or SanityImage)
  const getBackgroundImageUrl = () => {
    if (!backgroundImage) {
      // Use fallback background image
      return '/images/hero-bg.svg';
    }
    
    if (typeof backgroundImage === 'string') {
      return backgroundImage;
    }
    
    // Handle SanityImage type - in a real implementation, you'd use Sanity's image URL builder
    // For now, we'll return a placeholder or the reference
    return `https://cdn.sanity.io/images/project-id/dataset/${backgroundImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
  };

  const backgroundImageUrl = getBackgroundImageUrl();

  return (
    <section 
      className={`
        relative w-full flex items-center justify-center
        ${variantClasses[variant]}
        bg-cover bg-center bg-no-repeat
      `}
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${alignmentClasses[alignment]} max-w-4xl mx-auto`}>
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl text-gray-100 leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {/* CTA Buttons */}
          {ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              {ctaButtons.map((button, index) => {
                const buttonVariantClasses = {
                  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
                  secondary: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300',
                  outline: 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                };
                
                const baseClasses = 'px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200 border-2 inline-flex items-center justify-center';
                const variantClass = buttonVariantClasses[button.variant || 'primary'];
                
                if (button.isExternal) {
                  return (
                    <a
                      key={index}
                      href={button.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${baseClasses} ${variantClass}`}
                    >
                      {button.text}
                      <svg 
                        className="ml-2 w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                        />
                      </svg>
                    </a>
                  );
                }
                
                return (
                  <a
                    key={index}
                    href={button.href}
                    className={`${baseClasses} ${variantClass}`}
                  >
                    {button.text}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;