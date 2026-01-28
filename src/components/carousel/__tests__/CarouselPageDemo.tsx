/**
 * Carousel Page Demo Component
 * 
 * A demo component that showcases the integrated carousel with existing
 * page components. This demonstrates the complete user experience.
 */

'use client';

import React, { useState } from 'react';
import { ScrollLockedCarousel } from '../ScrollLockedCarousel';
import ServicesSection from '../../ServicesSection';
import { getSampleCarouselData } from '@/lib/sample-carousel-data';

const sampleServices = [
  {
    _id: 'demo-service-1',
    _type: 'service',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: 'demo',
    title: 'Strategic Consulting',
    description: 'Expert guidance to help your business navigate complex challenges and identify growth opportunities.',
    slug: { current: 'strategic-consulting' }
  },
  {
    _id: 'demo-service-2',
    _type: 'service',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: 'demo',
    title: 'Digital Transformation',
    description: 'Modernize your operations with cutting-edge technology solutions tailored to your industry.',
    slug: { current: 'digital-transformation' }
  },
  {
    _id: 'demo-service-3',
    _type: 'service',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: 'demo',
    title: 'Innovation Strategy',
    description: 'Develop and implement innovative strategies that drive sustainable competitive advantage.',
    slug: { current: 'innovation-strategy' }
  }
];

export function CarouselPageDemo() {
  const [carouselCompleted, setCarouselCompleted] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const carouselData = getSampleCarouselData();

  const handleCarouselComplete = () => {
    setCarouselCompleted(true);
    
    // Smooth scroll to services section
    setTimeout(() => {
      const servicesSection = document.getElementById('demo-services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Controls */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">Demo Controls</h3>
        <div className="space-y-2">
          <button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="block w-full text-left text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded"
          >
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </button>
          <button
            onClick={() => {
              setCarouselCompleted(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="block w-full text-left text-xs px-2 py-1 bg-green-100 hover:bg-green-200 rounded"
          >
            Reset Demo
          </button>
        </div>
        
        {/* Status Indicators */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs space-y-1">
            <div className={`flex items-center ${carouselCompleted ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${carouselCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
              Carousel Complete
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info Panel */}
      {showDebugInfo && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 text-white text-xs p-4 rounded-lg font-mono max-w-xs">
          <h4 className="font-bold mb-2">Carousel Debug Info</h4>
          <div className="space-y-1">
            <div>Sections: {carouselData.sections.length}</div>
            <div>Transition: {carouselData.config.transitionDuration}ms</div>
            <div>Sensitivity: {carouselData.config.scrollSensitivity}</div>
            <div>Completed: {carouselCompleted ? 'Yes' : 'No'}</div>
          </div>
          
          <h5 className="font-bold mt-3 mb-1">Section Titles:</h5>
          <div className="space-y-1">
            {carouselData.sections.map((section, index) => (
              <div key={section.id} className="text-xs">
                {index + 1}. {section.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carousel Hero Section */}
      <ScrollLockedCarousel
        sections={carouselData.sections}
        onComplete={handleCarouselComplete}
        className="relative z-10"
      />

      {/* Services Section */}
      <section id="demo-services-section" className="relative z-20 pt-20">
        <ServicesSection
          title="Our Expertise"
          description="Discover how we can help transform your business with our comprehensive suite of professional services"
          services={sampleServices}
          layout="grid"
        />
      </section>

      {/* Additional Demo Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Seamless Integration Demo
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              This demo showcases how the ScrollLockedCarousel integrates seamlessly with existing 
              page components. The carousel provides an immersive storytelling experience that 
              smoothly transitions to traditional content sections.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Scroll-locked navigation</li>
                  <li>• Smooth background transitions</li>
                  <li>• Responsive design</li>
                  <li>• Keyboard navigation</li>
                  <li>• Touch support</li>
                  <li>• Progress indicators</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Integration Points</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Fixed header overlay</li>
                  <li>• Smooth scroll transitions</li>
                  <li>• Proper z-index layering</li>
                  <li>• Component completion callbacks</li>
                  <li>• Fallback content support</li>
                  <li>• CMS integration ready</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}