'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderProps } from '@/types/component.types';

/**
 * Header Component
 * 
 * Responsive navigation header with logo, navigation items, and CTA button.
 * Includes mobile menu functionality and is designed to integrate with
 * Sanity CMS content for dynamic navigation and branding.
 * 
 * CMS Integration Points:
 * - Logo image and alt text from Sanity asset management
 * - Navigation items from Sanity navigation schema
 * - CTA button text and styling from Sanity site settings
 */
export default function Header({ logo, navigation, ctaButton }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {logo ? (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {/* CMS Integration: Company name from Sanity site settings */}
                  Your Company
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                {...(item.isExternal && { 
                  target: '_blank', 
                  rel: 'noopener noreferrer' 
                })}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {ctaButton && (
              <Link
                href={ctaButton.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  ctaButton.variant === 'secondary'
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : ctaButton.variant === 'outline'
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {ctaButton.text}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
          {navigation.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
              {...(item.isExternal && { 
                target: '_blank', 
                rel: 'noopener noreferrer' 
              })}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Mobile CTA Button */}
          {ctaButton && (
            <div className="pt-4 pb-2">
              <Link
                href={ctaButton.href}
                className={`block w-full text-center px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  ctaButton.variant === 'secondary'
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : ctaButton.variant === 'outline'
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {ctaButton.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}