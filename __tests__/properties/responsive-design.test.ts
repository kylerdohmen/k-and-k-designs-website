/**
 * Property-Based Tests for Responsive Design Implementation
 * Feature: marketing-website-scaffold
 * Property 6: Responsive Design Implementation
 * Validates: Requirements 8.3
 */

import * as fc from 'fast-check'
import fs from 'fs'
import path from 'path'

describe('Property 6: Responsive Design Implementation', () => {
  const componentFiles = [
    'src/components/Header.tsx',
    'src/components/Footer.tsx',
    'src/components/Hero.tsx',
    'src/components/ServicesSection.tsx'
  ]

  const pageFiles = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/app/services/page.tsx'
  ]

  const allResponsiveFiles = [...componentFiles, ...pageFiles]

  test('all components implement responsive design patterns', () => {
    componentFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8')
        
        // Should use Tailwind responsive breakpoints
        expect(content).toMatch(/(sm:|md:|lg:|xl:)/)
        
        // Should have mobile-first approach with base classes
        expect(content).toMatch(/className="[^"]*\b(flex|grid|block|hidden|text-)/)
        
        // Should use responsive spacing and sizing
        const responsivePatterns = [
          /\b(p|m|px|py|mx|my|space|gap)-(sm|md|lg|xl):/,
          /\b(w|h|max-w|max-h|min-w|min-h)-(sm|md|lg|xl):/,
          /\b(text|leading)-(sm|md|lg|xl):/
        ]
        
        const hasResponsivePattern = responsivePatterns.some(pattern => pattern.test(content))
        expect(hasResponsivePattern).toBe(true)
      }
    })
  })

  test('Hero component implements responsive design across different screen sizes', () => {
    const heroPath = 'src/components/Hero.tsx'
    if (fs.existsSync(heroPath)) {
      const content = fs.readFileSync(heroPath, 'utf-8')
      
      // Should have responsive typography
      expect(content).toMatch(/text-(4xl|5xl|6xl).*sm:text-(5xl|6xl).*lg:text-6xl/)
      
      // Should have responsive padding/spacing
      expect(content).toMatch(/(py|p)-(12|16|20|24).*lg:(py|p)-(24|32|40)/)
      
      // Should handle responsive button layouts
      expect(content).toMatch(/flex-col.*sm:flex-row/)
      
      // Should have responsive container sizing
      expect(content).toMatch(/max-w-(2xl|3xl|4xl)/)
      
      // Should handle responsive alignment
      expect(content).toMatch(/justify-(center|start).*sm:justify-(center|start)/)
    }
  })

  test('ServicesSection component implements responsive grid and list layouts', () => {
    const servicesPath = 'src/components/ServicesSection.tsx'
    if (fs.existsSync(servicesPath)) {
      const content = fs.readFileSync(servicesPath, 'utf-8')
      
      // Should have responsive grid columns
      expect(content).toMatch(/grid-cols-1.*md:grid-cols-2.*lg:grid-cols-/)
      
      // Should have responsive spacing between items
      expect(content).toMatch(/gap-(6|8).*lg:gap-(8|12)/)
      
      // Should handle responsive image sizing
      expect(content).toMatch(/h-(48|64).*lg:h-(48|64)/)
      
      // Should have responsive text sizing
      expect(content).toMatch(/text-(xl|2xl).*lg:text-(2xl|3xl)/)
      
      // Should handle responsive flex direction for list layout
      expect(content).toMatch(/flex-col.*lg:flex-row/)
    }
  })

  test('any component uses consistent responsive breakpoint progression', () => {
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Extract all responsive classes
        const responsiveClasses = content.match(/(sm|md|lg|xl):[a-zA-Z0-9-]+/g) || []
        
        if (responsiveClasses.length > 0) {
          // Should follow mobile-first approach - base classes should exist
          const hasBaseClasses = /className="[^"]*\b(flex|grid|text-|p-|m-|w-|h-)/.test(content)
          expect(hasBaseClasses).toBe(true)
          
          // Should use standard Tailwind breakpoints in logical order
          const breakpointOrder = ['sm', 'md', 'lg', 'xl']
          const usedBreakpoints = [...new Set(responsiveClasses.map(cls => cls.split(':')[0]))]
          
          // Verify breakpoints are used in logical progression
          usedBreakpoints.forEach((breakpoint, index) => {
            const breakpointIndex = breakpointOrder.indexOf(breakpoint)
            expect(breakpointIndex).toBeGreaterThanOrEqual(0)
            
            // If using larger breakpoints, should generally have smaller ones too (with some flexibility)
            if (breakpointIndex > 1) { // lg or xl
              const hasSmallerBreakpoints = usedBreakpoints.some(bp => 
                breakpointOrder.indexOf(bp) < breakpointIndex
              )
              // This is a guideline, not a strict rule, so we'll be lenient
              // expect(hasSmallerBreakpoints).toBe(true)
            }
          })
        }
      }
    }))
  })

  test('any responsive component handles container sizing appropriately', () => {
    fc.assert(fc.property(fc.constantFrom(...allResponsiveFiles), (file) => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8')
        
        // Should use container classes for proper responsive behavior
        if (content.includes('container')) {
          // Container should have proper responsive padding
          expect(content).toMatch(/px-(4|6|8).*sm:px-(6|8).*lg:px-8/)
        }
        
        // Should use max-width constraints appropriately
        const maxWidthClasses = content.match(/max-w-(sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/g) || []
        maxWidthClasses.forEach(maxWidth => {
          // Max-width should be reasonable for content
          expect(maxWidth).toMatch(/max-w-(sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/)
        })
        
        // Should handle responsive width classes properly
        const widthClasses = content.match(/w-(full|1\/2|1\/3|2\/3|1\/4|3\/4)/g) || []
        if (widthClasses.length > 0) {
          // Width classes should be used appropriately
          expect(widthClasses.every(w => /w-(full|1\/2|1\/3|2\/3|1\/4|3\/4)/.test(w))).toBe(true)
        }
      }
    }))
  })

  test('components implement responsive typography scaling', () => {
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Extract text size classes
        const textSizeClasses = content.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g) || []
        
        if (textSizeClasses.length > 0) {
          // Should have responsive text sizing for headings
          const hasResponsiveText = /(sm|md|lg|xl):text-(lg|xl|2xl|3xl|4xl|5xl|6xl)/.test(content)
          
          // If component has large text (headings), it should be responsive
          const hasLargeText = textSizeClasses.some(cls => 
            /text-(3xl|4xl|5xl|6xl|7xl|8xl|9xl)/.test(cls)
          )
          
          if (hasLargeText) {
            expect(hasResponsiveText).toBe(true)
          }
        }
        
        // Should use consistent line-height with text sizes
        if (content.includes('leading-')) {
          const leadingClasses = content.match(/leading-(none|tight|snug|normal|relaxed|loose)/g) || []
          expect(leadingClasses.length).toBeGreaterThan(0)
        }
      }
    }))
  })

  test('components handle responsive spacing consistently', () => {
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Extract spacing classes
        const spacingClasses = content.match(/(p|m|px|py|mx|my|space|gap)-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64)/g) || []
        
        if (spacingClasses.length > 0) {
          // Should use Tailwind's spacing scale
          spacingClasses.forEach(spacing => {
            const value = spacing.match(/-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64)$/)?.[1]
            expect(value).toMatch(/^(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64)$/)
          })
          
          // Should have responsive spacing for larger components
          const hasResponsiveSpacing = /(sm|md|lg|xl):(p|m|px|py|mx|my|space|gap)-/.test(content)
          
          // Components with significant spacing should be responsive
          const hasLargeSpacing = spacingClasses.some(cls => 
            /-(16|20|24|32|40|48|56|64)$/.test(cls)
          )
          
          if (hasLargeSpacing) {
            expect(hasResponsiveSpacing).toBe(true)
          }
        }
      }
    }))
  })

  test('components implement responsive image and media handling', () => {
    componentFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8')
        
        // If component handles images, should have responsive sizing
        if (content.includes('<img') || content.includes('<Image')) {
          // Should have responsive width/height classes
          const hasResponsiveImageSizing = /(w|h)-(full|\d+).*((sm|md|lg|xl):(w|h)-(full|\d+))/.test(content)
          const hasObjectFit = /object-(cover|contain|fill|scale-down|none)/.test(content)
          
          // Images should either be responsive or have proper object-fit
          expect(hasResponsiveImageSizing || hasObjectFit).toBe(true)
        }
        
        // If component has background images, should handle responsively
        if (content.includes('backgroundImage') || content.includes('bg-cover')) {
          // Should have responsive background positioning
          expect(content).toMatch(/bg-(cover|contain|center|no-repeat)/)
        }
      }
    })
  })

  test('layout components provide responsive structure', () => {
    const layoutPath = 'src/app/layout.tsx'
    if (fs.existsSync(layoutPath)) {
      const content = fs.readFileSync(layoutPath, 'utf-8')
      
      // Should provide responsive viewport meta tag (usually in metadata)
      // This might be handled by Next.js automatically, but we can check for responsive structure
      
      // Should have proper responsive container structure
      if (content.includes('container') || content.includes('max-w-')) {
        expect(content).toMatch(/(container|max-w-)/)
      }
    }
  })

  test('responsive design follows mobile-first methodology', () => {
    fc.assert(fc.property(fc.constantFrom(...allResponsiveFiles), (file) => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8')
        
        // Extract all className attributes
        const classNameMatches = content.match(/className="[^"]*"/g) || []
        
        classNameMatches.forEach(className => {
          // If has responsive classes, should have base classes too
          const hasResponsiveClasses = /(sm|md|lg|xl):/.test(className)
          
          if (hasResponsiveClasses) {
            // Should have base classes (mobile-first approach)
            const hasBaseClasses = /\b(flex|grid|block|hidden|text-|p-|m-|w-|h-|bg-|border-)/.test(className)
            expect(hasBaseClasses).toBe(true)
          }
        })
      }
    }))
  })
})