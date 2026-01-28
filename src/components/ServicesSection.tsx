/**
 * ServicesSection Component
 * 
 * A flexible services display component that supports both grid and list layouts.
 * Designed to showcase business services with responsive design patterns and
 * seamless integration with Sanity CMS content.
 */

import React from 'react';
import Image from 'next/image';
import { ServicesSectionProps } from '../types/component.types';

const ServicesSection: React.FC<ServicesSectionProps> = ({
  title,
  description,
  services,
  layout = 'grid',
  columns = 3
}) => {
  // Grid layout classes based on column count
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  // Handle service image (string or SanityImage)
  const getServiceImageUrl = (image: string | any, index: number = 0): string => {
    if (!image) {
      // Use fallback service images
      const fallbackImages = [
        '/images/service-1.svg',
        '/images/service-2.svg',
        '/images/service-3.svg'
      ];
      return fallbackImages[index % fallbackImages.length] || '/images/service-1.svg';
    }
    
    if (typeof image === 'string') {
      return image;
    }
    
    // Handle SanityImage type - in a real implementation, you'd use Sanity's image URL builder
    if (image.asset && image.asset._ref) {
      return `https://cdn.sanity.io/images/project-id/dataset/${image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
    }
    
    // Fallback if SanityImage is malformed
    const fallbackImages = [
      '/images/service-1.svg',
      '/images/service-2.svg',
      '/images/service-3.svg'
    ];
    return fallbackImages[index % fallbackImages.length] || '/images/service-1.svg';
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Services Content */}
        {layout === 'grid' ? (
          // Grid Layout
          <div className={`grid ${gridClasses[columns]} gap-8 lg:gap-12`}>
            {services.map((service, index) => (
              <div 
                key={service._id} 
                className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Service Icon/Image */}
                <div className="mb-6">
                  {service.image ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={getServiceImageUrl(service.image, index)}
                        alt={service.image?.alt || service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : service.icon ? (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                  ) : (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={getServiceImageUrl(null, index)}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Service Title */}
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                {/* Service Description */}
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // List Layout
          <div className="space-y-8 lg:space-y-12 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <div 
                key={service._id}
                className={`flex flex-col lg:flex-row items-start gap-6 lg:gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Service Icon/Image */}
                <div className="flex-shrink-0 w-full lg:w-1/3">
                  {service.image ? (
                    <div className="relative w-full h-64 lg:h-48 rounded-lg overflow-hidden">
                      <Image
                        src={getServiceImageUrl(service.image, index)}
                        alt={service.image?.alt || service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : service.icon ? (
                    <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mx-auto lg:mx-0">
                      <span className="text-3xl">{service.icon}</span>
                    </div>
                  ) : (
                    <div className="relative w-full h-64 lg:h-48 rounded-lg overflow-hidden">
                      <Image
                        src={getServiceImageUrl(null, index)}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Service Content */}
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {services.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services available</h3>
            <p className="text-gray-500">Services will appear here when added through the CMS.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;