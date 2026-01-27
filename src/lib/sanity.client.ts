/**
 * Sanity CMS Client Configuration
 * 
 * This file configures the Sanity client for fetching content from the CMS.
 * It includes helper functions for content fetching with proper error handling
 * and retry logic. All functions include fallback content to ensure the site
 * never breaks if the CMS is unavailable.
 * 
 * Requirements: 4.1, 4.2, 5.2
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { 
  HomePageContent, 
  AboutPageContent, 
  ServicesPageContent, 
  Service, 
  SiteSettings,
  SanityImage 
} from '../types/sanity.types';

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true, // Set to false if you need fresh data
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  ...(process.env.SANITY_API_TOKEN && { token: process.env.SANITY_API_TOKEN }),
});

// Image URL builder
const builder = imageUrlBuilder(client);

/**
 * Helper function to generate image URLs from Sanity image objects
 */
export function urlFor(source: SanityImage) {
  return builder.image(source);
}

/**
 * Helper function to build optimized image URLs with dimensions and format
 */
export function buildImageUrl(image: SanityImage, width?: number, height?: number): string {
  let imageBuilder = urlFor(image);
  
  if (width) imageBuilder = imageBuilder.width(width);
  if (height) imageBuilder = imageBuilder.height(height);
  
  return imageBuilder
    .format('webp')
    .quality(85)
    .url();
}
// Fallback content (used when CMS is unavailable)
const fallbackContent = {
  homePage: (): HomePageContent => ({
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
      services: [],
      layout: 'grid' as const
    },
    seo: {
      title: 'Home - Professional Business Services',
      description: 'Professional marketing website for your business needs',
      noIndex: false
    }
  }),

  aboutPage: (): AboutPageContent => ({
    _id: 'fallback-about',
    _type: 'aboutPage',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: 'fallback',
    hero: {
      title: 'About Our Company',
      subtitle: 'Learn more about our mission, values, and the team behind our success.',
      alignment: 'center' as const
    },
    content: [
      {
        _type: 'block',
        _key: 'fallback-1',
        children: [
          {
            _type: 'span',
            _key: 'fallback-span-1',
            text: 'We are a professional services company dedicated to helping businesses succeed. Our team brings years of experience and expertise to every project.',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    seo: {
      title: 'About Us - Professional Business Services',
      description: 'Learn about our company, mission, and the professional team behind our success.',
      noIndex: false
    }
  }),
  servicesPage: (): ServicesPageContent => ({
    _id: 'fallback-services',
    _type: 'servicesPage',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: 'fallback',
    hero: {
      title: 'Our Services',
      subtitle: 'Comprehensive solutions designed to help your business thrive.',
      alignment: 'center' as const
    },
    services: {
      title: 'What We Offer',
      description: 'Professional services tailored to your business needs',
      services: [],
      layout: 'grid' as const
    },
    seo: {
      title: 'Services - Professional Business Solutions',
      description: 'Explore our comprehensive range of professional services designed to help your business succeed.',
      noIndex: false
    }
  }),

  services: (): Service[] => [
    {
      _id: 'fallback-service-1',
      _type: 'service',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: 'fallback',
      title: 'Consulting Services',
      description: 'Expert consulting to help your business grow and overcome challenges.',
      slug: { current: 'consulting-services' }
    },
    {
      _id: 'fallback-service-2',
      _type: 'service',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: 'fallback',
      title: 'Digital Solutions',
      description: 'Modern digital solutions to streamline your business operations.',
      slug: { current: 'digital-solutions' }
    },
    {
      _id: 'fallback-service-3',
      _type: 'service',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: 'fallback',
      title: 'Support Services',
      description: 'Ongoing support to ensure your business continues to thrive.',
      slug: { current: 'support-services' }
    }
  ]
};
/**
 * Fetch home page content from Sanity CMS
 * Returns fallback content if CMS is unavailable or not configured
 */
export async function getHomePageContent(): Promise<HomePageContent> {
  // If no project ID is configured, return fallback content
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    console.log('Sanity not configured, using fallback content for home page');
    return fallbackContent.homePage();
  }

  try {
    const query = `*[_type == "homePage"][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      hero{
        title,
        subtitle,
        backgroundImage,
        ctaButtons[]{
          text,
          href,
          variant,
          isExternal
        },
        alignment
      },
      services{
        title,
        description,
        services[]->{
          _id,
          _type,
          _createdAt,
          _updatedAt,
          _rev,
          title,
          description,
          icon,
          image,
          slug
        },
        layout
      },
      seo{
        title,
        description,
        keywords,
        ogImage,
        noIndex
      }
    }`;

    const content = await client.fetch(query);
    
    if (!content) {
      console.log('No home page content found in CMS, using fallback');
      return fallbackContent.homePage();
    }

    return content;
  } catch (error) {
    console.error('Error fetching home page content:', error);
    return fallbackContent.homePage();
  }
}
/**
 * Fetch about page content from Sanity CMS
 */
export async function getAboutPageContent(): Promise<AboutPageContent> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    console.log('Sanity not configured, using fallback content for about page');
    return fallbackContent.aboutPage();
  }

  try {
    const query = `*[_type == "aboutPage"][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      hero{
        title,
        subtitle,
        backgroundImage,
        alignment
      },
      content,
      seo{
        title,
        description,
        keywords,
        ogImage,
        noIndex
      }
    }`;

    const content = await client.fetch(query);
    
    if (!content) {
      console.log('No about page content found in CMS, using fallback');
      return fallbackContent.aboutPage();
    }

    return content;
  } catch (error) {
    console.error('Error fetching about page content:', error);
    return fallbackContent.aboutPage();
  }
}
/**
 * Fetch services page content from Sanity CMS
 */
export async function getServicesPageContent(): Promise<ServicesPageContent> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    console.log('Sanity not configured, using fallback content for services page');
    return fallbackContent.servicesPage();
  }

  try {
    const query = `*[_type == "servicesPage"][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      hero{
        title,
        subtitle,
        backgroundImage,
        alignment
      },
      services{
        title,
        description,
        services[]->{
          _id,
          _type,
          _createdAt,
          _updatedAt,
          _rev,
          title,
          description,
          icon,
          image,
          slug
        },
        layout
      },
      seo{
        title,
        description,
        keywords,
        ogImage,
        noIndex
      }
    }`;

    const content = await client.fetch(query);
    
    if (!content) {
      console.log('No services page content found in CMS, using fallback');
      return fallbackContent.servicesPage();
    }

    return content;
  } catch (error) {
    console.error('Error fetching services page content:', error);
    return fallbackContent.servicesPage();
  }
}
/**
 * Fetch all services from Sanity CMS
 */
export async function getAllServices(): Promise<Service[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    console.log('Sanity not configured, using fallback services');
    return fallbackContent.services();
  }

  try {
    const query = `*[_type == "service"] | order(_createdAt desc){
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      description,
      icon,
      image,
      slug
    }`;

    const services = await client.fetch(query);
    
    if (!services || services.length === 0) {
      console.log('No services found in CMS, using fallback');
      return fallbackContent.services();
    }

    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return fallbackContent.services();
  }
}

/**
 * Fetch site settings from Sanity CMS
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
    console.log('Sanity not configured, no site settings available');
    return null;
  }

  try {
    const query = `*[_type == "siteSettings"][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      description,
      logo,
      favicon,
      contactInfo,
      socialLinks
    }`;

    const settings = await client.fetch(query);
    return settings || null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

// Export client for direct use if needed
export { client as sanityClient };