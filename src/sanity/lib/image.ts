import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

/**
 * Generate optimized image URLs for carousel backgrounds
 * Provides responsive image URLs with proper optimization settings
 */
export const urlForCarouselBackground = (source: SanityImageSource) => {
  return builder
    .image(source)
    .format('webp')
    .quality(85)
    .fit('crop')
    .crop('focalpoint')
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export const urlForResponsive = (source: SanityImageSource, width: number, height?: number) => {
  const imageBuilder = builder
    .image(source)
    .format('webp')
    .quality(85)
    .width(width)
    .fit('crop')
    .crop('focalpoint')
  
  if (height) {
    imageBuilder.height(height)
  }
  
  return imageBuilder
}

/**
 * Generate image URLs with fallback formats for better browser support
 */
export const urlForWithFallback = (source: SanityImageSource, width?: number) => {
  const baseBuilder = builder.image(source)
  
  if (width) {
    baseBuilder.width(width)
  }
  
  return {
    webp: baseBuilder.format('webp').quality(85).url(),
    jpg: baseBuilder.format('jpg').quality(85).url(),
    original: baseBuilder.url(),
  }
}

/**
 * Carousel-specific image optimization presets
 */
export const carouselImagePresets = {
  mobile: (source: SanityImageSource) => 
    urlForResponsive(source, 768, 1024),
  tablet: (source: SanityImageSource) => 
    urlForResponsive(source, 1024, 768),
  desktop: (source: SanityImageSource) => 
    urlForResponsive(source, 1920, 1080),
  ultrawide: (source: SanityImageSource) => 
    urlForResponsive(source, 2560, 1440),
}
