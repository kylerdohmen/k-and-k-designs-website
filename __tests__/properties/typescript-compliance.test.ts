/**
 * Property-Based Tests for TypeScript Compliance
 * Feature: marketing-website-scaffold
 * Property 3: TypeScript Strict Compliance
 * Validates: Requirements 6.1, 4.4
 */

import * as fc from 'fast-check'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

describe('Property 3: TypeScript Strict Compliance', () => {
  const typeDefinitionFiles = [
    'src/types/sanity.types.ts',
    'src/types/component.types.ts'
  ]

  const allTypeScriptFiles = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/app/services/page.tsx',
    ...typeDefinitionFiles
  ]

  test('all type definition files exist and are properly structured', () => {
    typeDefinitionFiles.forEach(file => {
      expect(fs.existsSync(file)).toBe(true)
      
      const content = fs.readFileSync(file, 'utf-8')
      
      // Should have proper TypeScript interface definitions
      expect(content).toMatch(/export interface/)
      
      // Should not use 'any' type
      expect(content).not.toMatch(/:\s*any/)
      
      // Should have proper documentation comments
      expect(content).toMatch(/\/\*\*/)
    })
  })

  test('Sanity CMS content types are properly defined', () => {
    const sanityTypesPath = 'src/types/sanity.types.ts'
    expect(fs.existsSync(sanityTypesPath)).toBe(true)
    
    const content = fs.readFileSync(sanityTypesPath, 'utf-8')
    
    // Required interfaces should be defined
    const requiredInterfaces = [
      'NavigationItem',
      'Service', 
      'SanityImage',
      'HomePageContent',
      'AboutPageContent',
      'SEOData'
    ]
    
    requiredInterfaces.forEach(interfaceName => {
      expect(content).toMatch(new RegExp(`export interface ${interfaceName}`))
    })
  })

  test('Component prop types are properly defined', () => {
    const componentTypesPath = 'src/types/component.types.ts'
    expect(fs.existsSync(componentTypesPath)).toBe(true)
    
    const content = fs.readFileSync(componentTypesPath, 'utf-8')
    
    // Required component prop interfaces should be defined
    const requiredPropTypes = [
      'HeaderProps',
      'FooterProps',
      'HeroProps',
      'ServicesSectionProps'
    ]
    
    requiredPropTypes.forEach(propType => {
      expect(content).toMatch(new RegExp(`export interface ${propType}`))
    })
  })

  test('any TypeScript file uses strict typing without any types', () => {
    fc.assert(fc.property(fc.constantFrom(...allTypeScriptFiles), (tsFile) => {
      if (fs.existsSync(tsFile)) {
        const content = fs.readFileSync(tsFile, 'utf-8')
        
        // Should not use 'any' type explicitly
        expect(content).not.toMatch(/:\s*any(?![a-zA-Z])/)
        
        // Should not have untyped function parameters (but allow functions with no parameters)
        const functionMatches = content.match(/function\s+\w+\s*\([^)]*\)/g) || []
        functionMatches.forEach(func => {
          // Only check functions that have parameters
          const paramMatch = func.match(/\(([^)]*)\)/)
          if (paramMatch && paramMatch[1].trim() && !func.includes('?:')) {
            // If function has parameters, they should be typed
            expect(func).toMatch(/\w+:\s*\w+/)
          }
        })
      }
    }))
  })

  test('any interface in type files has proper structure', () => {
    fc.assert(fc.property(fc.constantFrom(...typeDefinitionFiles), (typeFile) => {
      if (fs.existsSync(typeFile)) {
        const content = fs.readFileSync(typeFile, 'utf-8')
        
        // Extract all interface definitions
        const interfaceMatches = content.match(/export interface \w+\s*{[^}]*}/g) || []
        
        interfaceMatches.forEach(interfaceStr => {
          // Should not contain 'any' type
          expect(interfaceStr).not.toMatch(/:\s*any(?![a-zA-Z])/)
          
          // Should have proper property definitions
          expect(interfaceStr).toMatch(/\w+[?]?:\s*\w+/)
        })
      }
    }))
  })

  test('TypeScript compilation succeeds with strict mode', () => {
    try {
      // Run TypeScript compiler to check for compilation errors
      execSync('npx tsc --noEmit --strict', { 
        stdio: 'pipe',
        cwd: process.cwd()
      })
    } catch (error: any) {
      // If compilation fails, the test should fail
      throw new Error(`TypeScript compilation failed with strict mode: ${error.message}`)
    }
  })

  test('CMS content types properly extend base Sanity types', () => {
    const sanityTypesPath = 'src/types/sanity.types.ts'
    if (fs.existsSync(sanityTypesPath)) {
      const content = fs.readFileSync(sanityTypesPath, 'utf-8')
      
      // Should have base SanityDocument interface
      expect(content).toMatch(/export interface SanityDocument/)
      
      // Page content types should extend SanityDocument
      const pageContentTypes = ['HomePageContent', 'AboutPageContent', 'ServicesPageContent']
      pageContentTypes.forEach(type => {
        if (content.includes(`interface ${type}`)) {
          expect(content).toMatch(new RegExp(`interface ${type}.*extends SanityDocument`))
        }
      })
    }
  })

  test('all type imports are properly resolved', () => {
    const componentTypesPath = 'src/types/component.types.ts'
    if (fs.existsSync(componentTypesPath)) {
      const content = fs.readFileSync(componentTypesPath, 'utf-8')
      
      // Should import from sanity.types.ts
      expect(content).toMatch(/import.*from ['"]\.\/sanity\.types['"]/)
      
      // Should use imported types properly - check for union types and array types
      const importedTypes = ['NavigationItem', 'SanityImage', 'Service', 'CtaButton', 'SocialLink']
      importedTypes.forEach(type => {
        if (content.includes(type)) {
          // Type should be used in interface definitions (including union types and arrays)
          expect(content).toMatch(new RegExp(`(:\\s*${type}|\\|\\s*${type}|${type}\\[\\])`))
        }
      })
    }
  })
})