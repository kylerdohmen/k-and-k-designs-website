import React from 'react';
import Link from 'next/link';
import { FooterProps } from '@/types/component.types';

/**
 * Footer Component
 * 
 * Site footer with company information, social links, and copyright.
 * Designed to be responsive and integrate with Sanity CMS for
 * dynamic content management.
 * 
 * CMS Integration Points:
 * - Company information from Sanity site settings
 * - Social links from Sanity social media schema
 * - Copyright text from Sanity site settings
 * - Optional navigation links from Sanity navigation schema
 */
export default function Footer({ 
  companyInfo, 
  socialLinks, 
  copyrightText, 
  navigation 
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{companyInfo.name}</h3>
            <div className="space-y-2 text-gray-300">
              {companyInfo.address && (
                <p className="flex items-start">
                  <svg 
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  {companyInfo.address}
                </p>
              )}
              {companyInfo.phone && (
                <p className="flex items-center">
                  <svg 
                    className="w-5 h-5 mr-2 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a 
                    href={`tel:${companyInfo.phone}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {companyInfo.phone}
                  </a>
                </p>
              )}
              {companyInfo.email && (
                <p className="flex items-center">
                  <svg 
                    className="w-5 h-5 mr-2 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a 
                    href={`mailto:${companyInfo.email}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {companyInfo.email}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Navigation Links (if provided) */}
          {navigation && navigation.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                      {...(item.isExternal && { 
                        target: '_blank', 
                        rel: 'noopener noreferrer' 
                      })}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    {social.icon ? (
                      <span className="text-xl">{social.icon}</span>
                    ) : (
                      <span className="text-sm font-medium">
                        {social.platform}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {copyrightText.replace('{year}', currentYear.toString())}
            </p>
            
            {/* CMS Integration: Additional footer links can be added here */}
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}