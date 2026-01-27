/**
 * Property-Based Tests for Project Structure
 * Feature: marketing-website-scaffold
 * Property 1: Page Structure Consistency
 * Validates: Requirements 2.4, 2.5
 */

import * as fc from 'fast-check'
import fs from 'fs'
import path from 'path'

describe('Property 1: Page Structure Consistency', () => {
  const requiredDirectories = [
    'src/app',
    'src/components', 
    'src/lib',
    'src/styles',
    'src/types'
  ]

  const requiredFiles = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/app/services/page.tsx'
  ]

  const configFiles = [
    'package.json',
    'tsconfig.json',
    'tailwind.config.js',
    'next.config.js',
    '.eslintrc.json'
  ]

  test('all required directories exist', () => {
    requiredDirectories.forEach(dir => {
      expect(fs.existsSync(dir)).toBe(true)
    })
  })

  test('all required page files exist and follow Next.js App Router conventions', () => {
    requiredFiles.forEach(file => {
      expect(fs.existsSync(file)).toBe(true)
      
      // Read file content to verify it's a valid React component
      const content = fs.readFileSync(file, 'utf-8')
      expect(content).toMatch(/export default function/)
      expect(content).toMatch(/JSX\.Element/)
    })
  })

  test('all configuration files exist', () => {
    configFiles.forEach(file => {
      expect(fs.existsSync(file)).toBe(true)
    })
  })

  test('any page component follows TypeScript strict typing', () => {
    fc.assert(fc.property(fc.constantFrom(...requiredFiles), (pageFile) => {
      const content = fs.readFileSync(pageFile, 'utf-8')
      
      // Should have proper TypeScript return type annotation
      expect(content).toMatch(/:\s*JSX\.Element/)
      
      // Should not use 'any' type
      expect(content).not.toMatch(/:\s*any/)
      
      // Should be a default export function
      expect(content).toMatch(/export default function/)
    }))
  })

  test('any required directory exists and is accessible', () => {
    fc.assert(fc.property(fc.constantFrom(...requiredDirectories), (directory) => {
      expect(fs.existsSync(directory)).toBe(true)
      expect(fs.statSync(directory).isDirectory()).toBe(true)
    }))
  })

  test('TypeScript configuration enforces strict mode', () => {
    const tsconfigPath = 'tsconfig.json'
    expect(fs.existsSync(tsconfigPath)).toBe(true)
    
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
    expect(tsconfig.compilerOptions.strict).toBe(true)
  })

  test('Next.js App Router structure is properly configured', () => {
    // Verify app directory structure
    expect(fs.existsSync('src/app')).toBe(true)
    expect(fs.existsSync('src/app/layout.tsx')).toBe(true)
    
    // Verify layout.tsx has proper structure
    const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf-8')
    expect(layoutContent).toMatch(/export default function RootLayout/)
    expect(layoutContent).toMatch(/children: React\.ReactNode/)
  })
})