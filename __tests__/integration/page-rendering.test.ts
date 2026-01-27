/**
 * Page Rendering Integration Tests
 * 
 * Tests that verify each page renders correctly with mock CMS data
 * and that component integration and prop passing work as expected.
 * 
 * Requirements: 2.1, 2.2, 2.3, 4.2
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import HomePage from '../../src/app/page';
import AboutPage from '../../src/app/about/page';
import ServicesPage from '../../src/app/services/page';

// Mock Next.js modules
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props);
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}));

// Mock Sanity client to return predictable test data
jest.mock('../../src/lib/sanity.client', () => ({
  __esModule: true,
  getHomePageContent: jest.fn(),
  getAboutPageContent: jest.fn(),
  getServicesPageContent: jest.fn(),
  getAllServices: jest.fn(),
  default: {},
}));

import {
  getHomePageContent,
  getAboutPageContent,
  getServicesPageContent,
  getAllServices,
} from '../../src/lib/sanity.client';

// Mock data for testing
const mockServices = [
  {
    _id: 'service-1',
    _type: 'service',
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: '1',
    title: 'Web Development',
    description: 'Professional web development services using modern technologies.',
    icon: '💻',
    slug: { current: 'web-development' }
  },
  {
    _id: 'service-2',
    _type: 'service',
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: '1',
    title: 'Digital Marketing',
    description: 'Comprehensive digital marketing strategies to grow your business.',
    icon: '📈',
    slug: { current: 'digital-marketing' }
  }
];

const mockHomePageContent = {
  _id: 'home-page',
  _type: 'homePage',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  _rev: '1',
  hero: {
    title: 'Welcome to Our Business',
    subtitle: 'Professional services tailored to your needs',
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
    description: 'Discover what we can do for you',
    services: mockServices,
    layout: 'grid' as const
  },
  seo: {
    title: 'Home - Test Website',
    description: 'Test home page description'
  }
};

const mockAboutPageContent = {
  _id: 'about-page',
  _type: 'aboutPage',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  _rev: '1',
  hero: {
    title: 'About Us',
    subtitle: 'Learn more about our company and mission',
    alignment: 'center' as const
  },
  content: [
    {
      _type: 'block',
      _key: 'test-block-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'test-span-1',
          text: 'We are a dedicated team of professionals committed to excellence.',
          marks: []
        }
      ]
    },
    {
      _type: 'block',
      _key: 'test-block-2',
      style: 'h2',
      children: [
        {
          _type: 'span',
          _key: 'test-span-2',
          text: 'Our Mission',
          marks: []
        }
      ]
    }
  ],
  seo: {
    title: 'About Us - Test Website',
    description: 'Test about page description'
  }
};

const mockServicesPageContent = {
  _id: 'services-page',
  _type: 'servicesPage',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  _rev: '1',
  hero: {
    title: 'Our Services',
    subtitle: 'Comprehensive solutions for your business needs',
    alignment: 'center' as const
  },
  services: {
    title: 'What We Offer',
    description: 'Explore our range of professional services',
    services: mockServices,
    layout: 'grid' as const
  },
  seo: {
    title: 'Services - Test Website',
    description: 'Test services page description'
  }
};

describe('Page Rendering Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('Home Page', () => {
    it('should render home page with CMS content', async () => {
      // Mock the CMS data
      (getHomePageContent as jest.Mock).mockResolvedValue(mockHomePageContent);
      (getAllServices as jest.Mock).mockResolvedValue(mockServices);

      // Render the page component
      const HomePageComponent = await HomePage();
      render(HomePageComponent);

      // Verify hero section content
      expect(screen.getByText('Welcome to Our Business')).toBeInTheDocument();
      expect(screen.getByText('Professional services tailored to your needs')).toBeInTheDocument();
      
      // Verify CTA buttons
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();

      // Verify services section
      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.getByText('Discover what we can do for you')).toBeInTheDocument();
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('Digital Marketing')).toBeInTheDocument();
    });

    it('should render home page with fallback content when CMS fails', async () => {
      // Mock CMS failure
      (getHomePageContent as jest.Mock).mockResolvedValue(null);
      (getAllServices as jest.Mock).mockResolvedValue([]);

      // Render the page component
      const HomePageComponent = await HomePage();
      render(HomePageComponent);

      // Verify fallback content is displayed
      expect(screen.getByText('Welcome to Our Business')).toBeInTheDocument();
      expect(screen.getByText('Our Services')).toBeInTheDocument();
    });

    it('should pass correct props to components', async () => {
      // Mock the CMS data
      (getHomePageContent as jest.Mock).mockResolvedValue(mockHomePageContent);
      (getAllServices as jest.Mock).mockResolvedValue(mockServices);

      // Render the page component
      const HomePageComponent = await HomePage();
      render(HomePageComponent);

      // Verify Hero component receives correct props
      const heroTitle = screen.getByText('Welcome to Our Business');
      expect(heroTitle).toBeInTheDocument();
      expect(heroTitle.tagName).toBe('H1');

      // Verify ServicesSection component receives correct props
      const servicesTitle = screen.getByText('Our Services');
      expect(servicesTitle).toBeInTheDocument();
      expect(servicesTitle.tagName).toBe('H2');

      // Verify service items are rendered
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('Professional web development services using modern technologies.')).toBeInTheDocument();
    });
  });

  describe('About Page', () => {
    it('should render about page with CMS content', async () => {
      // Mock the CMS data
      (getAboutPageContent as jest.Mock).mockResolvedValue(mockAboutPageContent);

      // Render the page component
      const AboutPageComponent = await AboutPage();
      render(AboutPageComponent);

      // Verify hero section content
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Learn more about our company and mission')).toBeInTheDocument();

      // Verify portable text content
      expect(screen.getByText('We are a dedicated team of professionals committed to excellence.')).toBeInTheDocument();
      expect(screen.getByText('Our Mission')).toBeInTheDocument();
    });

    it('should render about page with fallback content when CMS fails', async () => {
      // Mock CMS failure
      (getAboutPageContent as jest.Mock).mockResolvedValue(null);

      // Render the page component
      const AboutPageComponent = await AboutPage();
      render(AboutPageComponent);

      // Verify fallback content is displayed
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Welcome to our company. We are a dedicated team of professionals committed to delivering exceptional services and solutions to our clients. Our mission is to help businesses grow and succeed through innovative approaches and personalized attention.')).toBeInTheDocument();
    });

    it('should render portable text content correctly', async () => {
      // Mock the CMS data
      (getAboutPageContent as jest.Mock).mockResolvedValue(mockAboutPageContent);

      // Render the page component
      const AboutPageComponent = await AboutPage();
      render(AboutPageComponent);

      // Verify different text styles are rendered correctly
      const missionHeading = screen.getByText('Our Mission');
      expect(missionHeading).toBeInTheDocument();
      expect(missionHeading.tagName).toBe('H2');

      const bodyText = screen.getByText('We are a dedicated team of professionals committed to excellence.');
      expect(bodyText).toBeInTheDocument();
      expect(bodyText.tagName).toBe('P');
    });
  });

  describe('Services Page', () => {
    it('should render services page with CMS content', async () => {
      // Mock the CMS data
      (getServicesPageContent as jest.Mock).mockResolvedValue(mockServicesPageContent);
      (getAllServices as jest.Mock).mockResolvedValue(mockServices);

      // Render the page component
      const ServicesPageComponent = await ServicesPage();
      render(ServicesPageComponent);

      // Verify hero section content
      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive solutions for your business needs')).toBeInTheDocument();

      // Verify services section
      expect(screen.getByText('What We Offer')).toBeInTheDocument();
      expect(screen.getByText('Explore our range of professional services')).toBeInTheDocument();
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('Digital Marketing')).toBeInTheDocument();
    });

    it('should render services page with fallback content when CMS fails', async () => {
      // Mock CMS failure
      (getServicesPageContent as jest.Mock).mockResolvedValue(null);
      (getAllServices as jest.Mock).mockResolvedValue([]);

      // Render the page component
      const ServicesPageComponent = await ServicesPage();
      render(ServicesPageComponent);

      // Verify fallback content is displayed
      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.getByText('What We Offer')).toBeInTheDocument();
    });

    it('should render additional sections correctly', async () => {
      // Mock the CMS data
      (getServicesPageContent as jest.Mock).mockResolvedValue(mockServicesPageContent);
      (getAllServices as jest.Mock).mockResolvedValue(mockServices);

      // Render the page component
      const ServicesPageComponent = await ServicesPage();
      render(ServicesPageComponent);

      // Verify additional sections are present
      expect(screen.getByText('Why Choose Our Services?')).toBeInTheDocument();
      expect(screen.getByText('Proven Results')).toBeInTheDocument();
      expect(screen.getByText('Expert Team')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate Hero and ServicesSection components correctly on home page', async () => {
      // Mock the CMS data
      (getHomePageContent as jest.Mock).mockResolvedValue(mockHomePageContent);
      (getAllServices as jest.Mock).mockResolvedValue(mockServices);

      // Render the page component
      const HomePageComponent = await HomePage();
      render(HomePageComponent);

      // Verify both components are present and properly integrated
      const heroSection = screen.getByText('Welcome to Our Business').closest('section');
      const servicesSection = screen.getByText('Our Services').closest('section');

      expect(heroSection).toBeInTheDocument();
      expect(servicesSection).toBeInTheDocument();

      // Verify the sections are in the correct order
      const main = screen.getByRole('main');
      const sections = main.querySelectorAll('section');
      expect(sections).toHaveLength(2);
    });

    it('should handle empty services array gracefully', async () => {
      // Mock CMS data with empty services
      const mockContentWithEmptyServices = {
        ...mockHomePageContent,
        services: {
          ...mockHomePageContent.services,
          services: []
        }
      };

      (getHomePageContent as jest.Mock).mockResolvedValue(mockContentWithEmptyServices);
      (getAllServices as jest.Mock).mockResolvedValue([]);

      // Render the page component
      const HomePageComponent = await HomePage();
      render(HomePageComponent);

      // Verify empty state is handled
      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.getByText('No services available')).toBeInTheDocument();
    });

    it('should render CTA buttons with correct links', async () => {
      // Mock the CMS data
      (getHomePageContent as jest.Mock).mockResolvedValue(mockHomePageContent);
      (getAllServices as jest.Mock).mockResolvedValue(mockServices);

      // Render the page component
      const HomePageComponent = await HomePage();
      render(HomePageComponent);

      // Verify CTA buttons have correct hrefs
      const getStartedButton = screen.getByText('Get Started');
      const learnMoreButton = screen.getByText('Learn More');

      expect(getStartedButton.closest('a')).toHaveAttribute('href', '/services');
      expect(learnMoreButton.closest('a')).toHaveAttribute('href', '/about');
    });
  });

  describe('Error Handling', () => {
    it('should handle CMS errors gracefully', async () => {
      // Mock CMS errors
      (getHomePageContent as jest.Mock).mockRejectedValue(new Error('CMS Error'));
      (getAllServices as jest.Mock).mockRejectedValue(new Error('Services Error'));

      // Render the page component
      const HomePageComponent = await HomePage();
      render(HomePageComponent);

      // Verify fallback content is displayed even with errors
      expect(screen.getByText('Welcome to Our Business')).toBeInTheDocument();
      expect(screen.getByText('Our Services')).toBeInTheDocument();
    });

    it('should handle malformed CMS data gracefully', async () => {
      // Mock malformed CMS data
      (getHomePageContent as jest.Mock).mockResolvedValue({
        hero: { title: null }, // Invalid data
        services: null
      });
      (getAllServices as jest.Mock).mockResolvedValue(null);

      // Render the page component
      const HomePageComponent = await HomePage();
      render(HomePageComponent);

      // Verify fallback content is used (the component should handle null title gracefully)
      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.getByText('No services available')).toBeInTheDocument();
    });
  });
});