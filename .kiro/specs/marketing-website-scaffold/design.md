# Design Document: Marketing Website Scaffold

## Overview

The marketing website scaffold is a Next.js application built with TypeScript, Tailwind CSS, and Sanity CMS integration. The design prioritizes maintainability, client safety, and future extensibility while providing a clean foundation for small business marketing websites.

The architecture follows Next.js App Router conventions with a clear separation of concerns: pages handle routing and data fetching, components handle presentation logic, and the CMS client manages content retrieval. All components are designed to be reusable and accept props for dynamic content from Sanity CMS.

## Architecture

### Application Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── about/
│   │   └── page.tsx       # About page
│   ├── services/
│   │   └── page.tsx       # Services page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── ServicesSection.tsx
├── lib/                   # Utility libraries and clients
│   └── sanity.client.ts   # Sanity CMS client configuration
├── styles/                # Styling configuration
│   ├── globals.css        # Global styles and Tailwind imports
│   └── tailwind.config.js # Tailwind configuration
└── types/                 # TypeScript type definitions
    ├── sanity.types.ts    # CMS content types
    └── component.types.ts # Component prop types
```

### Technology Stack

- **Next.js 14+** with App Router for modern React development
- **TypeScript** with strict mode for type safety
- **Tailwind CSS** for utility-first styling
- **Sanity CMS** for headless content management
- **React 18+** for component architecture

### Data Flow

1. **Page Components** fetch content from Sanity CMS using the configured client
2. **Content** is typed using TypeScript interfaces defined in `/types`
3. **Components** receive content as props and render using Tailwind classes
4. **Layout** components (Header/Footer) are shared across all pages
5. **Future API calls** will be integrated at the page level for dynamic functionality

## Components and Interfaces

### Core Components

#### Header Component
```typescript
interface HeaderProps {
  logo?: {
    src: string;
    alt: string;
  };
  navigation: NavigationItem[];
  ctaButton?: {
    text: string;
    href: string;
  };
}
```

The Header component provides site navigation and branding. It accepts a logo object, navigation items array, and optional CTA button. The component is responsive and uses Tailwind for styling.

#### Footer Component
```typescript
interface FooterProps {
  companyInfo: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  socialLinks?: SocialLink[];
  copyrightText: string;
}
```

The Footer component displays company information, social links, and copyright. It's designed to be informative while maintaining a clean layout that works across all pages.

#### Hero Component
```typescript
interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaButtons?: CtaButton[];
  alignment?: 'left' | 'center' | 'right';
}
```

The Hero component creates impactful page headers with customizable content, background images, and call-to-action buttons. It supports different text alignments and responsive design.

#### ServicesSection Component
```typescript
interface ServicesSectionProps {
  title: string;
  description?: string;
  services: Service[];
  layout?: 'grid' | 'list';
}
```

The ServicesSection component displays business services in either grid or list format. Each service includes title, description, and optional icon or image.

### Type Definitions

#### Sanity Content Types
```typescript
interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: SanityImage;
}

interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}
```

#### Page Content Types
```typescript
interface HomePageContent {
  hero: HeroProps;
  services: ServicesSectionProps;
  seo: SEOData;
}

interface AboutPageContent {
  hero: HeroProps;
  content: PortableTextBlock[];
  seo: SEOData;
}
```

## Data Models

### Sanity Schema Structure

The CMS will be configured with schemas for:

1. **Site Settings** - Global site information (logo, contact info, social links)
2. **Navigation** - Menu items and structure
3. **Page Content** - Individual page content blocks
4. **Services** - Service listings with descriptions and media
5. **SEO Settings** - Meta tags and search optimization data

### Content Fetching Pattern

```typescript
// Example content fetching in page components
async function getHomePageContent(): Promise<HomePageContent> {
  const query = `*[_type == "homePage"][0]{
    hero,
    services[]->,
    seo
  }`;
  
  return await sanityClient.fetch(query);
}
```

### Future API Integration Points

The design accommodates future backend integration through:

1. **API Route Handlers** in `src/app/api/` for server-side logic
2. **Client-side Fetch Functions** for dynamic data loading
3. **Form Submission Handlers** for contact forms and lead generation
4. **Authentication Hooks** for protected content areas

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Before defining the correctness properties, let me analyze the acceptance criteria to determine which ones are testable through automated testing.

### Property 1: Page Structure Consistency
*For any* page component in the application, it should follow Next.js App Router conventions and implement proper TypeScript typing
**Validates: Requirements 2.4, 2.5**

### Property 2: Component Interface Compliance
*For any* React component in the components directory, it should accept properly typed props for CMS content and implement strict TypeScript interfaces
**Validates: Requirements 3.5, 3.6**

### Property 3: TypeScript Strict Compliance
*For any* TypeScript file in the application, it should use strict typing without 'any' types and properly type all CMS content structures
**Validates: Requirements 6.1, 4.4**

### Property 4: Tailwind CSS Consistency
*For any* component that applies styling, it should use Tailwind utility classes consistently without other CSS frameworks
**Validates: Requirements 6.2, 8.4**

### Property 5: Content Safety and Validation
*For any* content input from CMS, the components should handle it gracefully without breaking layout integrity and validate content types for compatibility
**Validates: Requirements 7.1, 7.3, 7.4**

### Property 6: Responsive Design Implementation
*For any* component in the application, it should implement responsive design patterns that work across different screen sizes
**Validates: Requirements 8.3**

## Error Handling

### Content Validation
The application implements defensive programming practices to handle various content scenarios:

1. **Missing Content**: Components gracefully handle undefined or null content by providing sensible defaults
2. **Invalid Content Types**: TypeScript interfaces prevent invalid content structure at compile time
3. **Image Loading Errors**: Image components include fallback handling for broken or missing images
4. **Network Failures**: CMS fetching includes error boundaries and retry logic

### Development Error Prevention
1. **TypeScript Strict Mode**: Prevents common runtime errors through compile-time checking
2. **Prop Validation**: Component interfaces ensure proper prop usage
3. **ESLint Configuration**: Enforces code quality and catches potential issues
4. **Build-time Validation**: Next.js build process validates page structure and imports

### Client Safety Measures
1. **Content Sanitization**: All CMS content is properly sanitized before rendering
2. **Layout Protection**: Components are designed to maintain structure regardless of content length
3. **Responsive Breakpoints**: Tailwind responsive classes ensure layouts work across devices
4. **Accessibility Compliance**: Components include proper ARIA attributes and semantic HTML

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific functionality with property-based tests for universal behaviors:

**Unit Tests** focus on:
- Component rendering with specific props
- CMS client configuration and connection
- File structure validation
- TypeScript compilation success
- Tailwind configuration loading

**Property-Based Tests** focus on:
- Component behavior across different content inputs
- TypeScript strict compliance across all files
- Responsive design consistency across components
- Content safety validation across various inputs
- Styling consistency across all components

### Property-Based Testing Configuration

Using **Jest** with **@fast-check/jest** for property-based testing:
- Minimum 100 iterations per property test
- Each property test references its design document property
- Tag format: **Feature: marketing-website-scaffold, Property {number}: {property_text}**

### Testing Implementation Requirements

1. **Component Testing**: Each component should have unit tests for basic rendering and prop handling
2. **Integration Testing**: Page components should be tested with mock CMS data
3. **Build Testing**: Verify that the application builds successfully with TypeScript strict mode
4. **Structure Testing**: Validate that all required files exist in correct directories
5. **Property Testing**: Implement property-based tests for each correctness property defined above

### Test Organization

```
__tests__/
├── components/           # Component unit tests
├── pages/               # Page integration tests
├── lib/                 # Utility and client tests
├── properties/          # Property-based tests
└── setup/              # Test configuration and mocks
```

Each test file should include clear documentation of what it validates and reference the specific requirements it covers.