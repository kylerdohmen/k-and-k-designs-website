/**
 * Home Page Component
 * 
 * The main landing page of the marketing website. Integrates with Sanity CMS
 * to fetch and display hero content and services section. Includes proper
 * TypeScript typing, error handling, and SEO metadata configuration.
 * 
 * Requirements: 2.1, 2.4, 2.5, 4.2
 */

import React from 'react';
import { Metadata } from 'next';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import { getHomePageContent, getAllServices } from '../lib/sanity.client';
import { HomePageContent } from '../types/sanity.types';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getHomePageContent();
    
    if (!content || !content.seo) {
      // Fallback metadata
      return {
        title: 'Home - Marketing Website',
        description: 'Professional marketing website for your business needs',
        keywords: ['marketing', 'business', 'professional', 'services'],
      };
    }

    const { seo } = content;
    
    return {
      title: seo.title || 'Home - Marketing Website',
      description: seo.description || 'Professional marketing website for your business needs',
      keywords: seo.keywords || ['marketing', 'business', 'professional', 'services'],
      robots: seo.noIndex ? 'noindex, nofollow' : 'index, follow',
      openGraph: {
        title: seo.title || 'Home - Marketing Website',
        description: seo.description || 'Professional marketing website for your business needs',
        type: 'website',
        // TODO: Add ogImage URL when Sanity image URL builder is implemented
        // images: seo.ogImage ? [{ url: buildImageUrl(seo.ogImage) }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title || 'Home - Marketing Website',
        description: seo.description || 'Professional marketing website for your business needs',
        // TODO: Add Twitter image when Sanity image URL builder is implemented
        // images: seo.ogImage ? [buildImageUrl(seo.ogImage)] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for home page:', error);
    
    // Return fallback metadata on error
    return {
      title: 'Home - Marketing Website',
      description: 'Professional marketing website for your business needs',
      keywords: ['marketing', 'business', 'professional', 'services'],
    };
  }
}

/**
 * Home Page Component
 * 
 * Fetches content from Sanity CMS and renders the home page with Hero and
 * ServicesSection components. Includes comprehensive error handling and
 * fallback content to ensure the page always renders successfully.
 */
export default async function HomePage() {
  let content: HomePageContent | null = null;
  let services: any[] = [];

  try {
    // Fetch home page content from Sanity CMS
    content = await getHomePageContent();
    
    // If content has services, use them; otherwise fetch all services
    if (content?.services?.services && content.services.services.length > 0) {
      services = content.services.services;
    } else {
      // Fallback to fetching all services if home page doesn't specify services
      services = await getAllServices();
    }
  } catch (error) {
    console.error('Error fetching home page content:', error);
    
    // TODO: Add error reporting/monitoring integration here
    // Example: reportError('home_page_content_fetch_failed', error);
  }

  // Use fallback content if CMS content is not available
  if (!content) {
    content = {
      _id: 'fallback-home',
      _type: 'homePage',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: 'fallback',
      hero: {
        title: 'Welcome to Our Business',
        subtitle: 'Professional services tailored to your needs. We help businesses grow and succeed with our comprehensive solutions.',
        alignment: 'center' as const,
        ctaButtons: [
          {
            text: 'Get Started',
            href: '/services',
            variant: 'primary' as const
          },
          {
            text: 'Learn More',
            href: '/about',
            variant: 'outline' as const
          }
        ]
      },
      services: {
        title: 'Our Services',
        description: 'Discover what we can do for you with our range of professional services',
        services: services,
        layout: 'grid' as const
      },
      seo: {
        title: 'Home - Marketing Website',
        description: 'Professional marketing website for your business needs'
      }
    };
  }

  // Ensure services data is properly structured
  const servicesData = {
    title: content.services?.title || 'Our Services',
    description: content.services?.description || 'Discover what we can do for you',
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
        ctaButtons={content.hero.ctaButtons || []}
        alignment={content.hero.alignment || 'center'}
      />

      {/* Services Section */}
      <ServicesSection
        title={servicesData.title}
        description={servicesData.description}
        services={servicesData.services}
        layout={servicesData.layout}
      />

      {/* TODO: Add additional sections as needed */}
      {/* Example: Testimonials, About Preview, Contact CTA, etc. */}
      
      {/* TODO: Add structured data for SEO */}
      {/* Example: JSON-LD schema for business information */}
    </main>
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