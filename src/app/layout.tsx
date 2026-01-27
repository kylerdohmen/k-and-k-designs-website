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
        <div className="min-h-screen flex flex-col">
          {/* Header with default navigation and CTA */}
          <Header
            navigation={defaultNavigation}
            ctaButton={{
              text: 'Get Started',
              href: '/contact',
              variant: 'primary'
            }}
          />
          
          {/* Main content area */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Footer with company information and social links */}
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