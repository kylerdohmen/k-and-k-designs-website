/**
 * Property-Based Tests for Content Safety and Validation
 * Feature: marketing-website-scaffold
 * Property 5: Content Safety and Validation
 * Validates: Requirements 7.1, 7.3, 7.4
 */

import * as fc from 'fast-check'
import {
  sanitizeText,
  sanitizeUrl,
  isValidSanityImage,
  isValidNavigationItem,
  isValidService,
  isValidCtaButton,
  isValidSocialLink,
  validateAndSanitizeNavigation,
  validateAndSanitizeServices,
  validateAndSanitizeCtaButtons,
  validateAndSanitizeSocialLinks,
  validateContentLength,
  validateImage,
  safeExtractTitle,
  safeExtractDescription,
  validateHomePageContent,
  validatePortableText,
  fallbackContent
} from '../../src/lib/content-validation'

describe('Property 5: Content Safety and Validation', () => {
  
  describe('Content Sanitization', () => {
    test('any text input is safely sanitized without breaking layout', () => {
      fc.assert(fc.property(fc.string(), (input) => {
        const sanitized = sanitizeText(input)
        
        // Should always return a string
        expect(typeof sanitized).toBe('string')
        
        // Should not contain dangerous script tags
        expect(sanitized).not.toMatch(/<script/i)
        expect(sanitized).not.toMatch(/<iframe/i)
        expect(sanitized).not.toMatch(/<object/i)
        expect(sanitized).not.toMatch(/<embed/i)
        
        // Should not contain javascript: protocol
        expect(sanitized).not.toMatch(/javascript:/i)
        
        // Should not contain event handlers
        expect(sanitized).not.toMatch(/on\w+\s*=/i)
        
        // Should be trimmed
        expect(sanitized).toBe(sanitized.trim())
      }))
    })

    test('any URL input is safely sanitized to prevent XSS', () => {
      fc.assert(fc.property(fc.string(), (input) => {
        const sanitized = sanitizeUrl(input)
        
        // Should always return a string
        expect(typeof sanitized).toBe('string')
        
        // Should not be empty (fallback to '#' if invalid)
        expect(sanitized.length).toBeGreaterThan(0)
        
        // Should not contain javascript: protocol
        expect(sanitized).not.toMatch(/javascript:/i)
        
        // Should be a safe URL or fallback
        const isValidUrl = sanitized.startsWith('http://') || 
                          sanitized.startsWith('https://') ||
                          sanitized.startsWith('mailto:') ||
                          sanitized.startsWith('tel:') ||
                          sanitized.startsWith('/') ||
                          sanitized.startsWith('#')
        expect(isValidUrl).toBe(true)
      }))
    })

    test('content length validation prevents layout breaking', () => {
      fc.assert(fc.property(fc.string(), fc.integer({ min: 10, max: 2000 }), (content, maxLength) => {
        const validated = validateContentLength(content, maxLength)
        
        // Should always return a string
        expect(typeof validated).toBe('string')
        
        // Should not exceed max length (accounting for ellipsis)
        expect(validated.length).toBeLessThanOrEqual(maxLength + 3)
        
        // Should be sanitized
        expect(validated).not.toMatch(/<script/i)
        
        // If truncated, should end with ellipsis
        if (content.length > maxLength) {
          expect(validated.endsWith('...')).toBe(true)
        }
      }))
    })
  })

  describe('Type Guards and Validation', () => {
    test('any object is correctly validated as SanityImage or rejected', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const isValid = isValidSanityImage(input)
        
        if (isValid) {
          // If valid, should have required structure
          expect(typeof input).toBe('object')
          expect(input).not.toBeNull()
          expect(typeof (input as any).asset).toBe('object')
          expect((input as any).asset).not.toBeNull()
          expect(typeof (input as any).asset._ref).toBe('string')
          expect((input as any).asset._type).toBe('reference')
        } else {
          // If invalid, should not crash the application
          expect(typeof isValid).toBe('boolean')
        }
      }))
    })

    test('any object is correctly validated as NavigationItem or rejected', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const isValid = isValidNavigationItem(input)
        
        if (isValid) {
          // If valid, should have required properties
          expect(typeof input).toBe('object')
          expect(input).not.toBeNull()
          expect(typeof (input as any).label).toBe('string')
          expect(typeof (input as any).href).toBe('string')
          expect((input as any).label.length).toBeGreaterThan(0)
          expect((input as any).href.length).toBeGreaterThan(0)
        }
        
        // Should always return boolean
        expect(typeof isValid).toBe('boolean')
      }))
    })

    test('any object is correctly validated as Service or rejected', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const isValid = isValidService(input)
        
        if (isValid) {
          // If valid, should have required properties
          expect(typeof input).toBe('object')
          expect(input).not.toBeNull()
          expect(typeof (input as any).title).toBe('string')
          expect(typeof (input as any).description).toBe('string')
          expect((input as any).title.length).toBeGreaterThan(0)
          expect((input as any).description.length).toBeGreaterThan(0)
        }
        
        // Should always return boolean
        expect(typeof isValid).toBe('boolean')
      }))
    })

    test('any object is correctly validated as CtaButton or rejected', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const isValid = isValidCtaButton(input)
        
        if (isValid) {
          // If valid, should have required properties
          expect(typeof input).toBe('object')
          expect(input).not.toBeNull()
          expect(typeof (input as any).text).toBe('string')
          expect(typeof (input as any).href).toBe('string')
          expect((input as any).text.length).toBeGreaterThan(0)
          expect((input as any).href.length).toBeGreaterThan(0)
        }
        
        // Should always return boolean
        expect(typeof isValid).toBe('boolean')
      }))
    })

    test('any object is correctly validated as SocialLink or rejected', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const isValid = isValidSocialLink(input)
        
        if (isValid) {
          // If valid, should have required properties
          expect(typeof input).toBe('object')
          expect(input).not.toBeNull()
          expect(typeof (input as any).platform).toBe('string')
          expect(typeof (input as any).url).toBe('string')
          expect((input as any).platform.length).toBeGreaterThan(0)
          expect((input as any).url.length).toBeGreaterThan(0)
        }
        
        // Should always return boolean
        expect(typeof isValid).toBe('boolean')
      }))
    })
  })

  describe('Content Validation with Fallbacks', () => {
    test('any navigation input produces valid navigation array', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const validated = validateAndSanitizeNavigation(input)
        
        // Should always return an array
        expect(Array.isArray(validated)).toBe(true)
        
        // Should never be empty (fallback content)
        expect(validated.length).toBeGreaterThan(0)
        
        // All items should be valid NavigationItems
        validated.forEach(item => {
          expect(typeof item.label).toBe('string')
          expect(typeof item.href).toBe('string')
          expect(item.label.length).toBeGreaterThan(0)
          expect(item.href.length).toBeGreaterThan(0)
          
          // Should be sanitized
          expect(item.label).not.toMatch(/<script/i)
          expect(item.href).not.toMatch(/javascript:/i)
        })
      }))
    })

    test('any services input produces valid services array', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const validated = validateAndSanitizeServices(input)
        
        // Should always return an array
        expect(Array.isArray(validated)).toBe(true)
        
        // Should never be empty (fallback content)
        expect(validated.length).toBeGreaterThan(0)
        
        // All items should be valid Services
        validated.forEach(service => {
          expect(typeof service.title).toBe('string')
          expect(typeof service.description).toBe('string')
          expect(service.title.length).toBeGreaterThan(0)
          expect(service.description.length).toBeGreaterThan(0)
          
          // Should be sanitized
          expect(service.title).not.toMatch(/<script/i)
          expect(service.description).not.toMatch(/<script/i)
        })
      }))
    })

    test('any CTA buttons input produces valid buttons array', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const validated = validateAndSanitizeCtaButtons(input)
        
        // Should always return an array
        expect(Array.isArray(validated)).toBe(true)
        
        // All items should be valid CtaButtons
        validated.forEach(button => {
          expect(typeof button.text).toBe('string')
          expect(typeof button.href).toBe('string')
          expect(button.text.length).toBeGreaterThan(0)
          expect(button.href.length).toBeGreaterThan(0)
          
          // Should be sanitized
          expect(button.text).not.toMatch(/<script/i)
          expect(button.href).not.toMatch(/javascript:/i)
        })
      }))
    })

    test('any social links input produces valid links array', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const validated = validateAndSanitizeSocialLinks(input)
        
        // Should always return an array
        expect(Array.isArray(validated)).toBe(true)
        
        // All items should be valid SocialLinks
        validated.forEach(link => {
          expect(typeof link.platform).toBe('string')
          expect(typeof link.url).toBe('string')
          expect(link.platform.length).toBeGreaterThan(0)
          expect(link.url.length).toBeGreaterThan(0)
          
          // Should be sanitized
          expect(link.platform).not.toMatch(/<script/i)
          expect(link.url).not.toMatch(/javascript:/i)
        })
      }))
    })
  })

  describe('Safe Content Extraction', () => {
    test('any content input safely extracts title with fallback', () => {
      fc.assert(fc.property(fc.anything(), fc.string(), (content, fallback) => {
        const extracted = safeExtractTitle(content, fallback)
        
        // Should always return a string
        expect(typeof extracted).toBe('string')
        
        // Should never be empty (fallback should be used)
        expect(extracted.length).toBeGreaterThan(0)
        
        // Should be sanitized
        expect(extracted).not.toMatch(/<script/i)
        expect(extracted).not.toMatch(/javascript:/i)
        
        // Should be trimmed
        expect(extracted).toBe(extracted.trim())
      }))
    })

    test('any content input safely extracts description', () => {
      fc.assert(fc.property(fc.anything(), (content) => {
        const extracted = safeExtractDescription(content)
        
        // Should always return a string
        expect(typeof extracted).toBe('string')
        
        // Should be sanitized
        expect(extracted).not.toMatch(/<script/i)
        expect(extracted).not.toMatch(/javascript:/i)
        
        // Should be trimmed
        expect(extracted).toBe(extracted.trim())
      }))
    })
  })

  describe('Page Content Validation', () => {
    test('any home page content input produces valid structured content', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const validated = validateHomePageContent(input)
        
        // Should always return an object
        expect(typeof validated).toBe('object')
        expect(validated).not.toBeNull()
        
        // Should have required structure
        expect(validated.hero).toBeDefined()
        expect(validated.services).toBeDefined()
        expect(validated.seo).toBeDefined()
        
        // Hero should be valid
        expect(typeof validated.hero!.title).toBe('string')
        expect(validated.hero!.title.length).toBeGreaterThan(0)
        expect(['left', 'center', 'right']).toContain(validated.hero!.alignment)
        
        // Services should be valid
        expect(typeof validated.services!.title).toBe('string')
        expect(validated.services!.title.length).toBeGreaterThan(0)
        expect(Array.isArray(validated.services!.services)).toBe(true)
        expect(validated.services!.services.length).toBeGreaterThan(0)
        expect(['grid', 'list']).toContain(validated.services!.layout)
        
        // SEO should be valid
        expect(typeof validated.seo!.title).toBe('string')
        expect(validated.seo!.title!.length).toBeGreaterThan(0)
        expect(typeof validated.seo!.description).toBe('string')
        expect(typeof validated.seo!.noIndex).toBe('boolean')
      }))
    })
  })

  describe('Portable Text Validation', () => {
    test('any portable text input produces valid blocks array', () => {
      fc.assert(fc.property(fc.anything(), (input) => {
        const validated = validatePortableText(input)
        
        // Should always return an array
        expect(Array.isArray(validated)).toBe(true)
        
        // All items should be valid PortableTextBlocks
        validated.forEach(block => {
          expect(typeof block._type).toBe('string')
          expect(typeof block._key).toBe('string')
          expect(block._type.length).toBeGreaterThan(0)
          expect(block._key.length).toBeGreaterThan(0)
        })
      }))
    })
  })

  describe('Fallback Content Integrity', () => {
    test('fallback content always provides valid defaults', () => {
      // Test navigation fallback
      const navigation = fallbackContent.navigation()
      expect(Array.isArray(navigation)).toBe(true)
      expect(navigation.length).toBeGreaterThan(0)
      navigation.forEach(item => {
        expect(isValidNavigationItem(item)).toBe(true)
      })

      // Test hero fallback
      const hero = fallbackContent.hero()
      expect(typeof hero.title).toBe('string')
      expect(hero.title.length).toBeGreaterThan(0)
      expect(['left', 'center', 'right']).toContain(hero.alignment)

      // Test service fallback
      const service = fallbackContent.service()
      expect(isValidService(service)).toBe(true)

      // Test CTA button fallback
      const ctaButton = fallbackContent.ctaButton()
      expect(isValidCtaButton(ctaButton)).toBe(true)

      // Test SEO fallback
      const seo = fallbackContent.seo()
      expect(typeof seo.title).toBe('string')
      expect(typeof seo.description).toBe('string')
      expect(seo.title!.length).toBeGreaterThan(0)
      expect(seo.description!.length).toBeGreaterThan(0)

      // Test company info fallback
      const companyInfo = fallbackContent.companyInfo()
      expect(typeof companyInfo.name).toBe('string')
      expect(typeof companyInfo.email).toBe('string')
      expect(companyInfo.name.length).toBeGreaterThan(0)
      expect(companyInfo.email.length).toBeGreaterThan(0)
    })
  })

  describe('Layout Protection', () => {
    test('content validation prevents layout breaking through CMS edits', () => {
      // Test with potentially layout-breaking content
      const maliciousContent = {
        hero: {
          title: '<script>alert("xss")</script>' + 'A'.repeat(10000),
          subtitle: 'javascript:void(0)',
          alignment: 'invalid-alignment'
        },
        services: {
          title: '<iframe src="evil.com"></iframe>',
          services: [
            { title: '', description: '' }, // Empty content
            { title: 'A'.repeat(5000), description: 'B'.repeat(5000) }, // Very long content
            'invalid-service-object' // Wrong type
          ]
        }
      }

      const validated = validateHomePageContent(maliciousContent)

      // Should sanitize and provide safe defaults
      expect(validated.hero!.title).not.toMatch(/<script/i)
      expect(validated.hero!.title.length).toBeGreaterThan(0)
      expect(['left', 'center', 'right']).toContain(validated.hero!.alignment)
      
      expect(validated.services!.title).not.toMatch(/<iframe/i)
      expect(validated.services!.title.length).toBeGreaterThan(0)
      expect(validated.services!.services.length).toBeGreaterThan(0)
      
      // All services should be valid
      validated.services!.services.forEach(service => {
        expect(typeof service.title).toBe('string')
        expect(typeof service.description).toBe('string')
        expect(service.title.length).toBeGreaterThan(0)
        expect(service.description.length).toBeGreaterThan(0)
      })
    })
  })
})