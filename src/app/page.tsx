/**
 * Home Page Component
 * 
 * The main landing page of the marketing website. Features the new ScrollLockedCarousel
 * as the hero section, followed by the existing ServicesSection and Footer.
 * Integrates with Sanity CMS for content management with fallback sample data.
 * 
 * Requirements: 2.1, 2.4, 2.5, 4.2, 7.2
 */

'use client';

import React from 'react';
import { ScrollLockedCarousel } from '../components/carousel/ScrollLockedCarousel';
import ServicesSection from '../components/ServicesSection';
import { getSampleCarouselData } from '../lib/sample-carousel-data';

// Sample services data for demo
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

/**
 * Home Page Component
 * 
 * Features the ScrollLockedCarousel as the main hero experience, followed by
 * the existing ServicesSection. Uses sample data for demonstration.
 */
export default function HomePage() {
  // Get carousel data (sample data for now)
  const carouselData = getSampleCarouselData();

  // Handle carousel completion - smooth scroll to services section
  const handleCarouselComplete = () => {
    // Small delay to allow scroll unlock to complete
    setTimeout(() => {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <>
      {/* Scroll-Locked Carousel Hero Section */}
      <ScrollLockedCarousel
        sections={carouselData.sections}
        onComplete={handleCarouselComplete}
        className="relative z-10"
      />

      {/* Services Section */}
      <section id="services-section" className="relative z-20 pt-20">
        <ServicesSection
          title="Our Services"
          description="Discover what we can do for you with our range of professional services"
          services={sampleServices}
          layout="grid"
        />
      </section>

      {/* TODO: Add additional sections as needed */}
      {/* Example: Testimonials, About Preview, Contact CTA, etc. */}
      
      {/* TODO: Add structured data for SEO */}
      {/* Example: JSON-LD schema for business information */}
    </>
  );
}

/**
 * Error Boundary Component (for future use)
 * 
 * TODO: Implement error boundary to handle runtime errors gracefully
 * This would catch any errors in the component tree and display a fallback UI
 */

/**
 * Loading Component (for future use)
 * 
 * TODO: Implement loading component for better user experience
 * This would be displayed while the page content is being fetched
 */