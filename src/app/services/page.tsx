/**
 * Services Page Component
 * 
 * The services page of the marketing website. Integrates with Sanity CMS
 * to fetch and display hero content and comprehensive services listing.
 * Includes proper TypeScript typing and error handling.
 * 
 * Requirements: 2.3, 2.4, 2.5, 4.2
 */

import React from 'react';
import { Metadata } from 'next';
import Hero from '../../components/Hero';
import ServicesSection from '../../components/ServicesSection';
import { getServicesPageContent, getAllServices } from '../../lib/sanity.client';
import { ServicesPageContent } from '../../types/sanity.types';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getServicesPageContent();
    
    if (!content || !content.seo) {
      // Fallback metadata
      return {
        title: 'Services - Marketing Website',
        description: 'Comprehensive solutions and professional services for your business needs',
        keywords: ['services', 'solutions', 'business', 'professional', 'consulting'],
      };
    }

    const { seo } = content;
    
    return {
      title: seo.title || 'Services - Marketing Website',
      description: seo.description || 'Comprehensive solutions and professional services for your business needs',
      keywords: seo.keywords || ['services', 'solutions', 'business', 'professional', 'consulting'],
      robots: seo.noIndex ? 'noindex, nofollow' : 'index, follow',
      openGraph: {
        title: seo.title || 'Services - Marketing Website',
        description: seo.description || 'Comprehensive solutions and professional services for your business needs',
        type: 'website',
        // TODO: Add ogImage URL when Sanity image URL builder is implemented
        // images: seo.ogImage ? [{ url: buildImageUrl(seo.ogImage) }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title || 'Services - Marketing Website',
        description: seo.description || 'Comprehensive solutions and professional services for your business needs',
        // TODO: Add Twitter image when Sanity image URL builder is implemented
        // images: seo.ogImage ? [buildImageUrl(seo.ogImage)] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for services page:', error);
    
    // Return fallback metadata on error
    return {
      title: 'Services - Marketing Website',
      description: 'Comprehensive solutions and professional services for your business needs',
      keywords: ['services', 'solutions', 'business', 'professional', 'consulting'],
    };
  }
}

/**
 * Services Page Component
 * 
 * Fetches content from Sanity CMS and renders the services page with Hero and
 * ServicesSection components. Includes comprehensive error handling and
 * fallback content to ensure the page always renders successfully.
 */
export default async function ServicesPage() {
  let content: ServicesPageContent | null = null;
  let services: any[] = [];

  try {
    // Fetch services page content from Sanity CMS
    content = await getServicesPageContent();
    
    // If content has services, use them; otherwise fetch all services
    if (content?.services?.services && content.services.services.length > 0) {
      services = content.services.services;
    } else {
      // Fallback to fetching all services if services page doesn't specify services
      services = await getAllServices();
    }
  } catch (error) {
    console.error('Error fetching services page content:', error);
    
    // TODO: Add error reporting/monitoring integration here
    // Example: reportError('services_page_content_fetch_failed', error);
  }

  // Use fallback content if CMS content is not available
  if (!content) {
    content = {
      _id: 'fallback-services',
      _type: 'servicesPage',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: 'fallback',
      hero: {
        title: 'Our Services',
        subtitle: 'Comprehensive solutions designed to help your business grow and succeed in today\'s competitive market',
        alignment: 'center' as const
      },
      services: {
        title: 'What We Offer',
        description: 'Explore our range of professional services tailored to meet your unique business needs',
        services: services,
        layout: 'grid' as const
      },
      seo: {
        title: 'Services - Marketing Website',
        description: 'Comprehensive solutions and professional services for your business needs'
      }
    };
  }

  // Ensure services data is properly structured
  const servicesData = {
    title: content.services?.title || 'What We Offer',
    description: content.services?.description || 'Explore our range of professional services',
    services: services || [],
    layout: (content.services?.layout || 'grid') as 'grid' | 'list'
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={content.hero.title}
        {...(content.hero.subtitle && { subtitle: content.hero.subtitle })}
        {...(content.hero.backgroundImage && { backgroundImage: content.hero.backgroundImage })}
        alignment={content.hero.alignment || 'center'}
      />

      {/* Services Section */}
      <ServicesSection
        title={servicesData.title}
        description={servicesData.description}
        services={servicesData.services}
        layout={servicesData.layout}
      />

      {/* Additional Services Information Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              We combine industry expertise with personalized attention to deliver 
              exceptional results for every client. Our proven approach ensures 
              your success is our priority.
            </p>
            
            {/* Service Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Results</h3>
                <p className="text-gray-600">
                  Track record of delivering successful outcomes for businesses of all sizes
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Team</h3>
                <p className="text-gray-600">
                  Experienced professionals dedicated to your success and growth
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
                <p className="text-gray-600">
                  Efficient processes and timely delivery without compromising quality
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Contact us today to discuss how our services can help your business achieve its goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200 border-2 border-white inline-flex items-center justify-center"
              >
                Contact Us
              </a>
              <a
                href="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200 inline-flex items-center justify-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TODO: Add additional sections as needed */}
      {/* Example: Service process, Pricing, FAQ, Case studies, etc. */}
      
      {/* TODO: Add structured data for SEO */}
      {/* Example: JSON-LD schema for services, organization, etc. */}
    </main>
  );
}