/**
 * About Page Component
 * 
 * The about page of the marketing website. Integrates with Sanity CMS
 * to fetch and display hero content and rich text content sections.
 * Includes proper TypeScript typing and error handling.
 * 
 * Requirements: 2.2, 2.4, 2.5, 4.2
 */

import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Hero from '../../components/Hero';
import { getAboutPageContent } from '../../lib/sanity.client';
import { AboutPageContent, PortableTextBlock } from '../../types/sanity.types';

// Enable ISR - page will be regenerated every 60 seconds
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getAboutPageContent();
    
    if (!content || !content.seo) {
      // Fallback metadata
      return {
        title: 'About Us - Marketing Website',
        description: 'Learn more about our company, mission, and the team behind our success',
        keywords: ['about', 'company', 'team', 'mission', 'values'],
      };
    }

    const { seo } = content;
    
    return {
      title: seo.title || 'About Us - Marketing Website',
      description: seo.description || 'Learn more about our company, mission, and the team behind our success',
      keywords: seo.keywords || ['about', 'company', 'team', 'mission', 'values'],
      robots: seo.noIndex ? 'noindex, nofollow' : 'index, follow',
      openGraph: {
        title: seo.title || 'About Us - Marketing Website',
        description: seo.description || 'Learn more about our company, mission, and the team behind our success',
        type: 'website',
        // TODO: Add ogImage URL when Sanity image URL builder is implemented
        // images: seo.ogImage ? [{ url: buildImageUrl(seo.ogImage) }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title || 'About Us - Marketing Website',
        description: seo.description || 'Learn more about our company, mission, and the team behind our success',
        // TODO: Add Twitter image when Sanity image URL builder is implemented
        // images: seo.ogImage ? [buildImageUrl(seo.ogImage)] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for about page:', error);
    
    // Return fallback metadata on error
    return {
      title: 'About Us - Marketing Website',
      description: 'Learn more about our company, mission, and the team behind our success',
      keywords: ['about', 'company', 'team', 'mission', 'values'],
    };
  }
}

/**
 * Portable Text Renderer Component
 * 
 * Renders Sanity's Portable Text content blocks as HTML.
 * This is a simplified renderer - in a full implementation,
 * you would use @portabletext/react for more advanced features.
 */
interface PortableTextRendererProps {
  content: PortableTextBlock[];
}

const PortableTextRenderer: React.FC<PortableTextRendererProps> = ({ content }) => {
  const renderBlock = (block: PortableTextBlock) => {
    if (!block.children || block.children.length === 0) {
      return null;
    }

    // Render text content from spans
    const textContent = block.children
      .map(child => child.text)
      .join('');

    // Handle different block styles
    switch (block.style) {
      case 'h1':
        return (
          <h1 key={block._key} className="text-4xl font-bold text-gray-900 mb-6">
            {textContent}
          </h1>
        );
      case 'h2':
        return (
          <h2 key={block._key} className="text-3xl font-semibold text-gray-900 mb-5">
            {textContent}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={block._key} className="text-2xl font-semibold text-gray-900 mb-4">
            {textContent}
          </h3>
        );
      case 'h4':
        return (
          <h4 key={block._key} className="text-xl font-semibold text-gray-900 mb-3">
            {textContent}
          </h4>
        );
      case 'blockquote':
        return (
          <blockquote key={block._key} className="border-l-4 border-blue-500 pl-6 py-2 mb-6 italic text-gray-700">
            {textContent}
          </blockquote>
        );
      default:
        // Handle normal paragraphs and other block types
        return (
          <p key={block._key} className="text-lg text-gray-600 mb-6 leading-relaxed">
            {textContent}
          </p>
        );
    }
  };

  return (
    <div className="prose prose-lg max-w-none">
      {content.map(renderBlock)}
    </div>
  );
};

/**
 * About Page Component
 * 
 * Fetches content from Sanity CMS and renders the about page with Hero and
 * rich text content sections. Includes comprehensive error handling and
 * fallback content to ensure the page always renders successfully.
 */
export default async function AboutPage() {
  let content: AboutPageContent | null = null;

  try {
    // Fetch about page content from Sanity CMS
    content = await getAboutPageContent();
  } catch (error) {
    console.error('Error fetching about page content:', error);
    
    // TODO: Add error reporting/monitoring integration here
    // Example: reportError('about_page_content_fetch_failed', error);
  }

  // Use fallback content if CMS content is not available
  if (!content) {
    content = {
      _id: 'fallback-about',
      _type: 'aboutPage',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: 'fallback',
      hero: {
        title: 'About Us',
        subtitle: 'Learn more about our company, mission, and the dedicated team behind our success',
        alignment: 'center' as const
      },
      content: [
        {
          _type: 'block',
          _key: 'fallback-intro',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'fallback-intro-span',
              text: 'Welcome to our company. We are a dedicated team of professionals committed to delivering exceptional services and solutions to our clients. Our mission is to help businesses grow and succeed through innovative approaches and personalized attention.',
              marks: []
            }
          ]
        },
        {
          _type: 'block',
          _key: 'fallback-mission',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'fallback-mission-span',
              text: 'Our Mission',
              marks: []
            }
          ]
        },
        {
          _type: 'block',
          _key: 'fallback-mission-content',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'fallback-mission-content-span',
              text: 'We strive to provide outstanding value to our clients by combining industry expertise with innovative solutions. Our goal is to build long-lasting partnerships that drive mutual success and growth.',
              marks: []
            }
          ]
        },
        {
          _type: 'block',
          _key: 'fallback-values',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'fallback-values-span',
              text: 'Our Values',
              marks: []
            }
          ]
        },
        {
          _type: 'block',
          _key: 'fallback-values-content',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'fallback-values-content-span',
              text: 'Integrity, excellence, and customer satisfaction are at the core of everything we do. We believe in transparent communication, continuous improvement, and delivering results that exceed expectations.',
              marks: []
            }
          ]
        }
      ],
      seo: {
        title: 'About Us - Marketing Website',
        description: 'Learn more about our company, mission, and the team behind our success'
      }
    };
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={content.hero.title}
        {...(content.hero.subtitle && { subtitle: content.hero.subtitle })}
        {...(content.hero.backgroundImage && { backgroundImage: content.hero.backgroundImage })}
        alignment={content.hero.alignment || 'center'}
      />

      {/* Content Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {content.content && content.content.length > 0 ? (
              <PortableTextRenderer content={content.content} />
            ) : (
              // Fallback content when no CMS content is available
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Welcome to our company. We are dedicated to providing exceptional services 
                  and solutions to help your business grow and succeed.
                </p>
                <h2 className="text-3xl font-semibold text-gray-900 mb-5">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Founded with a vision to make a difference, our company has grown from a 
                  small startup to a trusted partner for businesses of all sizes. We combine 
                  industry expertise with innovative approaches to deliver outstanding results.
                </p>
                <h2 className="text-3xl font-semibold text-gray-900 mb-5">Why Choose Us</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Our commitment to excellence, attention to detail, and customer-first approach 
                  sets us apart. We work closely with our clients to understand their unique needs 
                  and deliver customized solutions that drive real results.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our dedicated professionals bring years of experience and passion to every project.
              </p>
            </div>
            
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src="/images/about-team.svg"
                  alt="Our professional team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TODO: Add additional sections as needed */}
      {/* Example: Team section, Timeline, Awards, etc. */}
      
      {/* TODO: Add call-to-action section */}
      {/* Example: Contact us, Get started, etc. */}
    </main>
  );
}

/**
 * TODO: Enhanced Portable Text Renderer
 * 
 * For a production implementation, consider using @portabletext/react
 * which provides more advanced features like:
 * - Custom component rendering for different block types
 * - Link handling with custom components
 * - Image rendering with Sanity's image URL builder
 * - List rendering (ordered/unordered)
 * - Custom mark rendering (bold, italic, etc.)
 */

/**
 * TODO: Add structured data for SEO
 * 
 * Consider adding JSON-LD structured data for:
 * - Organization information
 * - About page breadcrumbs
 * - Company contact information
 */