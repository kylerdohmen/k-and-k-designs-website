import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// Import schemas
import {service} from './schemas/service'
import {homePage} from './schemas/homePage'
import {aboutPage} from './schemas/aboutPage'
import {servicesPage} from './schemas/servicesPage'
import {siteSettings} from './schemas/siteSettings'

export default defineConfig({
  name: 'default',
  title: 'Marketing Website',

  projectId: 'l8zvozfy',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool()
  ],

  schema: {
    types: [
      // Document types
      service,
      homePage,
      aboutPage,
      servicesPage,
      siteSettings
    ],
  },
})