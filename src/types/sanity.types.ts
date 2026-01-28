/**
 * Sanity CMS Content Type Definitions
 * 
 * This file defines TypeScript interfaces for all content types
 * that will be managed through Sanity CMS. These types ensure
 * type safety when fetching and using CMS content throughout
 * the application.
 */

// Base Sanity types
export interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  _type?: 'image';
  alt?: string;
}

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

// Service types
export interface Service extends SanityDocument {
  title: string;
  description: string;
  icon?: string;
  image?: SanityImage;
  slug?: {
    current: string;
  };
}

// SEO types
export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: SanityImage;
  noIndex?: boolean;
}

// Site settings types
export interface SiteSettings extends SanityDocument {
  title: string;
  description: string;
  logo?: SanityImage;
  favicon?: SanityImage;
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

// Page content types
export interface HomePageContent extends SanityDocument {
  hero: {
    title: string;
    subtitle?: string;
    backgroundImage?: SanityImage;
    ctaButtons?: CtaButton[];
    alignment?: 'left' | 'center' | 'right';
  };
  services: {
    title: string;
    description?: string;
    services: Service[];
    layout?: 'grid' | 'list';
  };
  seo: SEOData;
}

export interface AboutPageContent extends SanityDocument {
  hero: {
    title: string;
    subtitle?: string;
    backgroundImage?: SanityImage;
    alignment?: 'left' | 'center' | 'right';
  };
  content: PortableTextBlock[];
  seo: SEOData;
}

export interface ServicesPageContent extends SanityDocument {
  hero: {
    title: string;
    subtitle?: string;
    backgroundImage?: SanityImage;
    alignment?: 'left' | 'center' | 'right';
  };
  services: {
    title: string;
    description?: string;
    services: Service[];
    layout?: 'grid' | 'list';
  };
  seo: SEOData;
}

// Utility types for CMS content
export interface CtaButton {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isExternal?: boolean;
}

// Portable Text types (for rich text content from Sanity)
export interface PortableTextBlock {
  _type: string;
  _key: string;
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
  style?: string;
  listItem?: string;
  level?: number;
}

export interface PortableTextSpan {
  _type: 'span';
  _key: string;
  text: string;
  marks?: string[];
}

export interface PortableTextMarkDef {
  _type: string;
  _key: string;
  href?: string;
}