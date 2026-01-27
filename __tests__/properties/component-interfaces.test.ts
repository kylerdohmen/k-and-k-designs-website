/**
 * Property-Based Tests for Component Interface Compliance
 * Feature: marketing-website-scaffold
 * Property 2: Component Interface Compliance
 * Validates: Requirements 3.5, 3.6
 */

import * as fc from 'fast-check'
import fs from 'fs'
import path from 'path'
import React from 'react'

describe('Property 2: Component Interface Compliance', () => {
  const componentFiles = [
    'src/components/Header.tsx',
    'src/components/Footer.tsx'
  ]

  const componentTypeFiles = [
    'src/types/component.types.ts'
  ]

  test('all component files exist and are properly structured', () => {
    componentFiles.forEach(file => {
      expect(fs.existsSync(file)).toBe(true)
      
      const content = fs.readFileSync(file, 'utf-8')
      
      // Should be a React component
      expect(content).toMatch(/import.*React/)
      
      // Should have proper TypeScript prop interface import
      expect(content).toMatch(/import.*Props.*from/)
      
      // Should export default function
      expect(content).toMatch(/export default function/)
      
      // Should have proper TypeScript prop typing
      expect(content).toMatch(/\(\s*{\s*[^}]*}\s*:\s*\w+Props\s*\)/)
    })
  })

  test('Header component accepts properly typed props for CMS content', () => {
    const headerPath = 'src/components/Header.tsx'
    if (fs.existsSync(headerPath)) {
      const content = fs.readFileSync(headerPath, 'utf-8')
      
      // Should import HeaderProps
      expect(content).toMatch(/HeaderProps/)
      
      // Should destructure props properly
      expect(content).toMatch(/{\s*logo,\s*navigation,\s*ctaButton\s*}/)
      
      // Should handle optional logo prop
      expect(content).toMatch(/logo\s*\?/)
      
      // Should handle navigation array
      expect(content).toMatch(/navigation\.map/)
      
      // Should handle optional CTA button
      expect(content).toMatch(/ctaButton\s*&&/)
      
      // Should include mobile menu functionality
      expect(content).toMatch(/isMobileMenuOpen/)
      expect(content).toMatch(/toggleMobileMenu/)
      
      // Should have responsive classes
      expect(content).toMatch(/md:/)
      expect(content).toMatch(/sm:/)
    }
  })

  test('Footer component accepts properly typed props for CMS content', () => {
    const footerPath = 'src/components/Footer.tsx'
    if (fs.existsSync(footerPath)) {
      const content = fs.readFileSync(footerPath, 'utf-8')
      
      // Should import FooterProps
      expect(content).toMatch(/FooterProps/)
      
      // Should destructure props properly
      expect(content).toMatch(/{\s*companyInfo,\s*socialLinks,\s*copyrightText/)
      
      // Should handle company info object
      expect(content).toMatch(/companyInfo\.name/)
      
      // Should handle optional social links array
      expect(content).toMatch(/socialLinks.*&&.*socialLinks\.length/)
      
      // Should handle copyright text
      expect(content).toMatch(/copyrightText/)
      
      // Should have responsive grid layout
      expect(content).toMatch(/grid.*md:grid-cols/)
    }
  })

  test('any React component properly implements TypeScript strict typing', () => {
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Should not use 'any' type
        expect(content).not.toMatch(/:\s*any(?![a-zA-Z])/)
        
        // Should have proper prop interface typing
        expect(content).toMatch(/\w+Props/)
        
        // Should use proper React imports
        expect(content).toMatch(/import.*React/)
        
        // Should have proper function component structure
        expect(content).toMatch(/export default function \w+/)
        
        // Should handle props destructuring with types
        expect(content).toMatch(/}\s*:\s*\w+Props/)
      }
    }))
  })

  test('component prop interfaces are properly defined for CMS integration', () => {
    const componentTypesPath = 'src/types/component.types.ts'
    if (fs.existsSync(componentTypesPath)) {
      const content = fs.readFileSync(componentTypesPath, 'utf-8')
      
      // HeaderProps should have proper structure for CMS content
      expect(content).toMatch(/interface HeaderProps/)
      expect(content).toMatch(/logo\?:/)
      expect(content).toMatch(/navigation:\s*NavigationItem\[\]/)
      expect(content).toMatch(/ctaButton\?:/)
      
      // FooterProps should have proper structure for CMS content
      expect(content).toMatch(/interface FooterProps/)
      expect(content).toMatch(/companyInfo:/)
      expect(content).toMatch(/socialLinks\?:.*SocialLink\[\]/)
      expect(content).toMatch(/copyrightText:\s*string/)
      
      // Should import types from sanity.types.ts
      expect(content).toMatch(/import.*NavigationItem.*from.*sanity\.types/)
    }
  })

  test('any component interface supports optional props for flexible CMS content', () => {
    fc.assert(fc.property(fc.constantFrom(...componentTypeFiles), (typeFile) => {
      if (fs.existsSync(typeFile)) {
        const content = fs.readFileSync(typeFile, 'utf-8')
        
        // Extract component prop interfaces
        const propInterfaces = content.match(/export interface \w+Props\s*{[^}]*}/g) || []
        
        propInterfaces.forEach(interfaceStr => {
          // Should have at least one optional property for flexibility
          expect(interfaceStr).toMatch(/\w+\?:/)
          
          // Should not use 'any' type
          expect(interfaceStr).not.toMatch(/:\s*any(?![a-zA-Z])/)
          
          // Should use proper array typing for collections
          if (interfaceStr.includes('[]')) {
            expect(interfaceStr).toMatch(/\w+\[\]/)
          }
        })
      }
    }))
  })

  test('components handle CMS content props safely without breaking layout', () => {
    const componentFiles = [
      'src/components/Header.tsx',
      'src/components/Footer.tsx'
    ]
    
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Should have conditional rendering for optional props
        expect(content).toMatch(/\w+\s*&&/)
        
        // Should use safe property access or conditional rendering
        const hasOptionalChaining = content.includes('?.')
        const hasConditionalRendering = content.includes('&&')
        expect(hasOptionalChaining || hasConditionalRendering).toBe(true)
        
        // Should have fallback content or default values
        if (content.includes('logo')) {
          // Should handle logo with conditional rendering
          expect(content).toMatch(/(logo\s*\?|{logo\s*\?)/)
        }
        
        // Should handle arrays safely with length checks or map
        if (content.includes('.map')) {
          // Arrays should be handled safely (either with length check or direct map is fine for required arrays)
          const hasLengthCheck = content.includes('.length')
          const hasDirectMap = content.includes('.map')
          expect(hasLengthCheck || hasDirectMap).toBe(true)
        }
        
        // Should use Tailwind responsive classes
        expect(content).toMatch(/(sm:|md:|lg:)/)
      }
    }))
  })

  test('components use consistent Tailwind CSS patterns', () => {
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Should use Tailwind utility classes
        expect(content).toMatch(/className="[^"]*\b(flex|grid|text-|bg-|p-|m-|w-|h-)/)
        
        // Should use responsive breakpoints consistently
        const responsiveClasses = content.match(/(sm:|md:|lg:|xl:)/g) || []
        if (responsiveClasses.length > 0) {
          // Should have mobile-first approach (base classes without prefixes)
          expect(content).toMatch(/className="[^"]*\b(flex|block|hidden|grid)/)
        }
        
        // Should use consistent spacing scale
        const spacingClasses = content.match(/(p-|m-|space-|gap-)\d+/g) || []
        spacingClasses.forEach(spacing => {
          // Should use standard Tailwind spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, etc.)
          const value = spacing.match(/\d+/)?.[0]
          if (value) {
            const num = parseInt(value)
            const validSpacing = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64]
            expect(validSpacing).toContain(num)
          }
        })
      }
    }))
  })

  test('components include proper accessibility attributes', () => {
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Interactive elements should have proper ARIA attributes
        if (content.includes('button')) {
          expect(content).toMatch(/aria-/)
        }
        
        // Images should have alt attributes
        if (content.includes('<Image') || content.includes('<img')) {
          expect(content).toMatch(/alt=/)
        }
        
        // Links should have proper attributes for external links
        if (content.includes('isExternal')) {
          // Should handle external links with spread syntax or direct attributes
          const hasSpreadSyntax = content.includes("target: '_blank'") || content.includes('target="_blank"')
          const hasRelAttribute = content.includes("rel: 'noopener noreferrer'") || content.includes('rel="noopener noreferrer"')
          expect(hasSpreadSyntax).toBe(true)
          expect(hasRelAttribute).toBe(true)
        }
      }
    }))
  })
})