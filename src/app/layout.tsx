import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marketing Website',
  description: 'A professional marketing website built with Next.js',
  keywords: 'marketing, business, professional, services',
  authors: [{ name: 'Your Company' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

// Default navigation items - these will be replaced with CMS content
const defaultNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

// Default company information - these will be replaced with CMS content
const defaultCompanyInfo = {
  name: 'Your Company',
  address: '123 Business Street, City, State 12345',
  phone: '(555) 123-4567',
  email: 'info@yourcompany.com',
}

// Default social links - these will be replaced with CMS content
const defaultSocialLinks = [
  { platform: 'LinkedIn', url: '#', icon: '💼' },
  { platform: 'Twitter', url: '#', icon: '🐦' },
  { platform: 'Facebook', url: '#', icon: '📘' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          {/* Header with fixed positioning to overlay the carousel */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header
              navigation={defaultNavigation}
              ctaButton={{
                text: 'Get Started',
                href: '/contact',
                variant: 'primary'
              }}
            />
          </div>
          
          {/* Main content area */}
          <main>
            {children}
          </main>
          
          {/* Footer */}
          <Footer
            companyInfo={defaultCompanyInfo}
            socialLinks={defaultSocialLinks}
            copyrightText="© {year} Your Company. All rights reserved."
            navigation={defaultNavigation}
          />
        </div>
      </body>
    </html>
  )
}