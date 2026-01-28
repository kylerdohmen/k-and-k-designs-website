/**
 * useSanityContent Hook
 * 
 * Custom hook for fetching and managing carousel content from Sanity CMS.
 * Handles content fetching, transformation, validation, and error states.
 */

import { useState, useEffect, useCallback } from 'react';
import { client } from '@/sanity/lib/client';
import { UseSanityContentReturn, CarouselData } from '@/types/carousel.types';

const CAROUSEL_QUERY = `
  *[_type == "carouselConfig"][0] {
    sections[]-> {
      _id,
      title,
      heading,
      subheading,
      content,
      backgroundImage {
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt
      },
      order
    },
    transitionDuration,
    scrollSensitivity
  }
`;

export function useSanityContent(): UseSanityContentReturn {
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCarouselData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await client.fetch(CAROUSEL_QUERY);
      
      if (!data) {
        throw new Error('No carousel configuration found in Sanity CMS');
      }

      // Validate and transform the data
      const transformedData: CarouselData = {
        sections: (data.sections || [])
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((section: any, index: number) => ({
            id: section._id || `section-${index}`,
            title: section.title || `Section ${index + 1}`,
            heading: section.heading || '',
            subheading: section.subheading || undefined,
            content: section.content || [],
            backgroundImage: {
              asset: {
                _ref: section.backgroundImage?.asset?._id || '',
                _type: 'reference' as const,
              },
              alt: section.backgroundImage?.alt || `Background image for ${section.title}`,
            },
            order: section.order || index,
          })),
        config: {
          transitionDuration: data.transitionDuration || 800,
          scrollSensitivity: data.scrollSensitivity || 1.0,
        },
      };

      // Validate that we have at least one section
      if (transformedData.sections.length === 0) {
        throw new Error('No carousel sections found in Sanity CMS');
      }

      setCarouselData(transformedData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch carousel data');
      setError(error);
      console.error('Error fetching carousel data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchCarouselData();
  }, [fetchCarouselData]);

  // Initial fetch
  useEffect(() => {
    fetchCarouselData();
  }, [fetchCarouselData]);

  return {
    carouselData,
    isLoading,
    error,
    refetch,
  };
}