/**
 * Contact Page Component
 * 
 * Contact page with contact form, company information, and map integration.
 * Designed to integrate with Sanity CMS for dynamic content management.
 * 
 * Requirements: Contact form, company info display, responsive design
 */

import React from 'react';
import { Metadata } from 'next';
import Hero from '../../components/Hero';
import { getContactPageContent } from '../../lib/sanity.client';

// Enable ISR - page will be regenerated every 60 seconds
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getContactPageContent();
    
    if (!content || !content.seo) {
      // Fallback metadata
      return {
        title: 'Contact Us - Marketing Website',
        description: 'Get in touch with us. We\'d love to hear from you and discuss how we can help your business grow.',
        keywords: ['contact', 'get in touch', 'business inquiry', 'consultation'],
      };
    }

    const { seo } = content;
    
    return {
      title: seo.title || 'Contact Us - Marketing Website',
      description: seo.description || 'Get in touch with us. We\'d love to hear from you and discuss how we can help your business grow.',
      keywords: seo.keywords || ['contact', 'get in touch', 'business inquiry', 'consultation'],
      robots: seo.noIndex ? 'noindex, nofollow' : 'index, follow',
      openGraph: {
        title: seo.title || 'Contact Us - Marketing Website',
        description: seo.description || 'Get in touch with us. We\'d love to hear from you and discuss how we can help your business grow.',
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: seo.title || 'Contact Us - Marketing Website',
        description: seo.description || 'Get in touch with us. We\'d love to hear from you and discuss how we can help your business grow.',
      },
    };
  } catch (error) {
    console.error('Error generating metadata for contact page:', error);
    
    // Return fallback metadata on error
    return {
      title: 'Contact Us - Marketing Website',
      description: 'Get in touch with us. We\'d love to hear from you and discuss how we can help your business grow.',
      keywords: ['contact', 'get in touch', 'business inquiry', 'consultation'],
    };
  }
}

/**
 * Contact Page Component
 * 
 * Displays contact form, company information, and contact details.
 * Includes proper form validation and accessibility features.
 */
export default async function ContactPage() {
  let content: any = null;

  try {
    // Fetch contact page content from Sanity CMS
    content = await getContactPageContent();
  } catch (error) {
    console.error('Error fetching contact page content:', error);
  }

  // Use fallback content if CMS content is not available
  const heroTitle = content?.hero?.title || 'Contact Us';
  const heroSubtitle = content?.hero?.subtitle || 'Get in touch with us. We\'d love to hear from you and discuss how we can help your business grow.';
  
  const formTitle = content?.formSettings?.title || 'Send us a message';
  const subjects = content?.formSettings?.subjects || [
    { label: 'General Inquiry', value: 'general' },
    { label: 'Services Information', value: 'services' },
    { label: 'Request a Quote', value: 'quote' },
    { label: 'Support', value: 'support' },
    { label: 'Partnership Opportunity', value: 'partnership' }
  ];

  const contactInfo = content?.contactInfo || {};
  const address = contactInfo.address || {};
  const businessHours = contactInfo.businessHours || [
    { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { days: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { days: 'Sunday', hours: 'Closed' }
  ];

  const responseMessage = content?.formSettings?.responseMessage || {
    title: 'Quick Response',
    message: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.'
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        alignment="center"
        ctaButtons={[]}
      />

      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{formTitle}</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your first name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject: any, index: number) => (
                      <option key={index} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in touch</h2>
                <p className="text-gray-600 text-lg mb-8">
                  We&apos;re here to help and answer any question you might have. 
                  We look forward to hearing from you.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      {address.street || '123 Business Street'}<br />
                      {address.city || 'City'}, {address.state || 'State'} {address.zipCode || '12345'}<br />
                      {address.country || 'United States'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">
                      <a href={`tel:${contactInfo.phone || '+15551234567'}`} className="hover:text-blue-600 transition-colors">
                        {contactInfo.phone || '(555) 123-4567'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">
                      <a href={`mailto:${contactInfo.email || 'info@yourcompany.com'}`} className="hover:text-blue-600 transition-colors">
                        {contactInfo.email || 'info@yourcompany.com'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                    <div className="text-gray-600">
                      {businessHours.map((hours: any, index: number) => (
                        <p key={index}>{hours.days}: {hours.hours}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">{responseMessage.title}</h3>
                <p className="text-blue-700">
                  {responseMessage.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}