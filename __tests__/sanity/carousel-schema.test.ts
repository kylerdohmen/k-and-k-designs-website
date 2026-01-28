/**
 * Carousel Schema Validation Unit Tests
 * 
 * Unit tests for carousel schema validation functions focusing on:
 * - Required field validation
 * - Section ordering constraints
 * - Image upload and optimization
 * 
 * These tests complement the property-based tests by focusing on specific
 * examples, edge cases, and error conditions for schema validation.
 * 
 * Requirements: 5.1, 8.4
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { 
  validateSectionTitle,
  validateHeading,
  validateSubheading,
  validatePortableTextContent,
  validateCarouselImage,
  validateCarouselSectionLimit,
  validateUniqueOrder
} from '../../src/sanity/lib/validation'

// Mock Sanity client for testing
const mockClient = {
  fetch: jest.fn()
} as any

const mockContext = {
  document: { _id: 'test-section-1' },
  getClient: jest.fn(() => mockClient)
} as any

describe('Carousel Schema Validation Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Required Field Validation', () => {
    describe('validateSectionTitle', () => {
      it('should accept valid titles', () => {
        expect(validateSectionTitle('Valid Title')).toBe(true)
        expect(validateSectionTitle('Section 1')).toBe(true)
        expect(validateSectionTitle('Hero Section')).toBe(true)
      })

      it('should reject empty or undefined titles', () => {
        expect(validateSectionTitle('')).toContain('required')
        expect(validateSectionTitle('   ')).toContain('required') // Whitespace only
        expect(validateSectionTitle(undefined)).toContain('required')
      })

      it('should reject titles that are too short after trimming', () => {
        expect(validateSectionTitle('ab')).toContain('3 characters')
        expect(validateSectionTitle('  a  ')).toContain('3 characters')
      })

      it('should reject overly long titles', () => {
        const longTitle = 'a'.repeat(101)
        expect(validateSectionTitle(longTitle)).toContain('100 characters')
      })

      it('should handle edge cases with special characters', () => {
        expect(validateSectionTitle('Section-1')).toBe(true)
        expect(validateSectionTitle('Section & More')).toBe(true)
        expect(validateSectionTitle('Section (Part 1)')).toBe(true)
      })
    })

    describe('validateHeading', () => {
      it('should accept valid headings with proper capitalization', () => {
        expect(validateHeading('Welcome to Our Site')).toBe(true)
        expect(validateHeading('Discover Amazing Stories')).toBe(true)
        expect(validateHeading('Transform Your Business Today')).toBe(true)
      })

      it('should reject empty or undefined headings', () => {
        expect(validateHeading('')).toContain('required')
        expect(validateHeading('   ')).toContain('required')
        expect(validateHeading(undefined)).toContain('required')
      })

      it('should reject headings that are too short', () => {
        expect(validateHeading('Hi')).toContain('5 characters')
        expect(validateHeading('Test')).toContain('5 characters')
        expect(validateHeading('   Hi   ')).toContain('5 characters') // After trimming
      })

      it('should reject overly long headings', () => {
        const longHeading = 'a'.repeat(101)
        expect(validateHeading(longHeading)).toContain('100 characters')
      })

      it('should suggest proper capitalization for all lowercase', () => {
        expect(validateHeading('all lowercase heading')).toContain('capitalization')
        expect(validateHeading('welcome to our site')).toContain('capitalization')
      })

      it('should accept mixed case and proper nouns', () => {
        expect(validateHeading('Welcome to iOS Development')).toBe(true)
        expect(validateHeading('Learn JavaScript Today')).toBe(true)
      })
    })

    describe('validateSubheading', () => {
      it('should accept valid subheadings', () => {
        expect(validateSubheading('A compelling subtitle for engagement')).toBe(true)
        expect(validateSubheading('Discover the power of modern web development')).toBe(true)
      })

      it('should accept undefined subheadings (optional field)', () => {
        expect(validateSubheading(undefined)).toBe(true)
        expect(validateSubheading(null as any)).toBe(true)
      })

      it('should accept empty string subheadings', () => {
        expect(validateSubheading('')).toBe(true)
        expect(validateSubheading('   ')).toBe(true) // Whitespace only
      })

      it('should reject overly long subheadings', () => {
        const longSubheading = 'a'.repeat(201)
        expect(validateSubheading(longSubheading)).toContain('200 characters')
      })

      it('should reject very short non-empty subheadings', () => {
        expect(validateSubheading('short')).toContain('10 characters')
        expect(validateSubheading('tiny')).toContain('10 characters')
      })

      it('should handle edge case at exactly 10 characters', () => {
        expect(validateSubheading('1234567890')).toBe(true) // Exactly 10 chars
        expect(validateSubheading('123456789')).toContain('10 characters') // 9 chars
      })
    })

    describe('validatePortableTextContent', () => {
      it('should accept valid content blocks with meaningful text', () => {
        const validContent = [
          {
            _type: 'block',
            children: [
              { text: 'This is valid content with meaningful text that provides value.' }
            ]
          }
        ]
        expect(validatePortableTextContent(validContent)).toBe(true)
      })

      it('should accept multiple content blocks', () => {
        const multiBlockContent = [
          {
            _type: 'block',
            children: [{ text: 'First paragraph with meaningful content.' }]
          },
          {
            _type: 'block',
            children: [{ text: 'Second paragraph with more content.' }]
          }
        ]
        expect(validatePortableTextContent(multiBlockContent)).toBe(true)
      })

      it('should reject empty or undefined content', () => {
        expect(validatePortableTextContent([])).toContain('required')
        expect(validatePortableTextContent(undefined)).toContain('required')
      })

      it('should reject content blocks without meaningful text', () => {
        const emptyTextContent = [
          {
            _type: 'block',
            children: [{ text: '' }]
          }
        ]
        expect(validatePortableTextContent(emptyTextContent)).toContain('text content')

        const whitespaceContent = [
          {
            _type: 'block',
            children: [{ text: '   ' }]
          }
        ]
        expect(validatePortableTextContent(whitespaceContent)).toContain('text content')
      })

      it('should reject excessively long content', () => {
        const longContent = [
          {
            _type: 'block',
            children: [
              { text: 'a'.repeat(2001) }
            ]
          }
        ]
        expect(validatePortableTextContent(longContent)).toContain('too long')
      })

      it('should handle mixed content types correctly', () => {
        const mixedContent = [
          {
            _type: 'block',
            children: [{ text: 'Valid text content here.' }]
          },
          {
            _type: 'image', // Non-block type should be ignored
            asset: { _ref: 'image-123' }
          }
        ]
        expect(validatePortableTextContent(mixedContent)).toBe(true)
      })

      it('should calculate total length across multiple blocks', () => {
        const multiBlockLongContent = [
          {
            _type: 'block',
            children: [{ text: 'a'.repeat(1000) }]
          },
          {
            _type: 'block',
            children: [{ text: 'b'.repeat(1002) }] // Total > 2000
          }
        ]
        expect(validatePortableTextContent(multiBlockLongContent)).toContain('too long')
      })
    })

    describe('validateCarouselImage', () => {
      it('should accept valid image objects with assets', () => {
        const validImage = {
          asset: { _ref: 'image-123abc' },
          alt: 'Valid alt text for accessibility'
        }
        expect(validateCarouselImage(validImage)).toBe(true)
      })

      it('should accept images without alt text (alt is optional)', () => {
        const imageWithoutAlt = {
          asset: { _ref: 'image-456def' }
        }
        expect(validateCarouselImage(imageWithoutAlt)).toBe(true)
      })

      it('should reject null or undefined images', () => {
        expect(validateCarouselImage(null)).toContain('required')
        expect(validateCarouselImage(undefined)).toContain('required')
      })

      it('should reject images without asset references', () => {
        const imageWithoutAsset = { 
          alt: 'Alt text but no asset reference' 
        }
        expect(validateCarouselImage(imageWithoutAsset)).toContain('upload an image')
      })

      it('should reject images with null assets', () => {
        const imageWithNullAsset = { 
          asset: null,
          alt: 'Alt text with null asset' 
        }
        expect(validateCarouselImage(imageWithNullAsset)).toContain('upload an image')
      })

      it('should handle edge cases with empty objects', () => {
        expect(validateCarouselImage({})).toContain('upload an image')
      })
    })
  })

  describe('Section Ordering Constraints', () => {
    describe('validateUniqueOrder', () => {
      beforeEach(() => {
        mockClient.fetch.mockClear()
      })

      it('should accept unique order numbers', async () => {
        mockClient.fetch.mockResolvedValue([]) // No existing sections with same order
        
        const result = await validateUniqueOrder(1, mockContext as any)
        expect(result).toBe(true)
        expect(mockClient.fetch).toHaveBeenCalledWith(
          expect.stringContaining('*[_type == "carouselSection"'),
          expect.objectContaining({ order: 1 })
        )
      })

      it('should reject duplicate order numbers', async () => {
        mockClient.fetch.mockResolvedValue([{ _id: 'other-section' }]) // Existing section found
        
        const result = await validateUniqueOrder(2, mockContext as any)
        expect(result).toContain('Order 2 is already used')
      })

      it('should handle undefined order numbers', async () => {
        const result = await validateUniqueOrder(undefined, mockContext as any)
        expect(result).toBe(true)
        expect(mockClient.fetch).not.toHaveBeenCalled()
      })

      it('should handle missing document context', async () => {
        const contextWithoutDoc = { 
          getClient: mockContext.getClient,
          document: undefined 
        }
        
        const result = await validateUniqueOrder(1, contextWithoutDoc as any)
        expect(result).toBe(true)
        expect(mockClient.fetch).not.toHaveBeenCalled()
      })

      it('should exclude current document from duplicate check', async () => {
        mockClient.fetch.mockResolvedValue([]) // Should exclude current doc
        
        await validateUniqueOrder(3, mockContext as any)
        
        expect(mockClient.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            order: 3,
            id: 'test-section-1',
            draftId: 'drafts.test-section-1'
          })
        )
      })

      it('should handle draft document IDs correctly', async () => {
        const draftContext = {
          ...mockContext,
          document: { _id: 'drafts.test-section-1' }
        }
        
        mockClient.fetch.mockResolvedValue([])
        
        await validateUniqueOrder(4, draftContext as any)
        
        expect(mockClient.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            id: 'test-section-1', // Should strip 'drafts.' prefix
            draftId: 'drafts.test-section-1'
          })
        )
      })

      it('should handle client fetch errors gracefully', async () => {
        mockClient.fetch.mockRejectedValue(new Error('Network error'))
        
        // Should not throw, but may return error message or true
        const result = await validateUniqueOrder(5, mockContext as any)
        expect(typeof result === 'boolean' || typeof result === 'string').toBe(true)
      })
    })

    describe('validateCarouselSectionLimit', () => {
      it('should accept valid section arrays within limits', async () => {
        const validSections = [
          { _ref: 'section-1' },
          { _ref: 'section-2' },
          { _ref: 'section-3' }
        ]
        expect(await validateCarouselSectionLimit(validSections)).toBe(true)
      })

      it('should accept single section', async () => {
        const singleSection = [{ _ref: 'section-1' }]
        expect(await validateCarouselSectionLimit(singleSection)).toBe(true)
      })

      it('should accept maximum allowed sections', async () => {
        const maxSections = Array(5).fill(0).map((_, i) => ({ _ref: `section-${i + 1}` }))
        expect(await validateCarouselSectionLimit(maxSections)).toBe(true)
      })

      it('should reject empty section arrays', async () => {
        expect(await validateCarouselSectionLimit([])).toContain('required')
      })

      it('should reject undefined section arrays', async () => {
        expect(await validateCarouselSectionLimit(undefined)).toContain('required')
      })

      it('should reject too many sections', async () => {
        const tooManySections = Array(6).fill(0).map((_, i) => ({ _ref: `section-${i + 1}` }))
        const result = await validateCarouselSectionLimit(tooManySections)
        expect(result).toContain('Maximum of 5')
        expect(result).toContain('performance')
      })

      it('should reject duplicate section references', async () => {
        const duplicateSections = [
          { _ref: 'section-1' },
          { _ref: 'section-2' },
          { _ref: 'section-1' } // Duplicate
        ]
        const result = await validateCarouselSectionLimit(duplicateSections)
        expect(result).toContain('Duplicate')
        expect(result).toContain('once')
      })

      it('should handle sections without _ref properties', async () => {
        const sectionsWithoutRefs = [
          { _ref: 'section-1' },
          { title: 'Section without ref' }, // Missing _ref
          { _ref: 'section-2' }
        ]
        // Should still work as filter(Boolean) removes undefined refs
        expect(await validateCarouselSectionLimit(sectionsWithoutRefs)).toBe(true)
      })

      it('should handle mixed valid and invalid references', async () => {
        const mixedSections = [
          { _ref: 'section-1' },
          { _ref: null }, // Invalid ref
          { _ref: 'section-2' },
          { _ref: '' }, // Empty ref
          { _ref: 'section-3' }
        ]
        // Should filter out invalid refs and validate remaining
        expect(await validateCarouselSectionLimit(mixedSections)).toBe(true)
      })

      it('should detect duplicates after filtering invalid refs', async () => {
        const sectionsWithDuplicatesAfterFilter = [
          { _ref: 'section-1' },
          { _ref: null }, // Will be filtered out
          { _ref: 'section-1' }, // Duplicate after filtering
          { _ref: 'section-2' }
        ]
        const result = await validateCarouselSectionLimit(sectionsWithDuplicatesAfterFilter)
        expect(result).toContain('Duplicate')
      })
    })
  })

  describe('Image Upload and Optimization', () => {
    describe('Image Asset Validation', () => {
      it('should validate image assets with proper structure', () => {
        const validImageAsset = {
          asset: {
            _ref: 'image-abc123def456',
            _type: 'reference'
          },
          alt: 'Descriptive alt text for accessibility',
          hotspot: {
            x: 0.5,
            y: 0.5,
            height: 0.8,
            width: 0.8
          }
        }
        expect(validateCarouselImage(validImageAsset)).toBe(true)
      })

      it('should accept images with minimal required fields', () => {
        const minimalImage = {
          asset: { _ref: 'image-minimal123' }
        }
        expect(validateCarouselImage(minimalImage)).toBe(true)
      })

      it('should reject images with malformed asset references', () => {
        const malformedAsset = {
          asset: { _ref: '' } // Empty reference
        }
        expect(validateCarouselImage(malformedAsset)).toContain('upload an image')
      })

      it('should handle images with additional metadata', () => {
        const imageWithMetadata = {
          asset: { _ref: 'image-with-metadata' },
          alt: 'Image with metadata',
          caption: 'Optional caption text',
          crop: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1
          }
        }
        expect(validateCarouselImage(imageWithMetadata)).toBe(true)
      })
    })

    describe('Image Optimization Requirements', () => {
      it('should accept images suitable for optimization', () => {
        // Test that validation doesn't reject images that can be optimized
        const optimizableImage = {
          asset: {
            _ref: 'image-large-photo-12345',
            _type: 'reference'
          },
          alt: 'High resolution photo for carousel background'
        }
        expect(validateCarouselImage(optimizableImage)).toBe(true)
      })

      it('should handle images with hotspot data for responsive cropping', () => {
        const imageWithHotspot = {
          asset: { _ref: 'image-hotspot-enabled' },
          hotspot: {
            x: 0.3,
            y: 0.7,
            height: 0.6,
            width: 0.4
          },
          alt: 'Image with focus point for responsive display'
        }
        expect(validateCarouselImage(imageWithHotspot)).toBe(true)
      })

      it('should validate images intended for different screen sizes', () => {
        // Simulate validation for images that will be optimized for different breakpoints
        const responsiveImage = {
          asset: { _ref: 'image-responsive-background' },
          alt: 'Background image optimized for multiple screen sizes'
        }
        expect(validateCarouselImage(responsiveImage)).toBe(true)
      })
    })

    describe('Image Upload Error Scenarios', () => {
      it('should provide clear error for missing image upload', () => {
        const result = validateCarouselImage(null)
        expect(result).toContain('Background image is required')
        expect(result).toContain('carousel sections')
      })

      it('should provide clear error for incomplete upload', () => {
        const incompleteUpload = {
          alt: 'Alt text provided but upload failed'
          // Missing asset property
        }
        const result = validateCarouselImage(incompleteUpload)
        expect(result).toContain('Please upload an image file')
      })

      it('should handle corrupted asset references', () => {
        const corruptedAsset = {
          asset: {
            _ref: null // Corrupted reference
          },
          alt: 'Image with corrupted asset reference'
        }
        expect(validateCarouselImage(corruptedAsset)).toContain('upload an image')
      })

      it('should handle asset objects without reference', () => {
        const assetWithoutRef = {
          asset: {
            _type: 'reference'
            // Missing _ref property
          },
          alt: 'Asset object without reference'
        }
        expect(validateCarouselImage(assetWithoutRef)).toContain('upload an image')
      })
    })

    describe('Image Accessibility and SEO', () => {
      it('should accept images with comprehensive alt text', () => {
        const accessibleImage = {
          asset: { _ref: 'image-accessible' },
          alt: 'Team of diverse professionals collaborating in a modern office space with natural lighting'
        }
        expect(validateCarouselImage(accessibleImage)).toBe(true)
      })

      it('should accept images without alt text (validation focuses on asset)', () => {
        // Alt text validation might be handled elsewhere, this focuses on asset validation
        const imageWithoutAlt = {
          asset: { _ref: 'image-no-alt' }
        }
        expect(validateCarouselImage(imageWithoutAlt)).toBe(true)
      })

      it('should handle images with empty alt text', () => {
        const imageWithEmptyAlt = {
          asset: { _ref: 'image-empty-alt' },
          alt: '' // Empty alt text
        }
        expect(validateCarouselImage(imageWithEmptyAlt)).toBe(true)
      })
    })
  })

  describe('Integration Tests', () => {
    describe('Complete Section Validation', () => {
      it('should validate a complete carousel section with all required fields', () => {
        const completeSection = {
          title: 'Hero Section',
          heading: 'Transform Your Business Today',
          subheading: 'Discover innovative solutions that drive growth and success',
          content: [
            {
              _type: 'block',
              children: [
                { text: 'Our comprehensive platform helps businesses of all sizes achieve their goals through cutting-edge technology and expert guidance.' }
              ]
            }
          ],
          backgroundImage: {
            asset: { _ref: 'image-hero-background' },
            alt: 'Modern office building with glass facade reflecting blue sky'
          },
          order: 1
        }

        // All individual validations should pass
        expect(validateSectionTitle(completeSection.title)).toBe(true)
        expect(validateHeading(completeSection.heading)).toBe(true)
        expect(validateSubheading(completeSection.subheading)).toBe(true)
        expect(validatePortableTextContent(completeSection.content)).toBe(true)
        expect(validateCarouselImage(completeSection.backgroundImage)).toBe(true)
      })

      it('should identify validation failures in complete sections', () => {
        const incompleteSection = {
          title: 'AB', // Too short
          heading: 'hi', // Too short
          subheading: 'short', // Too short for non-empty subheading
          content: [], // Empty content
          backgroundImage: null, // Missing image
          order: 1
        }

        // All validations should fail
        expect(validateSectionTitle(incompleteSection.title)).not.toBe(true)
        expect(validateHeading(incompleteSection.heading)).not.toBe(true)
        expect(validateSubheading(incompleteSection.subheading)).not.toBe(true)
        expect(validatePortableTextContent(incompleteSection.content)).not.toBe(true)
        expect(validateCarouselImage(incompleteSection.backgroundImage)).not.toBe(true)
      })
    })

    describe('Carousel Configuration Validation', () => {
      it('should validate complete carousel configurations', async () => {
        const validConfiguration = [
          { _ref: 'hero-section' },
          { _ref: 'features-section' },
          { _ref: 'testimonials-section' }
        ]

        expect(await validateCarouselSectionLimit(validConfiguration)).toBe(true)
      })

      it('should handle edge cases in carousel configuration', async () => {
        // Test boundary conditions
        const singleSectionConfig = [{ _ref: 'single-section' }]
        expect(await validateCarouselSectionLimit(singleSectionConfig)).toBe(true)

        const maxSectionConfig = Array(5).fill(0).map((_, i) => ({ _ref: `section-${i}` }))
        expect(await validateCarouselSectionLimit(maxSectionConfig)).toBe(true)

        const overLimitConfig = Array(6).fill(0).map((_, i) => ({ _ref: `section-${i}` }))
        expect(await validateCarouselSectionLimit(overLimitConfig)).not.toBe(true)
      })
    })

    describe('Error Message Quality', () => {
      it('should provide actionable error messages', () => {
        const titleError = validateSectionTitle('')
        expect(titleError).toContain('required')
        expect(titleError).toContain('organization') // Context about why it's needed

        const headingError = validateHeading('hi')
        expect(headingError).toContain('5 characters')
        expect(headingError).toContain('meaningful') // Explains the purpose

        const imageError = validateCarouselImage(null)
        expect(imageError).toContain('required')
        expect(imageError).toContain('carousel sections') // Context
      })

      it('should provide specific guidance for common mistakes', () => {
        const capitalizationError = validateHeading('all lowercase text here')
        expect(capitalizationError).toContain('capitalization')
        expect(capitalizationError).toContain('readability')

        const lengthError = validateSubheading('short')
        expect(lengthError).toContain('10 characters')
        expect(lengthError).toContain('meaningful')
      })
    })
  })
})