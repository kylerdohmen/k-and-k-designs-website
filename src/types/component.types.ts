/**
 * Component Prop Type Definitions
 * 
 * This file defines TypeScript interfaces for all React component props
 * used throughout the application. These types ensure type safety when
 * passing data between components and integrating with CMS content.
 */

import React from 'react';
import { NavigationItem, SanityImage, Service, CtaButton, SocialLink } from './sanity.types';

// Header component props
export interface HeaderProps {
  logo?: {
    src: string;
    alt: string;
  };
  navigation: NavigationItem[];
  ctaButton?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
}

// Footer component props
export interface FooterProps {
  companyInfo: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  socialLinks?: SocialLink[];
  copyrightText: string;
  navigation?: NavigationItem[];
}

// Hero component props
export interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | SanityImage;
  ctaButtons?: CtaButton[];
  alignment?: 'left' | 'center' | 'right';
  variant?: 'default' | 'minimal' | 'overlay';
}

// Services section component props
export interface ServicesSectionProps {
  title: string;
  description?: string;
  services: Service[];
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
}

// Utility component types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  isExternal?: boolean;
  className?: string;
}

export interface LinkProps {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
  className?: string;
  variant?: 'default' | 'button' | 'nav';
}

export interface ImageProps {
  src: string | SanityImage;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

// Card component props
export interface CardProps {
  title?: string;
  description?: string;
  image?: string | SanityImage;
  href?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'service' | 'feature';
  className?: string;
}

// Section wrapper props
export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'gray' | 'primary' | 'transparent';
}

// Layout component props
export interface LayoutProps {
  children: React.ReactNode;
  header?: HeaderProps;
  footer?: FooterProps;
  className?: string;
}

// Common utility types
export type Alignment = 'left' | 'center' | 'right';
export type Size = 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';

// Responsive breakpoint types
export interface ResponsiveValue<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

// Form component types (for future use)
export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export interface ContactFormProps {
  title?: string;
  description?: string;
  fields: FormFieldProps[];
  submitText?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

// Re-export carousel types for convenience
export type {
  ScrollLockedCarouselProps,
  CarouselSectionProps,
  BackgroundImageProps,
  ContentOverlayProps,
  ProgressIndicatorProps,
  CarouselSection,
  CarouselData,
  ScrollProgress,
} from './carousel.types';