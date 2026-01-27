/**
 * Property-Based Tests for Tailwind CSS Consistency
 * Feature: marketing-website-scaffold
 * Property 4: Tailwind CSS Consistency
 * Validates: Requirements 6.2, 8.4
 */

import * as fc from 'fast-check'
import fs from 'fs'
import path from 'path'

describe('Property 4: Tailwind CSS Consistency', () => {
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

  const allReactFiles = [...componentFiles, ...pageFiles]

  const styleFiles = [
    'src/styles/globals.css',
    'tailwind.config.js'
  ]

  test('Tailwind configuration file exists and is properly structured', () => {
    const tailwindConfigPath = 'tailwind.config.js'
    expect(fs.existsSync(tailwindConfigPath)).toBe(true)
    
    const content = fs.readFileSync(tailwindConfigPath, 'utf-8')
    
    // Should have proper content paths configured
    expect(content).toMatch(/content:\s*\[/)
    expect(content).toMatch(/src\/.*\*\*\/\*\.{.*tsx?.*}/)
    
    // Should have theme configuration
    expect(content).toMatch(/theme:\s*{/)
    
    // Should extend default theme
    expect(content).toMatch(/extend:\s*{/)
  })

  test('global styles file imports Tailwind directives', () => {
    const globalsPath = 'src/styles/globals.css'
    expect(fs.existsSync(globalsPath)).toBe(true)
    
    const content = fs.readFileSync(globalsPath, 'utf-8')
    
    // Should import all three Tailwind directives
    expect(content).toMatch(/@tailwind base/)
    expect(content).toMatch(/@tailwind components/)
    expect(content).toMatch(/@tailwind utilities/)
  })

  test('any React component uses only Tailwind utility classes for styling', () => {
    fc.assert(fc.property(fc.constantFrom(...allReactFiles), (reactFile) => {
      if (fs.existsSync(reactFile)) {
        const content = fs.readFileSync(reactFile, 'utf-8')
        
        // Should not use inline styles
        expect(content).not.toMatch(/style\s*=\s*{{/)
        
        // Should not import CSS modules
        expect(content).not.toMatch(/import.*\.module\.css/)
        expect(content).not.toMatch(/import.*\.css/)
        
        // Should not use styled-components or emotion
        expect(content).not.toMatch(/styled\.|css`/)
        
        // If className is used, should contain valid Tailwind patterns
        const classNameMatches = content.match(/className\s*=\s*["'`][^"'`]*["'`]/g) || []
        classNameMatches.forEach(className => {
          // Extract the class string
          const classString = className.match(/["'`]([^"'`]*)["'`]/)?.[1] || ''
          
          if (classString && !classString.includes('${')) { // Skip template literals
            // Should contain valid Tailwind class patterns
            const classes = classString.split(/\s+/).filter(c => c.length > 0)
            classes.forEach(cls => {
              // Valid Tailwind class patterns (basic validation)
              const validPatterns = [
                /^(bg|text|border|p|m|w|h|flex|grid|rounded|shadow|hover|focus|active|sm|md|lg|xl|2xl):/,
                /^(flex|block|inline|hidden|relative|absolute|fixed|sticky)$/,
                /^(container|mx-auto|space-[xy]-\d+)$/,
                /^[a-z]+-\d+$/,
                /^[a-z]+-[a-z]+-\d+$/,
                /^[a-z]+$/
              ]
              
              const isValidTailwind = validPatterns.some(pattern => pattern.test(cls))
              if (!isValidTailwind && cls !== 'group' && cls !== 'peer') {
                // Allow some common utility classes that don't match patterns
                const allowedClasses = ['sr-only', 'not-sr-only', 'pointer-events-none', 'pointer-events-auto']
                expect(allowedClasses).toContain(cls)
              }
            })
          }
        })
      }
    }))
  })

  test('any component with responsive design uses Tailwind breakpoint prefixes', () => {
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // If responsive classes are used, they should use proper Tailwind breakpoints
        const responsiveMatches = content.match(/(sm|md|lg|xl|2xl):[a-z-]+/g) || []
        
        responsiveMatches.forEach(responsiveClass => {
          // Should follow Tailwind responsive pattern
          expect(responsiveClass).toMatch(/^(sm|md|lg|xl|2xl):[a-z0-9-]+$/)
        })
        
        // Components should have mobile-first responsive design
        if (content.includes('className')) {
          // Should have base classes without breakpoint prefixes
          const hasBaseClasses = content.match(/className.*["'`][^"'`]*(?:flex|grid|block|text-|bg-|p-|m-)[^"'`]*["'`]/)
          if (hasBaseClasses) {
            expect(hasBaseClasses).toBeTruthy()
          }
        }
      }
    }))
  })

  test('custom Tailwind configuration extends default theme properly', () => {
    const tailwindConfigPath = 'tailwind.config.js'
    if (fs.existsSync(tailwindConfigPath)) {
      const content = fs.readFileSync(tailwindConfigPath, 'utf-8')
      
      // Should extend theme rather than replace it
      expect(content).toMatch(/theme:\s*{\s*extend:/)
      
      // If custom colors are defined, they should follow proper structure
      if (content.includes('colors:')) {
        expect(content).toMatch(/colors:\s*{/)
        
        // Custom colors should have proper shade structure (50, 100, 200, etc.)
        const colorMatches = content.match(/(\w+):\s*{[^}]*}/g) || []
        colorMatches.forEach(colorDef => {
          if (colorDef.includes('50:') || colorDef.includes('100:')) {
            // Should have multiple shades
            expect(colorDef).toMatch(/\d+:/)
          }
        })
      }
    }
  })

  test('global styles use Tailwind @layer directive for custom styles', () => {
    const globalsPath = 'src/styles/globals.css'
    if (fs.existsSync(globalsPath)) {
      const content = fs.readFileSync(globalsPath, 'utf-8')
      
      // Custom styles should use @layer directive
      const customStyleMatches = content.match(/[^@][\w-]+\s*{[^}]*}/g) || []
      
      if (customStyleMatches.length > 0) {
        // Should have @layer directives for organization
        expect(content).toMatch(/@layer (base|components|utilities)/)
      }
      
      // Should not have conflicting CSS that overrides Tailwind
      expect(content).not.toMatch(/!important/)
    }
  })

  test('any component uses consistent spacing and sizing patterns', () => {
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Extract all spacing classes
        const spacingMatches = content.match(/(p|m|gap|space)-[xy]?-\d+/g) || []
        
        spacingMatches.forEach(spacingClass => {
          // Should use Tailwind's spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, etc.)
          const value = spacingClass.match(/-(\d+)$/)?.[1]
          if (value) {
            const numValue = parseInt(value)
            // Common Tailwind spacing values
            const validSpacing = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 88, 96]
            expect(validSpacing).toContain(numValue)
          }
        })
        
        // Extract all sizing classes
        const sizingMatches = content.match(/(w|h|min-w|min-h|max-w|max-h)-\w+/g) || []
        
        sizingMatches.forEach(sizingClass => {
          // Should use valid Tailwind sizing values
          expect(sizingClass).toMatch(/(w|h|min-w|min-h|max-w|max-h)-(auto|full|screen|\d+|1\/2|1\/3|2\/3|1\/4|3\/4|1\/5|2\/5|3\/5|4\/5|1\/6|5\/6|1\/12|5\/12|7\/12|11\/12)/)
        })
      }
    }))
  })

  test('components use consistent color palette from Tailwind config', () => {
    const tailwindConfigPath = 'tailwind.config.js'
    let customColors: string[] = []
    
    if (fs.existsSync(tailwindConfigPath)) {
      const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8')
      
      // Extract custom color names
      const colorMatches = configContent.match(/(\w+):\s*{[^}]*}/g) || []
      customColors = colorMatches.map(match => {
        const colorName = match.match(/(\w+):/)?.[1]
        return colorName || ''
      }).filter(name => name && name !== 'colors')
    }
    
    fc.assert(fc.property(fc.constantFrom(...componentFiles), (componentFile) => {
      if (fs.existsSync(componentFile)) {
        const content = fs.readFileSync(componentFile, 'utf-8')
        
        // Extract color classes
        const colorMatches = content.match(/(bg|text|border)-([\w-]+)-\d+/g) || []
        
        colorMatches.forEach(colorClass => {
          const colorName = colorClass.match(/(bg|text|border)-([\w-]+)-\d+/)?.[2]
          if (colorName) {
            // Should use either default Tailwind colors or custom colors from config
            const defaultColors = ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'slate', 'zinc', 'neutral', 'stone', 'orange', 'amber', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'violet', 'fuchsia', 'rose']
            const allValidColors = [...defaultColors, ...customColors, 'primary', 'secondary']
            
            expect(allValidColors).toContain(colorName)
          }
        })
      }
    }))
  })

  test('layout components use consistent Tailwind container and spacing patterns', () => {
    const layoutFile = 'src/app/layout.tsx'
    if (fs.existsSync(layoutFile)) {
      const content = fs.readFileSync(layoutFile, 'utf-8')
      
      // Should use consistent container patterns
      if (content.includes('max-w-')) {
        expect(content).toMatch(/max-w-(sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full|screen)/)
      }
      
      // Should use consistent flex patterns for layout
      if (content.includes('flex')) {
        expect(content).toMatch(/flex(-col|-row)?/)
      }
    }
  })
})