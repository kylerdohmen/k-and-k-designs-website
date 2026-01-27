/**
 * Content Validation Utilities
 * 
 * This module provides helper functions for content sanitization,
 * fallback handling for missing content, and TypeScript guards
 * for content type validation to ensure client-safe CMS content.
 * 
 * Requirements: 7.1, 7.3, 7.4
 */

import { 
  SanityImage, 
  NavigationItem, 
  Service, 
  CtaButton, 
  SocialLink,
  SEOData,
  HomePageContent,
  PortableTextBlock
} from '../types/sanity.types';

// Content sanitization functions
export function sanitizeText(text: unknown): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous HTML tags and scripts
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string') {
    return '#';
  }
  
  // Allow only safe URL protocols
  const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  
  try {
    const urlObj = new URL(url);
    if (safeProtocols.includes(urlObj.protocol)) {
      return url;
    }
  } catch {
    // If URL parsing fails, check for relative URLs
    if (url.startsWith('/') || url.startsWith('#')) {
      return url;
    }
  }
  
  return '#';
}

// TypeScript type guards
export function isValidSanityImage(image: unknown): image is SanityImage {
  return (
    typeof image === 'object' &&
    image !== null &&
    'asset' in image &&
    typeof (image as any).asset === 'object' &&
    (image as any).asset !== null &&
    typeof (image as any).asset._ref === 'string' &&
    (image as any).asset._type === 'reference'
  );
}

export function isValidNavigationItem(item: unknown): item is NavigationItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as any).label === 'string' &&
    typeof (item as any).href === 'string' &&
    (item as any).label.length > 0 &&
    (item as any).href.length > 0
  );
}

export function isValidService(service: unknown): service is Service {
  return (
    typeof service === 'object' &&
    service !== null &&
    typeof (service as any).title === 'string' &&
    typeof (service as any).description === 'string' &&
    (service as any).title.length > 0 &&
    (service as any).description.length > 0
  );
}

export function isValidCtaButton(button: unknown): button is CtaButton {
  return (
    typeof button === 'object' &&
    button !== null &&
    typeof (button as any).text === 'string' &&
    typeof (button as any).href === 'string' &&
    (button as any).text.length > 0 &&
    (button as any).href.length > 0
  );
}

export function isValidSocialLink(link: unknown): link is SocialLink {
  return (
    typeof link === 'object' &&
    link !== null &&
    typeof (link as any).platform === 'string' &&
    typeof (link as any).url === 'string' &&
    (link as any).platform.length > 0 &&
    (link as any).url.length > 0
  );
}

// Fallback content providers
export const fallbackContent = {
  navigation: (): NavigationItem[] => [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' }
  ],
  
  hero: () => ({
    title: 'Welcome to Our Business',
    subtitle: 'Professional services you can trust',
    alignment: 'center' as const
  }),
  
  service: (): Service => ({
    _id: 'fallback-service',
    _type: 'service',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: '1',
    title: 'Our Service',
    description: 'Quality service description',
    slug: { current: 'our-service' }
  }),
  
  ctaButton: (): CtaButton => ({
    text: 'Learn More',
    href: '/about',
    variant: 'primary'
  }),
  
  seo: (): SEOData => ({
    title: 'Professional Business Services',
    description: 'Quality services for your business needs',
    noIndex: false
  }),
  
  companyInfo: () => ({
    name: 'Your Business Name',
    email: 'contact@yourbusiness.com'
  })
};

// Content validation and sanitization functions
export function validateAndSanitizeNavigation(navigation: unknown): NavigationItem[] {
  if (!Array.isArray(navigation)) {
    return fallbackContent.navigation();
  }
  
  const validItems = navigation
    .filter(isValidNavigationItem)
    .map(item => ({
      ...item,
      label: sanitizeText(item.label),
      href: sanitizeUrl(item.href)
    }));
  
  return validItems.length > 0 ? validItems : fallbackContent.navigation();
}

export function validateAndSanitizeServices(services: unknown): Service[] {
  if (!Array.isArray(services)) {
    return [fallbackContent.service()];
  }
  
  const validServices = services
    .filter(isValidService)
    .map(service => ({
      ...service,
      title: sanitizeText(service.title),
      description: sanitizeText(service.description)
    }));
  
  return validServices.length > 0 ? validServices : [fallbackContent.service()];
}

export function validateAndSanitizeCtaButtons(buttons: unknown): CtaButton[] {
  if (!Array.isArray(buttons)) {
    return [];
  }
  
  return buttons
    .filter(isValidCtaButton)
    .map(button => ({
      ...button,
      text: sanitizeText(button.text),
      href: sanitizeUrl(button.href)
    }));
}

export function validateAndSanitizeSocialLinks(links: unknown): SocialLink[] {
  if (!Array.isArray(links)) {
    return [];
  }
  
  return links
    .filter(isValidSocialLink)
    .map(link => ({
      ...link,
      platform: sanitizeText(link.platform),
      url: sanitizeUrl(link.url)
    }));
}

// Content length validation
export function validateContentLength(content: string, maxLength: number = 1000): string {
  const sanitized = sanitizeText(content);
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) + '...' : sanitized;
}

// Image validation
export function validateImage(image: unknown): SanityImage | null {
  return isValidSanityImage(image) ? image : null;
}

// Safe content extraction with fallbacks
export function safeExtractTitle(content: unknown, fallback: string = 'Untitled'): string {
  if (typeof content === 'object' && content !== null && 'title' in content) {
    const title = sanitizeText((content as any).title);
    return title.length > 0 ? title : (fallback.trim().length > 0 ? fallback.trim() : 'Untitled');
  }
  return fallback.trim().length > 0 ? fallback.trim() : 'Untitled';
}

export function safeExtractDescription(content: unknown, fallback: string = ''): string {
  if (typeof content === 'object' && content !== null && 'description' in content) {
    return sanitizeText((content as any).description);
  }
  return fallback;
}

// Page content validators
export function validateHomePageContent(content: unknown): Partial<HomePageContent> {
  if (typeof content !== 'object' || content === null) {
    return {
      hero: fallbackContent.hero(),
      services: {
        title: 'Our Services',
        services: [fallbackContent.service()],
        layout: 'grid'
      },
      seo: fallbackContent.seo()
    };
  }
  
  const typedContent = content as any;
  
  return {
    hero: {
      title: safeExtractTitle(typedContent.hero, 'Welcome to Our Business'),
      ...(safeExtractDescription(typedContent.hero) && { subtitle: safeExtractDescription(typedContent.hero) }),
      alignment: (['left', 'center', 'right'].includes(typedContent.hero?.alignment)) 
        ? typedContent.hero.alignment 
        : 'center',
      ...(validateAndSanitizeCtaButtons(typedContent.hero?.ctaButtons).length > 0 && { 
        ctaButtons: validateAndSanitizeCtaButtons(typedContent.hero?.ctaButtons) 
      }),
      ...(validateImage(typedContent.hero?.backgroundImage) && { 
        backgroundImage: validateImage(typedContent.hero?.backgroundImage)! 
      })
    },
    services: {
      title: safeExtractTitle(typedContent.services, 'Our Services'),
      ...(safeExtractDescription(typedContent.services) && { description: safeExtractDescription(typedContent.services) }),
      services: validateAndSanitizeServices(typedContent.services?.services),
      layout: (['grid', 'list'].includes(typedContent.services?.layout)) 
        ? typedContent.services.layout 
        : 'grid'
    },
    seo: {
      title: safeExtractTitle(typedContent.seo, 'Professional Business Services'),
      description: safeExtractDescription(typedContent.seo, 'Quality services for your business needs'),
      ...(Array.isArray(typedContent.seo?.keywords) && { 
        keywords: typedContent.seo.keywords.filter((k: unknown) => typeof k === 'string')
      }),
      ...(validateImage(typedContent.seo?.ogImage) && { 
        ogImage: validateImage(typedContent.seo?.ogImage)! 
      }),
      noIndex: typeof typedContent.seo?.noIndex === 'boolean' ? typedContent.seo.noIndex : false
    }
  };
}

// Portable text validation (for rich text content)
export function validatePortableText(blocks: unknown): PortableTextBlock[] {
  if (!Array.isArray(blocks)) {
    return [];
  }
  
  return blocks.filter((block): block is PortableTextBlock => {
    return (
      typeof block === 'object' &&
      block !== null &&
      typeof (block as any)._type === 'string' &&
      typeof (block as any)._key === 'string'
    );
  });
}