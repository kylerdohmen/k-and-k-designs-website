# Design Document: Folklore Lively Redesign

## Overview

The folklore-lively-redesign transforms a traditional Next.js marketing website into an immersive, storytelling-focused experience centered around a scroll-locked carousel component. The design emphasizes smooth transitions, dynamic backgrounds, and engaging content presentation while maintaining performance and accessibility standards.

The core innovation is a scroll-locked carousel that captures user scroll events and translates them into controlled navigation through three distinct content sections. Each section features unique background imagery and content that transitions smoothly as users scroll, creating a cinematic browsing experience.

## Architecture

### Component Hierarchy

```
App
├── Header (existing)
├── ScrollLockedCarousel (new)
│   ├── CarouselSection (new)
│   │   ├── BackgroundImage (new)
│   │   ├── ContentOverlay (new)
│   │   └── ProgressIndicator (new)
│   └── ScrollController (new)
├── ServicesSection (existing)
└── Footer (existing)
```

### State Management

The application uses a combination of React state and custom hooks for managing carousel behavior:

- **useScrollLock**: Manages scroll capture and release
- **useCarouselProgress**: Tracks progression through sections (0-1 for each section)
- **usePreloader**: Handles background image preloading
- **useSanityContent**: Fetches and formats content from Sanity CMS

### Event Flow

1. User scrolls within carousel viewport
2. ScrollController captures scroll events
3. Progress calculation determines current section and transition state
4. BackgroundImage components update based on progress
5. ContentOverlay animates text and elements
6. At completion, scroll control releases to normal page flow

## Components and Interfaces

### ScrollLockedCarousel Component

```typescript
interface ScrollLockedCarouselProps {
  sections: CarouselSection[]
  className?: string
  onComplete?: () => void
}

interface CarouselSection {
  id: string
  backgroundImage: SanityImageAsset
  content: PortableTextBlock[]
  heading: string
  subheading?: string
}
```

The main carousel component manages the overall scroll-locked experience. It renders three sections and coordinates transitions between them.

### ScrollController Hook

```typescript
interface ScrollControllerState {
  isActive: boolean
  currentSection: number
  sectionProgress: number
  totalProgress: number
}

interface ScrollControllerActions {
  activate: () => void
  deactivate: () => void
  handleScroll: (event: WheelEvent) => void
}
```

Handles scroll event capture, progress calculation, and scroll lock management. Uses requestAnimationFrame for smooth animations.

### BackgroundImage Component

```typescript
interface BackgroundImageProps {
  image: SanityImageAsset
  isActive: boolean
  progress: number
  priority?: boolean
}
```

Renders optimized background images with smooth transitions. Implements preloading and lazy loading strategies.

### ContentOverlay Component

```typescript
interface ContentOverlayProps {
  content: PortableTextBlock[]
  heading: string
  subheading?: string
  progress: number
  isActive: boolean
}
```

Displays text content with animation based on scroll progress. Handles rich text formatting from Sanity CMS.

## Data Models

### Sanity Schema Definitions

```typescript
// Carousel Section Schema
const carouselSection = {
  name: 'carouselSection',
  title: 'Carousel Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      validation: Rule => Rule.required().max(100)
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      validation: Rule => Rule.max(200)
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(3)
    }
  ]
}

// Carousel Configuration Schema
const carouselConfig = {
  name: 'carouselConfig',
  title: 'Carousel Configuration',
  type: 'document',
  fields: [
    {
      name: 'sections',
      title: 'Carousel Sections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'carouselSection' }] }],
      validation: Rule => Rule.required().length(3)
    },
    {
      name: 'transitionDuration',
      title: 'Transition Duration (ms)',
      type: 'number',
      initialValue: 800
    },
    {
      name: 'scrollSensitivity',
      title: 'Scroll Sensitivity',
      type: 'number',
      initialValue: 1.0
    }
  ]
}
```

### TypeScript Interfaces

```typescript
interface CarouselData {
  sections: CarouselSectionData[]
  config: CarouselConfigData
}

interface CarouselSectionData {
  id: string
  title: string
  heading: string
  subheading?: string
  content: PortableTextBlock[]
  backgroundImage: SanityImageAsset
  order: number
}

interface CarouselConfigData {
  transitionDuration: number
  scrollSensitivity: number
}

interface ScrollProgress {
  section: number
  progress: number
  direction: 'forward' | 'backward'
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Scroll Event Handling and Progress Calculation
*For any* scroll event within the carousel viewport, the scroll controller should capture the event, prevent default behavior, and translate scroll distance into bounded section progression (0-3) with proper direction handling and scroll release at completion.
**Validates: Requirements 1.1, 1.2, 1.4, 1.5**

### Property 2: Background Image Display and Responsiveness
*For any* carousel section and viewport dimensions, the background image should display uniquely, maintain aspect ratio, cover the full section area, and adapt appropriately across all responsive breakpoints.
**Validates: Requirements 2.1, 2.4**

### Property 3: Image Preloading and Error Handling
*For any* section transition, the next background image should be preloaded before becoming active, and when image loading fails, appropriate fallback backgrounds should be displayed.
**Validates: Requirements 2.2, 2.5**

### Property 4: Content Updates Without Layout Shift
*For any* content change within a carousel section, text, headings, and interactive elements should update without causing cumulative layout shift or visual disruption.
**Validates: Requirements 2.3**

### Property 5: Design Specification Compliance
*For any* rendered component, font families, weights, sizes, and color values should match the exact specifications from the Figma design, using correct hex values and CSS properties.
**Validates: Requirements 3.2, 3.5**

### Property 6: Responsive and Accessible Behavior
*For any* device type and screen size, the carousel should adapt its behavior appropriately for touch devices, maintain readable layouts on mobile, and provide keyboard navigation alternatives while maintaining WCAG 2.1 AA compliance.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Property 7: CMS Schema and Content Management
*For any* carousel configuration, the Sanity CMS should provide proper schema definitions for sections, allow content reordering and activation control, and reflect content updates through appropriate regeneration mechanisms.
**Validates: Requirements 5.1, 5.2, 5.4**

### Property 8: Rich Text and Media Support
*For any* portable text content from Sanity, the content section should support rich text formatting and media embedding with proper rendering and accessibility attributes.
**Validates: Requirements 5.3**

### Property 9: Image Optimization
*For any* image uploaded to Sanity, the Next.js application should automatically optimize it for web delivery and responsive display with appropriate formats and sizes.
**Validates: Requirements 5.5**

### Property 10: Performance Metrics
*For any* page load and interaction, the application should achieve Core Web Vitals within acceptable ranges (LCP < 2.5s, FID < 100ms, CLS < 0.1) and maintain 60fps during scroll interactions.
**Validates: Requirements 6.1, 6.3**

### Property 11: Loading and Caching Strategies
*For any* carousel load, the application should implement progressive image loading, lazy loading for non-critical assets, and proper caching strategies for static assets and API responses.
**Validates: Requirements 6.2, 6.4**

### Property 12: Graceful Degradation
*For any* scenario where JavaScript fails to load, the content sections should display graceful fallbacks with basic content visibility and functionality.
**Validates: Requirements 6.5**

### Property 13: Component Integration
*For any* existing component interaction, the scroll-locked carousel should integrate without layout conflicts and transition smoothly to existing components like ServicesSection and Footer upon completion.
**Validates: Requirements 7.1, 7.2**

### Property 14: Type Safety and CSS Architecture
*For any* new component or utility, TypeScript types should be properly defined maintaining type safety, and Tailwind CSS should be extended with custom utilities that don't conflict with the existing design system.
**Validates: Requirements 7.3, 7.4**

### Property 15: Test Coverage Maintenance
*For any* new carousel functionality, property-based tests should provide coverage while maintaining existing testing patterns and standards.
**Validates: Requirements 7.5**

### Property 16: Content Parsing and Formatting
*For any* Sanity portable text input, the content parser should transform it into properly formatted HTML, handle embedded media and rich text appropriately, ensure consistent typography and spacing, validate required fields with meaningful error messages, and gracefully handle schema migrations.
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

## Error Handling

### Scroll Event Errors
- **Invalid scroll events**: Validate scroll events before processing and ignore malformed events
- **Scroll lock conflicts**: Detect and resolve conflicts with other scroll-locking components
- **Performance degradation**: Implement throttling and debouncing for scroll events to prevent performance issues

### Content Loading Errors
- **Image load failures**: Implement retry logic with exponential backoff and fallback to placeholder images
- **CMS connection failures**: Cache content locally and provide offline fallbacks
- **Content validation errors**: Provide clear error messages for invalid or missing content fields

### Responsive Design Errors
- **Viewport detection failures**: Implement robust viewport detection with fallbacks
- **Touch event conflicts**: Handle touch event conflicts with other interactive elements
- **Accessibility failures**: Provide alternative navigation methods when primary accessibility features fail

### Performance Errors
- **Memory leaks**: Implement proper cleanup for event listeners and animation frames
- **Animation frame drops**: Detect and adapt to performance constraints by reducing animation complexity
- **Network failures**: Implement progressive enhancement for network-dependent features

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific scenarios with property-based tests for comprehensive coverage:

**Unit Tests Focus:**
- Specific user interaction scenarios (scroll to section 2, keyboard navigation)
- Edge cases (empty content, missing images, network failures)
- Integration points between carousel and existing components
- Error conditions and recovery mechanisms

**Property-Based Tests Focus:**
- Universal scroll behavior across all possible scroll distances and directions
- Content rendering consistency across all possible content structures
- Responsive behavior across all viewport dimensions
- Performance characteristics under various load conditions

### Property-Based Testing Configuration

**Testing Library**: Fast-check for TypeScript/JavaScript property-based testing
**Test Configuration**: Minimum 100 iterations per property test to ensure comprehensive coverage
**Test Tagging**: Each property test references its design document property with format:
- **Feature: folklore-lively-redesign, Property 1: Scroll Event Handling and Progress Calculation**

### Testing Implementation Requirements

- Each correctness property must be implemented by a single property-based test
- Property tests should generate random inputs within valid ranges
- Unit tests should complement property tests by testing specific examples and edge cases
- All tests should maintain the existing testing patterns and integrate with the current test suite
- Performance tests should validate Core Web Vitals and animation frame rates
- Accessibility tests should verify WCAG compliance programmatically where possible